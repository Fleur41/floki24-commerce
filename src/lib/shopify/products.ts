import { cacheLife, cacheTag } from "next/cache";
import { cacheTags } from "./cache";
import { isMockShop, storefront } from "./client";
import { PRODUCT_FRAGMENT, PRODUCT_SUMMARY_FRAGMENT, gql } from "./fragments";
import {
  reshapeProduct,
  reshapeProductSummary,
  type RawProduct,
  type RawProductSummary,
} from "./reshape";
import { mockProductTypes } from "./mock-search";
import type { Product, ProductSummary } from "./types";

const PRODUCT_QUERY = gql(
  /* GraphQL */ `
    query Product($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
      product(handle: $handle) {
        ...Product
      }
    }
  `,
  PRODUCT_FRAGMENT,
);

const PRODUCT_RECOMMENDATIONS_QUERY = gql(
  /* GraphQL */ `
    query ProductRecommendations($productId: ID!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
      productRecommendations(productId: $productId) {
        ...ProductSummary
      }
    }
  `,
  PRODUCT_SUMMARY_FRAGMENT,
);

const PRODUCT_TYPES_QUERY = /* GraphQL */ `
  query ProductTypes {
    productTypes(first: 250) {
      nodes
    }
  }
`;

export async function getProduct(handle: string): Promise<Product | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(cacheTags.products);

  const data = await storefront<{ product: RawProduct | null }>(PRODUCT_QUERY, { handle });
  return data.product && reshapeProduct(data.product);
}

export async function getProductRecommendations(productId: string): Promise<ProductSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(cacheTags.products);

  const data = await storefront<{ productRecommendations: RawProductSummary[] | null }>(
    PRODUCT_RECOMMENDATIONS_QUERY,
    { productId },
  );
  return data.productRecommendations?.map(reshapeProductSummary) ?? [];
}

/** Product types feed the "Alle Kategorien" dropdown of the header search. */
export async function getProductTypes(): Promise<string[]> {
  "use cache";
  cacheLife("days");
  cacheTag(cacheTags.products);

  if (isMockShop) return mockProductTypes();

  const data = await storefront<{ productTypes: { nodes: string[] } }>(PRODUCT_TYPES_QUERY);
  return data.productTypes.nodes.filter(Boolean);
}
