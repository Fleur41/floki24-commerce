import { cacheLife, cacheTag } from "next/cache";
import { cacheTags } from "./cache";
import { isMockShop, storefront } from "./client";
import {
  FILTER_FRAGMENT,
  IMAGE_FRAGMENT,
  PAGE_INFO_FRAGMENT,
  PRODUCT_SUMMARY_FRAGMENT,
  SEO_FRAGMENT,
  gql,
} from "./fragments";
import { paginationVariables, type ListingQuery } from "./listing";
import { mockCatalogProducts, mockCollectionProducts } from "./mock-catalog";
import { withTranslatedHandle } from "./handles";
import { resolveCollectionHandle } from "./mock-shop";
import { reshapeProductSummary, type RawProductSummary } from "./reshape";
import type { Collection, Filter, PageInfo, ProductListing, ProductSummary } from "./types";

const COLLECTION_QUERY = gql(
  /* GraphQL */ `
    query Collection($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
      collection(handle: $handle) {
        id
        handle
        title
        description
        descriptionHtml
        image {
          ...Image
        }
        seo {
          ...Seo
        }
      }
    }
  `,
  IMAGE_FRAGMENT,
  SEO_FRAGMENT,
);

const COLLECTION_PRODUCTS_QUERY = gql(
  /* GraphQL */ `
    query CollectionProducts(
      $handle: String!
      $sortKey: ProductCollectionSortKeys
      $reverse: Boolean
      $filters: [ProductFilter!]
      $first: Int
      $last: Int
      $after: String
      $before: String
      $country: CountryCode
      $language: LanguageCode
    ) @inContext(country: $country, language: $language) {
      collection(handle: $handle) {
        products(
          sortKey: $sortKey
          reverse: $reverse
          filters: $filters
          first: $first
          last: $last
          after: $after
          before: $before
        ) {
          filters {
            ...Filter
          }
          pageInfo {
            ...PageInfo
          }
          nodes {
            ...ProductSummary
          }
        }
      }
    }
  `,
  FILTER_FRAGMENT,
  PAGE_INFO_FRAGMENT,
  PRODUCT_SUMMARY_FRAGMENT,
);

const CATALOG_PRODUCTS_QUERY = gql(
  /* GraphQL */ `
    query CatalogProducts(
      $sortKey: ProductSortKeys
      $reverse: Boolean
      $first: Int
      $last: Int
      $after: String
      $before: String
      $country: CountryCode
      $language: LanguageCode
    ) @inContext(country: $country, language: $language) {
      products(
        sortKey: $sortKey
        reverse: $reverse
        first: $first
        last: $last
        after: $after
        before: $before
      ) {
        pageInfo {
          ...PageInfo
        }
        nodes {
          ...ProductSummary
        }
      }
    }
  `,
  PAGE_INFO_FRAGMENT,
  PRODUCT_SUMMARY_FRAGMENT,
);

type ProductConnection = {
  pageInfo: PageInfo;
  nodes: RawProductSummary[];
};

export async function getCollection(handle: string): Promise<Collection | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(cacheTags.collections);

  return withTranslatedHandle("collection", resolveCollectionHandle(handle), async (candidate) => {
    const data = await storefront<{ collection: Collection | null }>(COLLECTION_QUERY, {
      handle: candidate,
    });
    return data.collection;
  });
}

export async function getCollectionProducts(
  handle: string,
  query: ListingQuery<string>,
): Promise<ProductListing | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(cacheTags.collections, cacheTags.products);

  if (isMockShop) return mockCollectionProducts(resolveCollectionHandle(handle), query);

  return withTranslatedHandle("collection", resolveCollectionHandle(handle), async (candidate) => {
    const data = await storefront<{
      collection: { products: ProductConnection & { filters: Filter[] } } | null;
    }>(COLLECTION_PRODUCTS_QUERY, {
      handle: candidate,
      sortKey: query.sortKey,
      reverse: query.reverse,
      filters: query.filters,
      ...paginationVariables(query),
    });
    if (!data.collection) return null;

    const { nodes, filters, pageInfo } = data.collection.products;
    return { products: nodes.map(reshapeProductSummary), filters, pageInfo };
  });
}

/** Products across the whole catalog — backs the virtual `/collections/all`. */
export async function getCatalogProducts(query: ListingQuery<string>): Promise<ProductListing> {
  "use cache";
  cacheLife("hours");
  cacheTag(cacheTags.products);

  if (isMockShop) return mockCatalogProducts(query);

  const data = await storefront<{ products: ProductConnection }>(CATALOG_PRODUCTS_QUERY, {
    sortKey: query.sortKey,
    reverse: query.reverse,
    ...paginationVariables(query),
  });

  const { nodes, pageInfo } = data.products;
  return { products: nodes.map(reshapeProductSummary), filters: [], pageInfo };
}

/** First products of a collection, for homepage sliders. */
export async function getCollectionPreview(
  handle: string,
  limit: number,
): Promise<ProductSummary[]> {
  const listing = await getCollectionProducts(handle, {
    sortKey: "COLLECTION_DEFAULT",
    reverse: false,
    filters: [],
  });

  return listing?.products.slice(0, limit) ?? [];
}
