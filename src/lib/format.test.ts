import { describe, expect, it } from "vitest";
import { discountPercentage, formatDate, formatMoney, multiplyMoney } from "./format";

const chf = (amount: string) => ({ amount, currencyCode: "CHF" });

describe("formatMoney", () => {
  it("renders the currency code first with comma thousands, like the reference shop", () => {
    expect(formatMoney(chf("1999"))).toBe("CHF 1,999.00");
    expect(formatMoney(chf("12.5"))).toBe("CHF 12.50");
  });
});

describe("multiplyMoney", () => {
  it("keeps the currency", () => {
    expect(multiplyMoney(chf("19.90"), 3)).toEqual(chf(String(19.9 * 3)));
  });
});

describe("discountPercentage", () => {
  it("rounds the saving", () => {
    expect(discountPercentage(chf("750"), chf("975"))).toBe(23);
  });

  it("returns null without a real saving", () => {
    expect(discountPercentage(chf("100"), null)).toBeNull();
    expect(discountPercentage(chf("100"), chf("100"))).toBeNull();
    expect(discountPercentage(chf("100"), chf("90"))).toBeNull();
    expect(discountPercentage(chf("999.99"), chf("1000"))).toBeNull();
  });
});

describe("formatDate", () => {
  it("uses the shop's time zone", () => {
    expect(formatDate("2024-09-26T23:30:00Z")).toBe("September 27, 2024");
  });

  it("uses the language of the page", () => {
    expect(formatDate("2024-09-26T23:30:00Z", "de")).toBe("27. September 2024");
    expect(formatDate("2024-09-26T23:30:00Z", "fr")).toBe("27 septembre 2024");
    expect(formatDate("2024-09-26T23:30:00Z", "it")).toBe("27 settembre 2024");
  });
});
