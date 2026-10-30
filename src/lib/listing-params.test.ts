import { describe, expect, it } from "vitest";
import { collectionSortOptions } from "@/lib/shopify/sorting";
import { readListingQuery, toURLSearchParams } from "./listing-params";

describe("readListingQuery", () => {
  it("reads sort, filters and cursor from the URL", () => {
    const { sortValue, query } = readListingQuery(
      {
        sort_by: "price-descending",
        filter: ['{"available":true}', "not json", '{"productVendor":"Floki"}'],
        after: "cursor",
      },
      collectionSortOptions,
    );

    expect(sortValue).toBe("price-descending");
    expect(query).toEqual({
      sortKey: "PRICE",
      reverse: true,
      filters: [{ available: true }, { productVendor: "Floki" }],
      after: "cursor",
      before: undefined,
    });
  });

  it("falls back to the default sort order", () => {
    const { sortValue } = readListingQuery({ sort_by: "unknown" }, collectionSortOptions);
    expect(sortValue).toBe(collectionSortOptions[0].value);
  });
});

describe("toURLSearchParams", () => {
  it("keeps repeated keys and drops undefined values", () => {
    const params = toURLSearchParams({ filter: ["a", "b"], q: "sofa", after: undefined });
    expect(params.toString()).toBe("filter=a&filter=b&q=sofa");
  });
});
