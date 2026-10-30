import "server-only";

const API_VERSION = "2026-10";

/** Public demo catalog used when no store credentials are configured. */
const MOCK_SHOP_ENDPOINT = "https://home-large-catalog.mock.shop/api";

const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export const isMockShop = !storeDomain || !accessToken;

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
 * Buyer context passed to every operation. Queries opt in through
 * `@inContext(country: $country, language: $language)` so prices,
 * translations and availability match the Swiss storefront.
 */
const buyerContext = { country: "CH", language: "DE" } as const;

/** Executes a Storefront API operation. */
export async function storefront<TData, TVariables = Record<string, unknown>>(
  query: string,
  variables?: TVariables,
): Promise<TData> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { "X-Shopify-Storefront-Access-Token": accessToken }),
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
