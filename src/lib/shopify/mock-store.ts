import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Tiny JSON-file persistence for the parts of Shopify that mock.shop doesn't
 * provide (customer accounts, orders). Only used without store credentials.
 */

const DATA_DIR = path.join(process.cwd(), ".data");

export async function readMockStore<T>(name: string): Promise<T[]> {
  try {
    return JSON.parse(await readFile(path.join(DATA_DIR, `${name}.json`), "utf8")) as T[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

// Writes are serialized so concurrent requests can't overwrite each other.
let queue: Promise<unknown> = Promise.resolve();

/** Loads a store, lets `update` mutate the records in place, then saves it. */
export function updateMockStore<T, R>(
  name: string,
  update: (records: T[]) => R | Promise<R>,
): Promise<R> {
  const next = queue.then(async () => {
    const records = await readMockStore<T>(name);
    const result = await update(records);
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(path.join(DATA_DIR, `${name}.json`), JSON.stringify(records, null, 2));
    return result;
  });
  queue = next.catch(() => {});
  return next;
}
