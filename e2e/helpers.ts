import type { Page } from "@playwright/test";

/**
 * Opens the first product that is in stock (the live catalogue has sold-out
 * items) and returns its title and the buy box's "add to cart" button. The
 * recommendations below have their own add-to-cart buttons, so it's the first one.
 */
export async function openProductInStock(page: Page) {
  await page.goto("/collections/all");
  const link = page.locator("article").filter({ hasText: "Auf Lager" }).locator("h3 a").first();
  const title = (await link.textContent())!.trim();
  await link.click();
  await page.waitForURL(/\/products\//);
  await page.getByRole("heading", { level: 1, name: title }).waitFor();
  return {
    title,
    addToCart: page.getByRole("button", { name: "Zum Warenkorb hinzufügen" }).first(),
  };
}
