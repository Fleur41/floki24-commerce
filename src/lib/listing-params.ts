import { parseFilterParams, type ListingQuery } from "@/lib/shopify/listing";
import { resolveSortOption, type SortOption } from "@/lib/shopify/sorting";

/** Search params as Next.js passes them to pages. */
export type SearchParams = Record<string, string | string[] | undefined>;

/** URL parameter names shared by the server pages and the client controls. */
export const listingParamNames = {
  sort: "sort_by",
  filter: "filter",
  after: "after",
  before: "before",
} as const;

export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function allParams(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

/** Reads sorting, filters and the pagination cursor of a product listing from the URL. */
export function readListingQuery<TSortKey extends string>(
  searchParams: SearchParams,
  sortOptions: SortOption<TSortKey>[],
): { sortValue: string; query: ListingQuery<TSortKey> } {
  const sort = resolveSortOption(sortOptions, firstParam(searchParams[listingParamNames.sort]));

  return {
    sortValue: sort.value,
    query: {
      sortKey: sort.sortKey,
      reverse: sort.reverse,
      filters: parseFilterParams(allParams(searchParams[listingParamNames.filter])),
      after: firstParam(searchParams[listingParamNames.after]),
      before: firstParam(searchParams[listingParamNames.before]),
    },
  };
}

/** Converts Next.js search params to `URLSearchParams`, keeping repeated keys. */
export function toURLSearchParams(searchParams: SearchParams): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    allParams(value).forEach((item) => params.append(key, item));
  }
  return params;
}
