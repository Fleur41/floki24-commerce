import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { getDictionary } from "@/i18n/server";
import { cacheTags } from "./cache";
import { storefront } from "./client";
import { PRODUCT_SUMMARY_FRAGMENT, gql } from "./fragments";
import { PRODUCTS_PER_PAGE, type ListingQuery, type ProductFilterInput } from "./listing";
import { reshapeProductSummary, type RawProductSummary } from "./reshape";
import { scoreProduct } from "./text-search";
import type {
  Filter,
  PageInfo,
  PredictiveSearchResult,
  ProductListing,
  ProductSummary,
} from "./types";

/**
 * Listings for the mock.shop demo catalog. Its search ignores the vendor and
 * returns many unrelated products, and it has no filters at all, so the (small)
 * catalog is loaded once and searched, filtered, sorted and paginated here.
 * A real store keeps using Shopify's search and filters.
 */

const COLLECTION_PRODUCT_IDS_QUERY = gql(/* GraphQL */ `
  query MockCollectionProductIds($handle: String!, $after: String) {
    collection(handle: $handle) {
      products(first: 250, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
        }
      }
    }
  }
`);

const CATALOG_QUERY = gql(
  /* GraphQL */ `
    query MockCatalog($after: String) {
      products(first: 250, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...ProductSummary
          productType
          tags
        }
      }
    }
  `,
  PRODUCT_SUMMARY_FRAGMENT,
);

/** Safety stop, far above the demo catalog's size. */
const MAX_CATALOG_PAGES = 10;
const PREDICTIVE_LIMIT = 6;

type CatalogProduct = ProductSummary & { productType: string; tags: string[] };

async function getCatalog(): Promise<CatalogProduct[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(cacheTags.products);

  const products: CatalogProduct[] = [];
  let after: string | null = null;
  for (let page = 0; page < MAX_CATALOG_PAGES; page++) {
    const data: {
      products: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        nodes: (RawProductSummary & { productType: string; tags: string[] })[];
      };
    } = await storefront(CATALOG_QUERY, { after });
    for (const { productType, tags, ...product } of data.products.nodes) {
      products.push({ ...reshapeProductSummary(product), productType, tags });
    }
    if (!data.products.pageInfo.hasNextPage) break;
    after = data.products.pageInfo.endCursor;
  }
  return products;
}

/** Collection order (Shopify's "Ausgewählt"), or null when the collection doesn't exist. */
async function getCollectionProductIds(handle: string): Promise<string[] | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(cacheTags.collections, cacheTags.products);

  const ids: string[] = [];
  let after: string | null = null;
  for (let page = 0; page < MAX_CATALOG_PAGES; page++) {
    const data: {
      collection: {
        products: {
          pageInfo: { hasNextPage: boolean; endCursor: string | null };
          nodes: { id: string }[];
        };
      } | null;
    } = await storefront(COLLECTION_PRODUCT_IDS_QUERY, { handle, after });
    if (!data.collection) return null;
    ids.push(...data.collection.products.nodes.map((node) => node.id));
    if (!data.collection.products.pageInfo.hasNextPage) break;
    after = data.collection.products.pageInfo.endCursor;
  }
  return ids;
}

/** `score` orders the default sort: search relevance, or the original list order. */
type Match = { product: CatalogProduct; score: number };

/** Keeps the given order as the default ("featured"/"best selling") sort. */
const inListOrder = (products: CatalogProduct[]): Match[] =>
  products.map((product, index) => ({ product, score: -index }));

async function findMatches(searchTerm: string): Promise<Match[]> {
  const catalog = await getCatalog();
  return catalog.flatMap((product) => {
    const score = scoreProduct(searchTerm, product);
    return score === null ? [] : [{ product, score }];
  });
}

/** Filters of the same kind are alternatives (OR); different kinds narrow further (AND). */
function applyFilters(matches: Match[], filters: ProductFilterInput[]): Match[] {
  const groups = new Map<string, unknown[]>();
  for (const filter of filters) {
    for (const [key, value] of Object.entries(filter)) {
      groups.set(key, [...(groups.get(key) ?? []), value]);
    }
  }

  return matches.filter(({ product }) =>
    [...groups].every(([key, values]) => {
      if (key === "available") return values.includes(product.availableForSale);
      if (key === "productType") return values.includes(product.productType);
      if (key === "productVendor") return values.includes(product.vendor);
      return true;
    }),
  );
}

/** PRICE and TITLE sort by those fields; every other key keeps the default order. */
function sortMatches(matches: Match[], sortKey: string, reverse: boolean): Match[] {
  const price = ({ product }: Match) => Number(product.priceRange.minVariantPrice.amount);
  const sorted = [...matches].sort((a, b) => {
    if (sortKey === "PRICE") return price(a) - price(b);
    if (sortKey === "TITLE") return a.product.title.localeCompare(b.product.title);
    return b.score - a.score || a.product.title.localeCompare(b.product.title);
  });
  return reverse ? sorted.reverse() : sorted;
}

/** Cursors are positions in the result list, like Shopify's opaque cursors but readable. */
function paginate<T>(items: T[], { after, before }: { after?: string; before?: string }) {
  let start = 0;
  if (before !== undefined) start = Math.max(0, Number(before) - PRODUCTS_PER_PAGE);
  else if (after !== undefined) start = Number(after) + 1;
  if (!Number.isInteger(start) || start < 0) start = 0;

  const end = Math.min(items.length, start + PRODUCTS_PER_PAGE);
  const pageInfo: PageInfo = {
    hasPreviousPage: start > 0,
    hasNextPage: end < items.length,
    startCursor: String(start),
    endCursor: String(end - 1),
  };
  return { items: items.slice(start, end), pageInfo };
}

function listFilter(id: string, label: string, inputKey: string, values: string[]): Filter | null {
  const counts = new Map<string, number>();
  for (const value of values) if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  if (counts.size === 0) return null;

  return {
    id,
    label,
    type: "LIST",
    values: [...counts]
      .sort(([a, countA], [b, countB]) => countB - countA || a.localeCompare(b))
      .map(([value, count]) => ({
        id: `${id}.${value}`,
        label: value,
        count,
        input: JSON.stringify({ [inputKey]: value }),
      })),
  };
}

/** Filter options with counts for the matching products, like Shopify's `productFilters`. */
async function buildFilters(matches: Match[]): Promise<Filter[]> {
  const { listing } = await getDictionary();
  const inStock = matches.filter(({ product }) => product.availableForSale).length;

  const availability: Filter = {
    id: "filter.v.availability",
    label: listing.availability,
    type: "LIST",
    values: [
      {
        id: "filter.v.availability.1",
        label: listing.inStock,
        count: inStock,
        input: '{"available":true}',
      },
      {
        id: "filter.v.availability.0",
        label: listing.outOfStock,
        count: matches.length - inStock,
        input: '{"available":false}',
      },
    ],
  };

  return [
    availability,
    listFilter(
      "filter.p.product_type",
      listing.productType,
      "productType",
      matches.map(({ product }) => product.productType),
    ),
    listFilter(
      "filter.p.vendor",
      listing.vendor,
      "productVendor",
      matches.map(({ product }) => product.vendor),
    ),
  ].filter((filter): filter is Filter => filter !== null);
}

/** One page of `matches` after the query's filters and sort, plus the filter options. */
async function toListing(
  matches: Match[],
  query: ListingQuery<string>,
): Promise<ProductListing & { totalCount: number }> {
  const filtered = sortMatches(applyFilters(matches, query.filters), query.sortKey, query.reverse);
  const { items, pageInfo } = paginate(filtered, query);

  return {
    products: items.map(({ product }) => product),
    filters: await buildFilters(matches),
    pageInfo,
    totalCount: filtered.length,
  };
}

export async function mockSearchProducts(searchTerm: string, query: ListingQuery<string>) {
  return toListing(await findMatches(searchTerm), query);
}

export async function mockCollectionProducts(
  handle: string,
  query: ListingQuery<string>,
): Promise<ProductListing | null> {
  const [ids, catalog] = await Promise.all([getCollectionProductIds(handle), getCatalog()]);
  if (!ids) return null;

  const byId = new Map(catalog.map((product) => [product.id, product]));
  const products = ids.flatMap((id) => byId.get(id) ?? []);
  return toListing(inListOrder(products), query);
}

export async function mockCatalogProducts(query: ListingQuery<string>): Promise<ProductListing> {
  return toListing(inListOrder(await getCatalog()), query);
}

/** mock.shop's `productTypes` query returns nothing, so the types are read from the catalog. */
export async function mockProductTypes(): Promise<string[]> {
  const catalog = await getCatalog();
  return [...new Set(catalog.map((product) => product.productType).filter(Boolean))].sort();
}

export async function mockPredictiveSearch(searchTerm: string): Promise<PredictiveSearchResult> {
  const matches = sortMatches(await findMatches(searchTerm), "RELEVANCE", false);
  return {
    products: matches.slice(0, PREDICTIVE_LIMIT).map(({ product }) => product),
    queries: [],
  };
}
