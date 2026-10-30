import "server-only";
import { createHash, randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import type { Customer, CustomerAccessToken } from "./types";

/**
 * mock.shop has no customer accounts (`customerCreate` returns null), so
 * without store credentials accounts live in a local JSON file instead. It
 * mirrors the Storefront API's behaviour and error codes closely enough for
 * the account pages to be exercised end to end during development.
 */

const STORE_FILE = path.join(process.cwd(), ".data", "mock-customers.json");
// Shopify issues customer access tokens that are valid for 30 days.
const TOKEN_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  length: number,
) => Promise<Buffer>;

type StoredToken = { tokenHash: string; expiresAt: string };

type StoredCustomer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  acceptsMarketing: boolean;
  passwordHash: string;
  tokens: StoredToken[];
};

export class MockCustomerError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "MockCustomerError";
  }
}

async function readStore(): Promise<StoredCustomer[]> {
  try {
    return JSON.parse(await readFile(STORE_FILE, "utf8")) as StoredCustomer[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

// Writes are serialized so concurrent requests can't overwrite each other.
let queue: Promise<unknown> = Promise.resolve();

function updateStore<T>(update: (customers: StoredCustomer[]) => T | Promise<T>): Promise<T> {
  const next = queue.then(async () => {
    const customers = await readStore();
    const result = await update(customers);
    await mkdir(path.dirname(STORE_FILE), { recursive: true });
    await writeFile(STORE_FILE, JSON.stringify(customers, null, 2));
    return result;
  });
  queue = next.catch(() => {});
  return next;
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  const candidate = await scryptAsync(password, Buffer.from(salt, "hex"), 64);
  return timingSafeEqual(candidate, Buffer.from(hash, "hex"));
}

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
const normalizeEmail = (email: string) => email.trim().toLowerCase();

export type MockCustomerInput = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptsMarketing?: boolean;
};

export function createMockCustomer(input: MockCustomerInput): Promise<void> {
  const email = normalizeEmail(input.email);

  return updateStore(async (customers) => {
    if (customers.some((customer) => customer.email === email)) {
      throw new MockCustomerError("TAKEN", "Email has already been taken");
    }
    customers.push({
      id: `gid://shopify/Customer/${randomUUID()}`,
      firstName: input.firstName || null,
      lastName: input.lastName || null,
      email,
      acceptsMarketing: input.acceptsMarketing ?? false,
      passwordHash: await hashPassword(input.password),
      tokens: [],
    });
  });
}

export function createMockAccessToken(
  email: string,
  password: string,
): Promise<CustomerAccessToken> {
  return updateStore(async (customers) => {
    const customer = customers.find((entry) => entry.email === normalizeEmail(email));
    if (!customer || !(await verifyPassword(password, customer.passwordHash))) {
      throw new MockCustomerError("UNIDENTIFIED_CUSTOMER", "Unidentified customer");
    }

    const accessToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + TOKEN_LIFETIME_MS).toISOString();
    const now = new Date().toISOString();
    customer.tokens = customer.tokens.filter((token) => token.expiresAt > now);
    customer.tokens.push({ tokenHash: hashToken(accessToken), expiresAt });
    return { accessToken, expiresAt };
  });
}

export async function getMockCustomer(accessToken: string): Promise<Customer | null> {
  const tokenHash = hashToken(accessToken);
  const now = new Date().toISOString();
  const customer = (await readStore()).find((entry) =>
    entry.tokens.some((token) => token.tokenHash === tokenHash && token.expiresAt > now),
  );
  if (!customer) return null;

  return {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    acceptsMarketing: customer.acceptsMarketing,
    orders: [],
  };
}

export function deleteMockAccessToken(accessToken: string): Promise<void> {
  const tokenHash = hashToken(accessToken);
  return updateStore((customers) => {
    for (const customer of customers) {
      customer.tokens = customer.tokens.filter((token) => token.tokenHash !== tokenHash);
    }
  });
}
