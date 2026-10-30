import { describe, expect, it } from "vitest";
import { reshapeArticle, reshapeProduct, type RawArticle, type RawProduct } from "./reshape";

const summary = {
  id: "gid://shopify/Product/1",
  handle: "sauna",
  title: "Sauna",
  vendor: "Floki",
  availableForSale: true,
  featuredImage: null,
  priceRange: {
    minVariantPrice: { amount: "1", currencyCode: "CHF" },
    maxVariantPrice: { amount: "1", currencyCode: "CHF" },
  },
  compareAtPriceRange: { maxVariantPrice: { amount: "0", currencyCode: "CHF" } },
};

describe("reshapeProduct", () => {
  const raw = {
    ...summary,
    description: "",
    descriptionHtml: "",
    productType: "",
    seo: { title: null, description: null },
    quickAddVariants: { nodes: [{ id: "v1" }] },
    options: [{ name: "Size", optionValues: [{ name: "S" }, { name: "M" }] }],
    images: { nodes: [] },
    variants: { nodes: [] },
  } as RawProduct;

  it("flattens connections and options", () => {
    const product = reshapeProduct(raw);
    expect(product.options).toEqual([{ name: "Size", values: ["S", "M"] }]);
    expect(product.images).toEqual([]);
    expect(product).not.toHaveProperty("quickAddVariants");
  });

  it("only exposes a quick-add variant for single-variant products", () => {
    expect(reshapeProduct(raw).singleVariantId).toBe("v1");
    const multi = { ...raw, quickAddVariants: { nodes: [{ id: "v1" }, { id: "v2" }] } };
    expect(reshapeProduct(multi).singleVariantId).toBeNull();
  });
});

describe("reshapeArticle", () => {
  it("tolerates articles without an author", () => {
    const article = reshapeArticle({ authorV2: null, blog: { handle: "news" } } as RawArticle);
    expect(article).toMatchObject({ authorName: null, blogHandle: "news" });
  });
});
