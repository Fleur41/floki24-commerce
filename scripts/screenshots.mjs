/**
 * Captures the screenshots used in README.md into docs/screenshots/.
 *
 *   npm run build && npm start      # in one terminal
 *   node scripts/screenshots.mjs    # in another (BASE_URL defaults to http://localhost:3000)
 *
 * Runs against the demo catalogue in English. Placing the demo order writes to `.data/`.
 */
import { mkdir } from "node:fs/promises";
import { chromium, devices } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = new URL("../docs/screenshots/", import.meta.url).pathname;
const DESKTOP = { viewport: { width: 1440, height: 900 } };

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

async function newPage(options = DESKTOP) {
  const context = await browser.newContext(options);
  await context.addCookies([{ name: "locale", value: "en", url: BASE_URL }]);
  const page = await context.newPage();
  // Keeps the slideshow and transitions still so shots are reproducible.
  await page.emulateMedia({ reducedMotion: "reduce" });
  return page;
}

async function open(page, path) {
  await page.goto(BASE_URL + path);
  await page.locator("h1, h2, main img").first().waitFor({ timeout: 60_000 });
  await page.waitForLoadState("networkidle").catch(() => {});
}

async function shot(target, name, options = {}) {
  await target.screenshot({ path: `${OUT}${name}.jpg`, type: "jpeg", quality: 82, ...options });
  console.log(`✓ ${name}.jpg`);
}

const page = await newPage();

// Home, first screen.
await open(page, "/");
await shot(page, "home");

// Mega menu (opens on click).
await page.getByRole("navigation", { name: "Main menu" }).getByRole("button").first().click();
await page.waitForTimeout(300);
await shot(page, "mega-menu");
await page.keyboard.press("Escape");

// Compact sticky header after scrolling.
await page.mouse.wheel(0, 1400);
await page.waitForTimeout(600);
await shot(page, "sticky-header", { clip: { x: 0, y: 0, width: 1440, height: 420 } });

// Language switcher.
await page.evaluate(() => window.scrollTo(0, 0));
await page.getByRole("button", { name: /^Language:/ }).click();
await shot(page, "language-switcher", { clip: { x: 840, y: 0, width: 600, height: 300 } });
await page.keyboard.press("Escape");

// Live search suggestions.
const search = page.locator("header input[name=q]").first();
await search.fill("wood bed");
await page.waitForTimeout(1500);
await shot(page, "predictive-search", { clip: { x: 0, y: 0, width: 1440, height: 760 } });

// Search results with an active filter.
await open(page, "/search?q=heavenly%20nest");
await page.locator("aside fieldset label").nth(1).click();
await page.waitForURL(/filter=/);
await page.waitForTimeout(1500);
await shot(page, "search-filters");

// Collection in list view.
await open(page, "/collections/all");
await page.getByRole("button", { name: "List" }).click();
await page.waitForTimeout(500);
await shot(page, "list-view");
await page.getByRole("button", { name: "Grid" }).click();

// Product page.
await open(page, "/collections/all");
await page.locator("article h3 a").first().click();
await page.getByRole("button", { name: "Add to cart" }).waitFor();
await page.waitForLoadState("networkidle").catch(() => {});
await shot(page, "product");

// "Added to cart" dialog, cart page and checkout.
await page.getByRole("button", { name: "Add to cart" }).click();
await page.getByRole("dialog").waitFor();
await page.waitForTimeout(400);
await shot(page, "added-to-cart");
await open(page, "/cart");
await shot(page, "cart");
await open(page, "/checkout");
await page.getByLabel("Email", { exact: true }).fill("erika@example.com");
await page.getByLabel("First name", { exact: true }).fill("Erika");
await page.getByLabel("Last name", { exact: true }).fill("Muster");
await page.getByLabel("Address", { exact: true }).fill("Hafenstrasse 19");
await page.getByLabel("Postal code").fill("8280");
await page.getByLabel("City", { exact: true }).fill("Kreuzlingen");
await page.waitForTimeout(500);
await shot(page, "checkout");
await page.getByRole("button", { name: "Buy now" }).click();
await page.waitForURL(/\/checkout\/orders\//);
await page.locator("h1").waitFor();
await shot(page, "order-confirmation");

// Account registration.
await open(page, "/account/register");
await shot(page, "register");

// Footer.
await open(page, "/");
await shot(page.locator("footer"), "footer");

// Mobile: home and the drill-down menu.
const mobile = await newPage({ ...devices["iPhone 13"] });
await open(mobile, "/");
await shot(mobile, "mobile-home");
await mobile.getByRole("button", { name: "Menu" }).first().click();
await mobile.waitForTimeout(500);
await shot(mobile, "mobile-menu");

await browser.close();
