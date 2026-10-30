"use client";

import { createContext, use, useCallback, useMemo, useState, type ReactNode } from "react";
import type { Cart, CartLine } from "@/lib/shopify/types";
import { addToCart, updateCartLineQuantity, type CartActionResult } from "./actions";

type CartContextValue = {
  /** Cart fetched on the server for the first render. */
  initialCart: Promise<Cart | null>;
  /** Latest cart returned by a mutation; `undefined` until the first one. */
  updatedCart: Cart | null | undefined;
  addItem: (merchandiseId: string, quantity: number) => Promise<CartActionResult>;
  /** Setting the quantity to 0 removes the line. */
  updateQuantity: (lineId: string, quantity: number) => Promise<CartActionResult>;
  /** The line just added, shown in the "added to cart" dialog. */
  addedLine: CartLine | null;
  dismissAddedLine: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

type CartProviderProps = {
  cartPromise: Promise<Cart | null>;
  children: ReactNode;
};

/**
 * Holds the visitor's cart. The server passes an unresolved promise so the
 * page shell can render immediately; components read it through `useCart`
 * inside a Suspense boundary.
 */
export function CartProvider({ cartPromise, children }: CartProviderProps) {
  const [updatedCart, setUpdatedCart] = useState<Cart | null | undefined>(undefined);
  const [addedLine, setAddedLine] = useState<CartLine | null>(null);

  const applyResult = useCallback((result: CartActionResult) => {
    if (result.ok) setUpdatedCart(result.cart);
    return result;
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      initialCart: cartPromise,
      updatedCart,
      addItem: async (merchandiseId, quantity) => {
        const result = applyResult(await addToCart(merchandiseId, quantity));
        if (result.ok) {
          setAddedLine(
            result.cart.lines.find((line) => line.merchandise.id === merchandiseId) ?? null,
          );
        }
        return result;
      },
      updateQuantity: async (lineId, quantity) =>
        applyResult(await updateCartLineQuantity(lineId, quantity)),
      addedLine,
      dismissAddedLine: () => setAddedLine(null),
    }),
    [cartPromise, updatedCart, addedLine, applyResult],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

function useCartContext(): CartContextValue {
  const context = use(CartContext);
  if (!context) throw new Error("Cart hooks must be used inside <CartProvider>");
  return context;
}

/** The current cart. Suspends until the initial cart has loaded. */
export function useCart(): Cart | null {
  const { initialCart, updatedCart } = useCartContext();
  return updatedCart === undefined ? use(initialCart) : updatedCart;
}

/** Cart mutations; never suspends, so it is safe in buttons outside Suspense. */
export function useCartActions() {
  const { addItem, updateQuantity, addedLine, dismissAddedLine } = useCartContext();
  return { addItem, updateQuantity, addedLine, dismissAddedLine };
}
