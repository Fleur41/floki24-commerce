import "server-only";
import { cookies } from "next/headers";
import { getCart } from "@/lib/shopify/cart";
import type { Cart } from "@/lib/shopify/types";

const CART_COOKIE = "cartId";
// Shopify keeps inactive carts for ten days; there is no point in a longer cookie.
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 10;

/** The visitor's current cart, or `null` when they have none (or it expired). */
export async function getSessionCart(): Promise<Cart | null> {
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  return cartId ? getCart(cartId) : null;
}

export async function saveSessionCartId(cartId: string): Promise<void> {
  (await cookies()).set(CART_COOKIE, cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
  });
}

/** Forgets the cart, e.g. once it has been turned into an order. */
export async function clearSessionCart(): Promise<void> {
  (await cookies()).delete(CART_COOKIE);
}
