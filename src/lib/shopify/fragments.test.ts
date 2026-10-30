import { describe, expect, it } from "vitest";
import { CART_FRAGMENT, gql, PRODUCT_FRAGMENT, PRODUCT_SUMMARY_FRAGMENT } from "./fragments";

const definitions = (document: string) =>
  [...document.matchAll(/fragment (\w+) on/g)].map((match) => match[1]);

describe("gql", () => {
  it("includes every fragment exactly once, even when shared", () => {
    const document = gql(
      "query { ... }",
      PRODUCT_FRAGMENT,
      PRODUCT_SUMMARY_FRAGMENT,
      CART_FRAGMENT,
    );
    const names = definitions(document);

    expect(names.length).toBeGreaterThan(3);
    expect(new Set(names).size).toBe(names.length);
  });

  it("puts the operation first", () => {
    expect(gql("query Test { shop { name } }", PRODUCT_SUMMARY_FRAGMENT)).toMatch(/^query Test/);
  });
});
