import { describe, expect, it } from "vitest";
import { demoteHeadings } from "./html";

describe("demoteHeadings", () => {
  it("moves headings one level down", () => {
    expect(demoteHeadings('<h1 class="x">Titel</h1><H2>Sub</H2>')).toBe(
      '<h2 class="x">Titel</h2><h3>Sub</h3>',
    );
  });

  it("leaves h6 and other tags alone", () => {
    expect(demoteHeadings("<h6>a</h6><header>b</header><hr>")).toBe(
      "<h6>a</h6><header>b</header><hr>",
    );
  });
});
