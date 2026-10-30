/** Helpers shared by every paginated, filterable product listing. */

import type { Filter } from "./types";

export const PRODUCTS_PER_PAGE = 24;

/** A Storefront API `ProductFilter` input, e.g. `{ "available": true }`. */
export type ProductFilterInput = Record<string, unknown>;

export type Cursor = { after?: string; before?: string };

export type ListingQuery<TSortKey extends string> = Cursor & {
  sortKey: TSortKey;
  reverse: boolean;
  filters: ProductFilterInput[];
};

/** Translates a cursor into `first/after` or `last/before` connection arguments. */
export function paginationVariables({ after, before }: Cursor, pageSize = PRODUCTS_PER_PAGE) {
  return before ? { last: pageSize, before } : { first: pageSize, after };
}

/**
 * Filters are kept in the URL as the serialised `input` Shopify returns for
 * each filter value (`?filter={"available":true}`), so selecting a filter
 * never needs an extra lookup. Malformed values are ignored.
 */
export function parseFilterParams(values: string[]): ProductFilterInput[] {
  return values.flatMap((value) => {
    try {
      const parsed: unknown = JSON.parse(value);
      return parsed && typeof parsed === "object" ? [parsed as ProductFilterInput] : [];
    } catch {
      return [];
    }
  });
}

/**
 * Filters that can be rendered as checkbox lists. Price ranges need a
 * dedicated range input and are left out for now.
 */
export function getCheckboxFilters(filters: Filter[]): Filter[] {
  return filters.filter((filter) => filter.type !== "PRICE_RANGE" && filter.values.length > 0);
}
