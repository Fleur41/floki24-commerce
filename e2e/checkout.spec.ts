import { expect, test } from "@playwright/test";

// Runs against the in-app demo checkout (no Shopify credentials configured).
test("check out the cart and see the order confirmation", async ({ page }) => {
  await page.goto("/collections/all");
  const firstProduct = page.locator("article h3 a").first();
  const title = (await firstProduct.textContent())!;
  await firstProduct.click();

  await page.getByRole("button", { name: "Zum Warenkorb hinzufügen" }).click();
  const notification = page.getByRole("dialog");
  await expect(notification).toContainText(/hinzugefügt/i);
  await notification.getByRole("link", { name: "Kasse" }).click();

  await expect(page).toHaveURL(/\/checkout$/);
  await expect(notification).toBeHidden();
  const summary = page.getByRole("complementary", { name: "Bestellübersicht" });
  await expect(summary).toContainText(title);

  await page.getByRole("button", { name: "Jetzt kaufen" }).click();
  await expect(page.getByText("Geben Sie einen Vornamen ein")).toBeVisible();

  await page.getByLabel("E-Mail", { exact: true }).fill("e2e@example.com");
  await page.getByLabel("Vorname", { exact: true }).fill("Erika");
  await page.getByLabel("Nachname", { exact: true }).fill("Muster");
  await page.getByLabel("Adresse", { exact: true }).fill("Hafenstrasse 19");
  await page.getByLabel("Postleitzahl").fill("8280");
  await page.getByLabel("Ort", { exact: true }).fill("Kreuzlingen");
  await expect(summary).toContainText("Kostenlos");
  await page.getByRole("button", { name: "Jetzt kaufen" }).click();

  await expect(page).toHaveURL(/\/checkout\/orders\//);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Vielen Dank, Erika!");
  await expect(page.getByRole("complementary", { name: "Bestellübersicht" })).toContainText(title);

  await page.goto("/cart");
  await expect(page.getByText("Ihr Warenkorb ist derzeit leer.")).toBeVisible();
});
