import "server-only";
import { cookies } from "next/headers";
import { getCustomer } from "@/lib/shopify/customers";
import type { Customer, CustomerAccessToken } from "@/lib/shopify/types";

const CUSTOMER_COOKIE = "customerAccessToken";

/** The logged-in customer, or `null` for guests and expired sessions. */
export async function getSessionCustomer(): Promise<Customer | null> {
  const accessToken = (await cookies()).get(CUSTOMER_COOKIE)?.value;
  return accessToken ? getCustomer(accessToken) : null;
}

export async function saveCustomerSession({
  accessToken,
  expiresAt,
}: CustomerAccessToken): Promise<void> {
  (await cookies()).set(CUSTOMER_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

/** Ends the session and returns the access token it held, so it can be revoked. */
export async function clearCustomerSession(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(CUSTOMER_COOKIE)?.value;
  cookieStore.delete(CUSTOMER_COOKIE);
  return accessToken;
}
