import "server-only";
import { cookies } from "next/headers";
import { lang } from "next/root-params";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "@/i18n/config";

const API_VERSION = "2026-10";

/** Offline demo catalog, used with `SHOPIFY_STORE_DOMAIN=mock.shop`. */
const MOCK_SHOP_ENDPOINT = "https://home-large-catalog.mock.shop/api";

/**
 * Without configuration the app reads floki24.ch's live catalogue through
 * Shopify's tokenless Storefront API (products, collections, search, cart).
 */
const DEFAULT_STORE_DOMAIN = "floki24.ch";

const storeDomain = process.env.SHOPIFY_STORE_DOMAIN || DEFAULT_STORE_DOMAIN;
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

/** mock.shop's search, filters and product types need the local catalog layer. */
export const isMockShop = storeDomain === "mock.shop";

/**
 * Customer accounts need a Storefront access token, so without one they're
 * kept locally (see `mock-customers.ts`).
 */
export const usesLocalAccounts = isMockShop || !accessToken;

/**
 * Without a token we're a guest on someone else's store: checkout stays in
 * the app (no payment) instead of placing real orders in its Shopify checkout.
 */
export const usesDemoCheckout = isMockShop || !accessToken;

const endpoint = isMockShop
  ? MOCK_SHOP_ENDPOINT
  : `https://${storeDomain}/api/${API_VERSION}/graphql.json`;

export class ShopifyError extends Error {
  constructor(
    message: string,
    readonly query: string,
  ) {
    super(message);
    this.name = "ShopifyError";
  }
}

type GraphQLResponse<TData> = {
  data?: TData;
  errors?: { message: string }[];
};

/**
 * Language of the current request, for translated products and collections:
 * the page's `[lang]` segment, or the locale cookie in Server Actions, which
 * have no root params. Route Handlers can't use either inside cached
 * functions, so they pass the language explicitly.
 */
async function requestLanguage(): Promise<Locale> {
  let locale: string | undefined;
  try {
    locale = await lang();
  } catch {
    locale = (await cookies()).get(LOCALE_COOKIE)?.value;
  }
  return isLocale(locale) ? locale : defaultLocale;
}

type StorefrontOptions = {
  /** Overrides the request's language (see `requestLanguage`). */
  locale?: Locale;
};

/** Executes a Storefront API operation. */
export async function storefront<TData, TVariables = Record<string, unknown>>(
  query: string,
  variables?: TVariables,
  options: StorefrontOptions = {},
): Promise<TData> {
  // Buyer context, used by queries through `@inContext(country:, language:)`
  // so prices, availability and translations match the Swiss storefront.
  const buyerContext = {
    country: "CH",
    language: (options.locale ?? (await requestLanguage())).toUpperCase(),
  };
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && !isMockShop && { "X-Shopify-Storefront-Access-Token": accessToken }),
    },
    body: JSON.stringify({ query, variables: { ...buyerContext, ...variables } }),
  });

  if (!response.ok) {
    throw new ShopifyError(`Storefront API responded with ${response.status}`, query);
  }

  const { data, errors } = (await response.json()) as GraphQLResponse<TData>;

  if (errors?.length) {
    throw new ShopifyError(errors.map((error) => error.message).join("\n"), query);
  }
  if (!data) {
    throw new ShopifyError("Storefront API returned no data", query);
  }

  return data;
}
