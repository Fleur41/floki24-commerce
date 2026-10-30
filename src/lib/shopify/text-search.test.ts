import { describe, expect, it } from "vitest";
import { editDistance, normalize, scoreProduct, type SearchableProduct } from "./text-search";

const bed: SearchableProduct = {
  title: "Solid Wood Bed with Ash Wood Finish",
  vendor: "Havenly Nest",
  productType: "Serene Slumber Suite",
  tags: ["serene slumber suite", "beds"],
};

const clock: SearchableProduct = {
  title: "Porcelain Touch Table Clock",
  vendor: "Havenly Nest",
  productType: "Timeless Details",
  tags: ["timeless details"],
};

describe("normalize", () => {
  it("lowercases and strips accents and punctuation", () => {
    expect(normalize("  Garten- & Lounge-Möbel ")).toBe("garten lounge mobel");
  });
});

describe("editDistance", () => {
  it("counts single-character edits", () => {
    expect(editDistance("heavenly", "havenly", 2)).toBe(1);
    expect(editDistance("lamp", "lamb", 1)).toBe(1);
  });

  it("stops early once the limit is exceeded", () => {
    expect(editDistance("sofa", "porcelain", 1)).toBe(2);
  });
});

describe("scoreProduct", () => {
  it("matches the vendor", () => {
    expect(scoreProduct("Havenly Nest", bed)).not.toBeNull();
  });

  it("tolerates small typos", () => {
    expect(scoreProduct("Heavenly nest", bed)).not.toBeNull();
  });

  it("matches word prefixes while typing", () => {
    expect(scoreProduct("ash wo", bed)).not.toBeNull();
  });

  it("requires every word to match", () => {
    expect(scoreProduct("bed", clock)).toBeNull();
    expect(scoreProduct("wood clock", bed)).toBeNull();
  });

  it("ranks title matches above tag matches", () => {
    const tagged = { ...clock, tags: ["bed"] };
    expect(scoreProduct("bed", bed)!).toBeGreaterThan(scoreProduct("bed", tagged)!);
  });

  it("does not match an empty query", () => {
    expect(scoreProduct("  ", bed)).toBeNull();
  });
});
