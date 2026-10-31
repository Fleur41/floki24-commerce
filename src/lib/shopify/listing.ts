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

export type PriceRange = { min?: number; max?: number };

/** Reads a `{"price":{"min":…,"max":…}}` filter input; `null` for any other filter. */
export function parsePriceRange(input: string): PriceRange | null {
  try {
    const { price } = JSON.parse(input) as { price?: unknown };
    if (!price || typeof price !== "object") return null;
    const { min, max } = price as Record<string, unknown>;
    return {
      ...(typeof min === "number" && { min }),
      ...(typeof max === "number" && { max }),
    };
  } catch {
    return null;
  }
}

/** Serialises a price range as a filter input; `null` when the range is open on both ends. */
export function priceRangeInput({ min, max }: PriceRange): string | null {
  if (min === undefined && max === undefined) return null;
  return JSON.stringify({
    price: { ...(min !== undefined && { min }), ...(max !== undefined && { max }) },
  });
}

/**
 * Filters the sidebar can show: lists with values, and the price range when
 * the listing has prices at all (Shopify reports its bounds as `max`).
 */
export function getUsableFilters(filters: Filter[]): Filter[] {
  return filters.filter((filter) =>
    filter.type === "PRICE_RANGE"
      ? (parsePriceRange(filter.values[0]?.input ?? "")?.max ?? 0) > 0
      : filter.values.length > 0,
  );
}
