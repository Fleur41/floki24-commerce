/**
 * Sort options shown on listing pages. The URL values match Shopify's own
 * `sort_by` parameter, so links from the original theme keep working.
 */

export type SortOption<TSortKey extends string> = {
  value: string;
  label: string;
  sortKey: TSortKey;
  reverse: boolean;
};

type CollectionSortKey = "COLLECTION_DEFAULT" | "BEST_SELLING" | "TITLE" | "PRICE" | "CREATED";
type ProductSortKey = "BEST_SELLING" | "TITLE" | "PRICE" | "CREATED_AT";
type SearchSortKey = "RELEVANCE" | "PRICE";

export const collectionSortOptions: SortOption<CollectionSortKey>[] = [
  { value: "manual", label: "Ausgewählt", sortKey: "COLLECTION_DEFAULT", reverse: false },
  { value: "best-selling", label: "Meistverkauft", sortKey: "BEST_SELLING", reverse: false },
  { value: "title-ascending", label: "Alphabetisch, A-Z", sortKey: "TITLE", reverse: false },
  { value: "title-descending", label: "Alphabetisch, Z-A", sortKey: "TITLE", reverse: true },
  { value: "price-ascending", label: "Preis, niedrig nach hoch", sortKey: "PRICE", reverse: false },
  { value: "price-descending", label: "Preis, hoch nach niedrig", sortKey: "PRICE", reverse: true },
  { value: "created-ascending", label: "Datum, alt zu neu", sortKey: "CREATED", reverse: false },
  { value: "created-descending", label: "Datum, neu zu alt", sortKey: "CREATED", reverse: true },
];

/** `/collections/all` is not a real collection, so it sorts the product catalog instead. */
export const catalogSortOptions: SortOption<ProductSortKey>[] = [
  { value: "best-selling", label: "Meistverkauft", sortKey: "BEST_SELLING", reverse: false },
  { value: "title-ascending", label: "Alphabetisch, A-Z", sortKey: "TITLE", reverse: false },
  { value: "title-descending", label: "Alphabetisch, Z-A", sortKey: "TITLE", reverse: true },
  { value: "price-ascending", label: "Preis, niedrig nach hoch", sortKey: "PRICE", reverse: false },
  { value: "price-descending", label: "Preis, hoch nach niedrig", sortKey: "PRICE", reverse: true },
  { value: "created-ascending", label: "Datum, alt zu neu", sortKey: "CREATED_AT", reverse: false },
  { value: "created-descending", label: "Datum, neu zu alt", sortKey: "CREATED_AT", reverse: true },
];

export const searchSortOptions: SortOption<SearchSortKey>[] = [
  { value: "relevance", label: "Relevanz", sortKey: "RELEVANCE", reverse: false },
  { value: "price-ascending", label: "Preis, niedrig nach hoch", sortKey: "PRICE", reverse: false },
  { value: "price-descending", label: "Preis, hoch nach niedrig", sortKey: "PRICE", reverse: true },
];

/** Returns the option matching `value`, falling back to the first (default) option. */
export function resolveSortOption<TSortKey extends string>(
  options: SortOption<TSortKey>[],
  value: string | undefined,
): SortOption<TSortKey> {
  return options.find((option) => option.value === value) ?? options[0];
}
