import { expect, test, type Page } from "@playwright/test";

const cartCount = (page: Page) => page.getByRole("link", { name: /Warenkorb/ }).first();

test("home page shows the main sections", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Floki24/i);
  await expect(page.locator('[aria-roledescription="carousel"]')).toBeVisible();
  await expect(page.getByRole("main").getByText("Kostenloser Versand")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Unsere Kategorien" })).toBeVisible();
  await expect(page.locator("main article").first()).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
});

test("browse a collection, sort it and open a product", async ({ page }) => {
  await page.goto("/collections/all");
  await expect(page.getByRole("heading", { level: 1, name: "Alle Produkte" })).toBeVisible();

  await page.getByLabel("Sortieren nach").selectOption("price-ascending");
  await expect(page).toHaveURL(/sort_by=price-ascending/);

  const firstProduct = page.locator("article h3 a").first();
  const title = await firstProduct.textContent();
  await firstProduct.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(title!);
});

test("add to cart, change the quantity and remove the line", async ({ page }) => {
  await page.goto("/collections/all");
  await page.locator("article h3 a").first().click();

  await page.getByRole("button", { name: "Zum Warenkorb hinzufügen" }).click();
  const notification = page.getByRole("dialog");
  await expect(notification).toContainText(/hinzugefügt/i);
  await notification.getByRole("link", { name: /Warenkorb/ }).click();

  await expect(page).toHaveURL(/\/cart$/);
  await page.getByRole("button", { name: "Menge erhöhen" }).first().click();
  await expect(page.getByRole("spinbutton").first()).toHaveValue("2");

  await expect(page.getByRole("complementary", { name: "Bestellübersicht" })).toHaveAttribute(
    "aria-busy",
    "false",
  );
  await page.reload();
  await expect(page.getByRole("spinbutton").first()).toHaveValue("2");

  await page
    .getByRole("button", { name: /Entfernen/i })
    .first()
    .click();
  await expect(page.getByText("Ihr Warenkorb ist derzeit leer.")).toBeVisible();
});

test("quick buy from a product card", async ({ page, isMobile }) => {
  test.skip(isMobile, "Quick buy is only offered on devices with a mouse.");

  await page.goto("/collections/all");
  const card = page.locator("article").first();
  await card.hover();
  await card.getByRole("button", { name: "Schnellkauf" }).click();

  const quickView = page.getByRole("dialog", { name: "Schnellkauf" });
  await expect(quickView.getByRole("heading", { level: 2 })).toBeVisible();
  await quickView.getByRole("button", { name: "Zum Warenkorb hinzufügen" }).click();

  await expect(quickView).toBeHidden();
  await expect(cartCount(page)).toContainText("1");
});

test("search finds products", async ({ page }) => {
  await page.goto("/search?q=chair");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("chair");
  await expect(page.locator("article").first()).toBeVisible();
});

test("unknown pages render the 404 page", async ({ page }) => {
  await page.goto("/products/does-not-exist");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/nicht gefunden|404/i);
});
