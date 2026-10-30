import { describe, expect, it } from "vitest";
import type { Product, ProductVariant } from "@/lib/shopify/types";
import { findVariant, hasSelectableOptions, resolveInitialVariant, variantLabel } from "./product";

const price = { amount: "10", currencyCode: "CHF" };

function variant(id: number, options: Record<string, string>, available = true): ProductVariant {
  return {
    id: `gid://shopify/ProductVariant/${id}`,
    title: Object.values(options).join(" / "),
    availableForSale: available,
    selectedOptions: Object.entries(options).map(([name, value]) => ({ name, value })),
    price,
    compareAtPrice: null,
    image: null,
  };
}

function product(variants: ProductVariant[]): Product {
  return { variants } as Product;
}

const shirt = product([
  variant(1, { Size: "S", Color: "Red" }, false),
  variant(2, { Size: "M", Color: "Red" }),
  variant(3, { Size: "M", Color: "Blue" }),
]);

describe("variantLabel / hasSelectableOptions", () => {
  it("hides Shopify's default variant", () => {
    const simple = product([variant(1, { Title: "Default Title" })]);
    expect(variantLabel("Default Title")).toBeNull();
    expect(variantLabel("M / Red")).toBe("M / Red");
    expect(hasSelectableOptions(simple)).toBe(false);
    expect(hasSelectableOptions(shirt)).toBe(true);
  });
});

describe("findVariant", () => {
  it("matches all selected options", () => {
    const selected = [
      { name: "Size", value: "M" },
      { name: "Color", value: "Blue" },
    ];
    expect(findVariant(shirt, selected)?.id).toMatch(/\/3$/);
  });

  it("returns undefined for combinations that don't exist", () => {
    const selected = [
      { name: "Size", value: "S" },
      { name: "Color", value: "Blue" },
    ];
    expect(findVariant(shirt, selected)).toBeUndefined();
  });
});

describe("resolveInitialVariant", () => {
  it("prefers the ?variant= id", () => {
    expect(resolveInitialVariant(shirt, "3").id).toMatch(/\/3$/);
  });

  it("falls back to the first available variant", () => {
    expect(resolveInitialVariant(shirt, "999").id).toMatch(/\/2$/);
    expect(resolveInitialVariant(shirt).id).toMatch(/\/2$/);
  });

  it("falls back to the first variant when nothing is available", () => {
    const soldOut = product([variant(7, { Size: "S" }, false)]);
    expect(resolveInitialVariant(soldOut).id).toMatch(/\/7$/);
  });
});
