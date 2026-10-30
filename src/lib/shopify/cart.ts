import { ShopifyError, storefront } from "./client";
import { CART_FRAGMENT, gql } from "./fragments";
import { reshapeCart, type RawCart } from "./reshape";
import type { Cart } from "./types";

/**
 * Cart operations. These are never cached: a cart belongs to one buyer and
 * must always reflect the latest mutation.
 */

export type CartLineInput = { merchandiseId: string; quantity: number };
export type CartLineUpdateInput = { id: string; quantity: number };

type UserError = { message: string };
type CartPayload = { cart: RawCart | null; userErrors: UserError[] };

const CART_QUERY = gql(
  /* GraphQL */ `
    query Cart($cartId: ID!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
      cart(id: $cartId) {
        ...Cart
      }
    }
  `,
  CART_FRAGMENT,
);

const CART_CREATE_MUTATION = gql(
  /* GraphQL */ `
    mutation CartCreate($lines: [CartLineInput!], $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
      cartCreate(input: { lines: $lines, buyerIdentity: { countryCode: $country } }) {
        cart {
          ...Cart
        }
        userErrors {
          message
        }
      }
    }
  `,
  CART_FRAGMENT,
);

const CART_LINES_ADD_MUTATION = gql(
  /* GraphQL */ `
    mutation CartLinesAdd(
      $cartId: ID!
      $lines: [CartLineInput!]!
      $country: CountryCode
      $language: LanguageCode
    ) @inContext(country: $country, language: $language) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...Cart
        }
        userErrors {
          message
        }
      }
    }
  `,
  CART_FRAGMENT,
);

const CART_LINES_UPDATE_MUTATION = gql(
  /* GraphQL */ `
    mutation CartLinesUpdate(
      $cartId: ID!
      $lines: [CartLineUpdateInput!]!
      $country: CountryCode
      $language: LanguageCode
    ) @inContext(country: $country, language: $language) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...Cart
        }
        userErrors {
          message
        }
      }
    }
  `,
  CART_FRAGMENT,
);

const CART_LINES_REMOVE_MUTATION = gql(
  /* GraphQL */ `
    mutation CartLinesRemove(
      $cartId: ID!
      $lineIds: [ID!]!
      $country: CountryCode
      $language: LanguageCode
    ) @inContext(country: $country, language: $language) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...Cart
        }
        userErrors {
          message
        }
      }
    }
  `,
  CART_FRAGMENT,
);

function unwrapPayload(payload: CartPayload, operation: string): Cart {
  if (payload.userErrors.length || !payload.cart) {
    const message = payload.userErrors.map((error) => error.message).join("\n");
    throw new ShopifyError(message || "Cart mutation returned no cart", operation);
  }
  return reshapeCart(payload.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await storefront<{ cart: RawCart | null }>(CART_QUERY, { cartId });
  // Shopify expires abandoned carts; an unknown id simply means "no cart".
  return data.cart && reshapeCart(data.cart);
}

export async function createCart(lines: CartLineInput[]): Promise<Cart> {
  const data = await storefront<{ cartCreate: CartPayload }>(CART_CREATE_MUTATION, { lines });
  return unwrapPayload(data.cartCreate, "cartCreate");
}

export async function addCartLines(cartId: string, lines: CartLineInput[]): Promise<Cart> {
  const data = await storefront<{ cartLinesAdd: CartPayload }>(CART_LINES_ADD_MUTATION, {
    cartId,
    lines,
  });
  return unwrapPayload(data.cartLinesAdd, "cartLinesAdd");
}

export async function updateCartLines(cartId: string, lines: CartLineUpdateInput[]): Promise<Cart> {
  const data = await storefront<{ cartLinesUpdate: CartPayload }>(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines,
  });
  return unwrapPayload(data.cartLinesUpdate, "cartLinesUpdate");
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<Cart> {
  const data = await storefront<{ cartLinesRemove: CartPayload }>(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds,
  });
  return unwrapPayload(data.cartLinesRemove, "cartLinesRemove");
}
