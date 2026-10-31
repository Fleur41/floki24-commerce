import { describe, expect, it } from "vitest";
import type { Filter } from "./types";
import { getUsableFilters, parsePriceRange, priceRangeInput } from "./listing";

const priceFilter = (max: number): Filter => ({
  id: "filter.v.price",
  label: "Preis",
  type: "PRICE_RANGE",
  values: [
    { id: "filter.v.price", label: "Preis", count: 0, input: `{"price":{"min":0,"max":${max}}}` },
  ],
});

describe("parsePriceRange", () => {
  it("reads the bounds of a price filter", () => {
    expect(parsePriceRange('{"price":{"min":100,"max":500}}')).toEqual({ min: 100, max: 500 });
    expect(parsePriceRange('{"price":{"max":500}}')).toEqual({ max: 500 });
  });

  it("returns null for other filters and malformed input", () => {
    expect(parsePriceRange('{"available":true}')).toBeNull();
    expect(parsePriceRange("{oops")).toBeNull();
  });
});

describe("priceRangeInput", () => {
  it("round-trips through parsePriceRange", () => {
    const input = priceRangeInput({ min: 100, max: 500 })!;
    expect(parsePriceRange(input)).toEqual({ min: 100, max: 500 });
  });

  it("leaves out open ends and returns null when both are open", () => {
    expect(priceRangeInput({ min: 50 })).toBe('{"price":{"min":50}}');
    expect(priceRangeInput({})).toBeNull();
  });
});

describe("getUsableFilters", () => {
  it("keeps price ranges with prices and lists with values", () => {
    const empty: Filter = { id: "x", label: "Marke", type: "LIST", values: [] };
    expect(getUsableFilters([priceFilter(999), priceFilter(0), empty])).toEqual([priceFilter(999)]);
  });
});
