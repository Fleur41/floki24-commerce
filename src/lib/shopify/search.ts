import { cacheLife, cacheTag } from "next/cache";
import { cacheTags } from "./cache";
import { isMockShop, storefront } from "./client";
import { FILTER_FRAGMENT, PAGE_INFO_FRAGMENT, PRODUCT_SUMMARY_FRAGMENT, gql } from "./fragments";
import { paginationVariables, type ListingQuery } from "./listing";
import { mockPredictiveSearch, mockSearchProducts } from "./mock-search";
import { reshapeProductSummary, type RawProductSummary } from "./reshape";
import type { Filter, PageInfo, PredictiveSearchResult, ProductListing } from "./types";

const SEARCH_QUERY = gql(
  /* GraphQL */ `
    query Search(
      $query: String!
      $sortKey: SearchSortKeys
      $reverse: Boolean
      $filters: [ProductFilter!]
      $first: Int
      $last: Int
      $after: String
      $before: String
      $country: CountryCode
      $language: LanguageCode
    ) @inContext(country: $country, language: $language) {
      search(
        query: $query
        types: [PRODUCT]
        sortKey: $sortKey
        reverse: $reverse
        productFilters: $filters
        first: $first
        last: $last
        after: $after
        before: $before
      ) {
        totalCount
        productFilters {
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
  `,
  FILTER_FRAGMENT,
  PAGE_INFO_FRAGMENT,
  PRODUCT_SUMMARY_FRAGMENT,
);

const PREDICTIVE_SEARCH_QUERY = gql(
  /* GraphQL */ `
    query PredictiveSearch($query: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
      predictiveSearch(query: $query, limit: 6, types: [PRODUCT, QUERY]) {
        products {
          ...ProductSummary
        }
        queries {
          text
        }
      }
    }
  `,
  PRODUCT_SUMMARY_FRAGMENT,
);

export type SearchResult = ProductListing & { totalCount: number };

export async function searchProducts(
  searchTerm: string,
  query: ListingQuery<string>,
): Promise<SearchResult> {
  "use cache";
  cacheLife("minutes");
  cacheTag(cacheTags.products);

  if (isMockShop) return mockSearchProducts(searchTerm, query);

  const data = await storefront<{
    search: {
      totalCount: number;
      productFilters: Filter[];
      pageInfo: PageInfo;
      nodes: RawProductSummary[];
    };
  }>(SEARCH_QUERY, {
    query: searchTerm,
    sortKey: query.sortKey,
    reverse: query.reverse,
    filters: query.filters,
    ...paginationVariables(query),
  });

  const { totalCount, productFilters, pageInfo, nodes } = data.search;
  return {
    products: nodes.map(reshapeProductSummary),
    filters: productFilters,
    pageInfo,
    totalCount,
  };
}

export async function predictiveSearch(searchTerm: string): Promise<PredictiveSearchResult> {
  "use cache";
  cacheLife("minutes");
  cacheTag(cacheTags.products);

  if (isMockShop) return mockPredictiveSearch(searchTerm);

  const data = await storefront<{
    predictiveSearch: { products: RawProductSummary[]; queries: { text: string }[] } | null;
  }>(PREDICTIVE_SEARCH_QUERY, { query: searchTerm });

  return {
    products: data.predictiveSearch?.products.map(reshapeProductSummary) ?? [],
    queries: data.predictiveSearch?.queries.map((query) => query.text) ?? [],
  };
}
