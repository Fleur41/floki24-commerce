"use server";

import { getRequestDictionary } from "@/i18n/server";
import { getSessionCart, saveSessionCartId } from "@/lib/cart-session";
import { addCartLines, createCart, removeCartLines, updateCartLines } from "@/lib/shopify/cart";
import type { Cart } from "@/lib/shopify/types";

export type CartActionResult = { ok: true; cart: Cart } | { ok: false; error: string };

const MAX_LINE_QUANTITY = 999;

// Server actions are public endpoints, so their arguments are validated here.
function isValidQuantity(quantity: number, min: number): boolean {
  return Number.isInteger(quantity) && quantity >= min && quantity <= MAX_LINE_QUANTITY;
}

async function invalidQuantity(): Promise<CartActionResult> {
  const { cart } = await getRequestDictionary();
  return { ok: false, error: cart.invalidQuantity };
}

async function runCartAction(action: () => Promise<Cart>): Promise<CartActionResult> {
  try {
    return { ok: true, cart: await action() };
  } catch (error) {
    console.error("Cart action failed", error);
    const { cart } = await getRequestDictionary();
    return { ok: false, error: cart.updateFailed };
  }
}

export async function addToCart(
  merchandiseId: string,
  quantity: number,
): Promise<CartActionResult> {
  if (!isValidQuantity(quantity, 1)) return invalidQuantity();

  return runCartAction(async () => {
    const lines = [{ merchandiseId, quantity }];
    const cart = await getSessionCart();
    if (cart) return addCartLines(cart.id, lines);

    const newCart = await createCart(lines);
    await saveSessionCartId(newCart.id);
    return newCart;
  });
}

export async function updateCartLineQuantity(
  lineId: string,
  quantity: number,
): Promise<CartActionResult> {
  if (!isValidQuantity(quantity, 0)) return invalidQuantity();

  return runCartAction(async () => {
    const cart = await requireSessionCart();
    return quantity > 0
      ? updateCartLines(cart.id, [{ id: lineId, quantity }])
      : removeCartLines(cart.id, [lineId]);
  });
}

async function requireSessionCart(): Promise<Cart> {
  const cart = await getSessionCart();
  if (!cart) throw new Error("No cart in session");
  return cart;
}
