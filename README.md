<div align="center">

# floki24-commerce

**A fast, four-language headless storefront for [floki24.ch](https://floki24.ch), the Swiss
shop for saunas, garden furniture, wellness and more.**

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Shopify](https://img.shields.io/badge/Shopify-Storefront%20API-7AB55C?logo=shopify&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-tested-2EAD33?logo=playwright&logoColor=white)

[Tech stack](#-tech-stack) · [Quick start](#-quick-start) · [Tour](#-a-quick-tour) · [Using the website](#-working-with-the-website) ·
[Architecture](#-how-it-works) · [Development](#-development)

<br>

![Home page](docs/screenshots/home.jpg)

</div>

---

## ✨ Highlights

|     |                                                                                                                                                                         |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🛋️  | **The real shop, live.** floki24's 2,900 products, prices in CHF, stock levels, categories and blog come straight from its Shopify store. The design follows its theme. |
| 🌍  | **Four languages.** Deutsch, English, Français and Italiano, switched with a flag menu. Products, categories and the interface all follow the chosen language.          |
| 🔎  | **Search.** Live suggestions with pictures and prices while you type, plus a category dropdown to search within one product type.                                       |
| 🎛️  | **Filters and sorting.** Filter by availability and price range, sort by price, name, date or relevance, and switch between grid and list view.                         |
| 🛒  | **Full purchase flow.** Quick buy from the listing, cart with live quantities, a Shopify-style checkout and an order confirmation.                                      |
| 👤  | **Customer accounts.** Register, log in and see your past orders.                                                                                                       |
| 📱  | **Built for every screen.** A compact sticky header on scroll, a drill-down menu on phones and keyboard-accessible menus and dialogs.                                   |
| ⚡  | **Fast by default.** Partial prerendering, cached Shopify data and images served straight from the Shopify CDN.                                                         |

> **No setup needed.** Out of the box the app reads floki24.ch's live catalogue through Shopify's
> public (tokenless) Storefront API. Browsing, search, filters and the cart are real. Because
> it has no store token, it keeps customer accounts and orders **locally** and its checkout
> **takes no payment**, so trying it never places a real order with floki24.

---

## 🧰 Tech stack

| Area          | Technology                                                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework     | [Next.js 16](https://nextjs.org) (App Router, Cache Components, Partial Prerendering, Server Actions, `proxy.ts`)                           |
| UI            | [React 19](https://react.dev) (Server Components, `useOptimistic`, `useTransition`, native `<dialog>`)                                      |
| Language      | [TypeScript 5](https://www.typescriptlang.org) in strict mode, with generated route types (`PageProps`)                                     |
| Styling       | CSS Modules and CSS custom properties (no CSS framework), Nunito Sans and Montserrat fonts                                                  |
| Commerce data | [Shopify Storefront API](https://shopify.dev/docs/api/storefront) over GraphQL: products, collections, search, cart, blog, policies         |
| Languages     | Built-in i18n: a locale cookie, `next/root-params`, typed dictionaries for DE / EN / FR / IT, and Shopify translations through `@inContext` |
| Images        | `next/image` with a custom loader for the Shopify CDN                                                                                       |
| Accounts      | Shopify customer accounts with a store token, otherwise local accounts (Node `crypto` scrypt) in a JSON file store                          |
| Testing       | [Vitest](https://vitest.dev) unit tests, [Playwright](https://playwright.dev) end-to-end tests on desktop and mobile                        |
| Code quality  | [ESLint 9](https://eslint.org) (`eslint-config-next`), [Prettier 3](https://prettier.io)                                                    |
| CI            | GitHub Actions: formatting, lint, type check, unit tests, build and end-to-end tests                                                        |
| Runtime       | Node.js 22 or newer; runs anywhere Next.js runs (e.g. Vercel or `npm start` on a server)                                                    |

---

## 🚀 Quick start

You need **Node.js 22 or newer**.

```bash
git clone <this-repo> floki24-commerce
cd floki24-commerce
npm install
npm run dev
```

Open **http://localhost:3000**. That's it: floki24's live products load automatically.

For a production build (faster, and what the end-to-end tests use):

```bash
npm run build
npm start          # http://localhost:3000
```

### Choosing the data source

| Setup (`.env.local`)                                       | Catalogue, search, cart        | Accounts and checkout                            |
| ---------------------------------------------------------- | ------------------------------ | ------------------------------------------------ |
| Nothing set (default)                                      | floki24.ch, live, tokenless    | Local accounts, in-app checkout, no payment      |
| `SHOPIFY_STORE_DOMAIN=mock.shop`                           | mock.shop demo catalogue (USD) | Local accounts, in-app checkout, no payment      |
| `SHOPIFY_STORE_DOMAIN` + `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Your store                     | Shopify customer accounts and Shopify's checkout |

### Connecting your own Shopify store

1. In the Shopify admin, open **Settings → Apps and sales channels → Headless** and create a
   storefront.
2. Copy `.env.example` to `.env.local` and fill in:

   | Variable                          | What it is                                                             |
   | --------------------------------- | ---------------------------------------------------------------------- |
   | `SHOPIFY_STORE_DOMAIN`            | e.g. `floki24.myshopify.com`                                           |
   | `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | The **public** Storefront API token                                    |
   | `NEXT_PUBLIC_SITE_URL`            | Public origin, used for canonical URLs, `sitemap.xml` and `robots.txt` |
   | `SHOPIFY_REVALIDATION_SECRET`     | Optional. Webhook secret for instant cache updates (see below)         |

3. Restart the server. Products, collections, search, cart and customer accounts now come from
   Shopify, and checkout hands over to Shopify's hosted checkout.
4. Optional: point Shopify webhooks for `products/*`, `collections/*` and
   `inventory_levels/update` at `/api/revalidate` so changes show up immediately.

---

## 🖼️ A quick tour

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/mega-menu.jpg" alt="Mega menu"><br><sub><b>Mega menu</b>: opens on click and lists every category of the real shop.</sub></td>
    <td width="50%"><img src="docs/screenshots/predictive-search.jpg" alt="Live search suggestions"><br><sub><b>Live search</b>: suggestions with images and prices while you type.</sub></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/search-filters.jpg" alt="Search results with filters"><br><sub><b>Filters</b>: availability and price range; active filters are chips you remove with one click.</sub></td>
    <td><img src="docs/screenshots/list-view.jpg" alt="List view"><br><sub><b>Grid or list</b>: "View as" remembers your choice.</sub></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/product.jpg" alt="Product page"><br><sub><b>Product page</b>: gallery, variants, quantity and payment options.</sub></td>
    <td><img src="docs/screenshots/added-to-cart.jpg" alt="Added to cart dialog"><br><sub><b>Added to cart</b>: go to the cart or straight to checkout.</sub></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/cart.jpg" alt="Cart"><br><sub><b>Cart</b>: quantities update instantly and survive a reload.</sub></td>
    <td><img src="docs/screenshots/checkout.jpg" alt="Checkout"><br><sub><b>Checkout</b>: modelled on Shopify's own checkout.</sub></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/order-confirmation.jpg" alt="Order confirmation"><br><sub><b>Order confirmation</b>: address, payment method and order summary.</sub></td>
    <td><img src="docs/screenshots/register.jpg" alt="Create account"><br><sub><b>Accounts</b>: register, log in and review your orders.</sub></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/sticky-header.jpg" alt="Compact sticky header"><br><sub><b>Sticky header</b>: shrinks on scroll and keeps search and the menu (☰) at hand.</sub></td>
    <td><img src="docs/screenshots/language-switcher.jpg" alt="Language switcher"><br><sub><b>Languages</b>: switch between DE, EN, FR and IT at any time.</sub></td>
  </tr>
</table>

<p align="center">
  <img src="docs/screenshots/mobile-home.jpg" alt="Mobile home page" width="260">
  &nbsp;&nbsp;&nbsp;
  <img src="docs/screenshots/mobile-menu.jpg" alt="Mobile menu" width="260">
  <br><sub><b>On a phone</b>: the same shop, with a drill-down menu.</sub>
</p>

![Footer](docs/screenshots/footer.jpg)

---

## 🧭 Working with the website

A step-by-step guide for shoppers and for anyone testing the shop.

### 1. Choose your language

- Click the **flag** at the top right and pick **Deutsch, English, Français or Italiano**. You can
  also use the **language selector in the footer**.
- The choice is remembered, so the next visit opens in the same language.
- To share a link in a specific language, put the language in front of the path, for example
  `http://localhost:3000/en/collections/all`. The visitor is switched to English and sent to the
  normal URL.

### 2. Browse the categories

- Click a category in the main menu (for example **Garden & Terrace**) to open the **mega menu**,
  then pick a sub-category. Click the category again, press <kbd>Esc</kbd> or click elsewhere to
  close it.
- Once you scroll down, the header shrinks. Use the **☰** button on its left to open the menu
  from anywhere on the page.
- On a phone, tap **☰** and drill down through the categories with the **›** arrows.
- The homepage slideshow can be moved with the **‹ ›** arrows or the dots below it.

### 3. Search

- Type in the search bar. After a couple of letters, **suggestions** appear with pictures and
  prices. Click one to open the product, or press <kbd>Enter</kbd> to see all results.
- Narrow the search to one department with the **"All categories"** dropdown on the left of the
  search bar.
- Search in the language you've chosen: `sauna` finds saunas in German, `infrared cabin` in
  English.

### 4. Filter, sort and change the view

On a category or search results page:

1. Tick **Availability** options in the **Filter** sidebar. The number next to each option shows
   how many products it has.
2. Under **Price**, enter a **From** and/or **To** amount and click **Apply** (or press
   <kbd>Enter</kbd>).
3. Your active filters appear as **chips** at the top of the sidebar. Click **×** on a chip to
   remove it, or **Clear all** to start over.
4. Change the order with **Sort by** (relevance, best selling, price, name, date).
5. Switch between **grid** and **list** with the **View as** buttons. Your choice is remembered.
6. Use the page numbers at the bottom to see more products.

The filters and sort order are part of the URL, so you can bookmark or share a filtered list.

### 5. Look at a product

- Click a product to open its page. Choose a **variant** (colour, material, size), and the price
  and picture update.
- Set the **quantity** with **−** and **+**.
- On a desktop, product cards also have a **Quick buy** button: pick a variant and add to the
  cart without leaving the list.

### 6. Add to cart and check out

1. Click **Add to cart**. A dialog confirms it and offers **View cart** or **Checkout**.
2. In the **cart** (the basket icon at the top right), change quantities or **Remove** items. The
   subtotal updates immediately.
3. Click **Checkout** and fill in your **email** and **delivery address**. Shipping within
   Switzerland and Liechtenstein is free.
4. Choose a payment method and click **Buy now**.
5. You see the **order confirmation** with your order number, and the cart is emptied.

> Without a store token, checkout is a safe demo: the order is saved locally, no payment is taken
> and **nothing is sent to floki24**. **Pay by invoice** and **bank transfer** complete the order;
> card, PayPal, Klarna and TWINT need a real payment provider, so the demo asks you to pick one of
> the first two. With your own store's token, **Checkout** goes to Shopify's real checkout.

### 7. Create an account and see your orders

1. Click **Log in** at the top right, then **Create account**.
2. Enter your name, email and a password of at least 8 characters.
3. You're logged in and taken to **My account**, which lists your orders. Orders placed while
   logged in show up there, and checkout fills in your email for you.
4. **Log out** from the account page.

### 8. Get in touch

- The phone number in the top bar is a `tel:` link. Click it on a phone to call.
- The footer has the company address, the WhatsApp number, the newsletter sign-up and links to
  the legal pages (terms, privacy, withdrawal, shipping, FAQ and more).

---

## 🏗️ How it works

```
src/
├── proxy.ts               Picks the language from a cookie and rewrites /path → /{lang}/path
├── app/[lang]/
│   ├── (shop)/            Home, collections, products, search, cart, account, blogs, pages, policies
│   ├── (checkout)/        The checkout, without the shop header and footer
│   └── [...missing]/      Branded 404 page
├── app/api/               Predictive search, product JSON for quick buy, webhook revalidation
├── components/
│   ├── layout/            Top bar, sticky header, mega menu, mobile drawer, search, footer
│   ├── home/              Slideshow, highlights, tiles, sliders, …
│   ├── listing/           Filter sidebar, sorting, grid/list toggle, pagination
│   ├── product/           Product card, quick buy, gallery, variant picker, add to cart
│   ├── cart/ checkout/    Cart context and actions, checkout form and order summary
│   ├── account/           Login and registration forms
│   └── i18n/              Language switcher and flags
├── content/               Menu, homepage sections, footer and their translations (typed, no CMS)
├── i18n/                  Locale config and the de / en / fr / it dictionaries
└── lib/
    └── shopify/           Storefront API client, queries, types, local accounts/orders, mock.shop layer
```

**Rendering.** Cache Components and Partial Prerendering are on. Page shells (header, menu,
footer, homepage content) are prerendered. Request-specific parts (cart, search results, the
current product) stream in behind `Suspense` with skeletons. Shopify data is cached with
`"use cache"`, `cacheLife` and cache tags, and webhooks can invalidate the tags.

**Languages.** The URL stays the same in every language. `proxy.ts` reads the `locale` cookie and
rewrites the request to `/{lang}/…` internally, and `next/root-params` makes the language part of
every cache key. Server components use `getDictionary()`, client components `useDictionary()`.
Menu and homepage text is translated in `src/content/translations.ts`.

**Data.** Server components read from `lib/shopify/*`. Each module owns its GraphQL query, maps
the response to the domain types in `types.ts` and caches the result. Components never see
GraphQL shapes.

**Live data without a token.** Shopify lets any storefront read products, collections, search,
menus and blogs, and create carts, without an access token. The client
(`lib/shopify/client.ts`) sends each request with the visitor's language
(`@inContext(language: …)`), so floki24's own translations come back.

- **Translated handles.** Shopify translates URLs too (`/products/sauna-interieur-…` in French),
  and a translated handle only works in its own language. Our URLs don't change with the
  language, so `handles.ts` looks a missing handle up in the other languages and switches to the
  current one. A link shared in French still opens after switching to German.
- **Merchant HTML.** Product descriptions, policies and articles sometimes contain their own
  `<h1>`. `demoteHeadings()` moves those down a level so each page has exactly one.
- **Without a token** some things stay local:

| Feature             | Handled by                                                                   |
| ------------------- | ---------------------------------------------------------------------------- |
| Customer accounts   | `mock-customers.ts`: scrypt-hashed passwords and expiring tokens in `.data/` |
| Checkout and orders | `mock-orders.ts` plus the in-app checkout (no payment, no real order)        |

**mock.shop mode** (`SHOPIFY_STORE_DOMAIN=mock.shop`) is a public demo catalogue of home goods. Its own
search ignores brands and it has no filters, so `mock-catalog.ts` loads the whole catalogue and
does search (`text-search.ts`: field weights, prefixes, typo tolerance), filters, sorting and
paging itself, and `mock-shop.ts` maps floki24's collection handles to demo collections.

**Cart.** The cart id lives in an `httpOnly` cookie. Changes are Server Actions that validate
their input, and quantities update optimistically with `useOptimistic`, like the filter checkboxes.

**Images.** A custom `next/image` loader asks the Shopify CDN for the right size directly, so the
Next.js image optimizer isn't needed.

**Accessibility and SEO.** Native `<dialog>` elements, keyboard-operable menus, carousel and
filters, labelled landmarks, `aria-busy` while lists reload. Per-page metadata, product JSON-LD,
a paginated `sitemap.xml` and `robots.txt`.

---

## 🛠️ Development

| Command             | What it does                                                       |
| ------------------- | ------------------------------------------------------------------ |
| `npm run dev`       | Development server with hot reload                                 |
| `npm run build`     | Production build                                                   |
| `npm start`         | Serve the production build                                         |
| `npm run lint`      | ESLint                                                             |
| `npm run typecheck` | Generate route types, then `tsc --noEmit`                          |
| `npm run format`    | Format everything with Prettier                                    |
| `npm test`          | Unit tests (Vitest)                                                |
| `npm run test:e2e`  | End-to-end tests (Playwright, desktop and mobile, on a prod build) |

**Tests.**

- **Unit tests** (`src/**/*.test.ts`) cover the parts that are easy to get subtly wrong: price
  and date formatting, variant resolution, URL ↔ listing parameters, GraphQL fragments, response
  reshaping and search scoring.
- **End-to-end tests** (`e2e/`) walk through the main journeys: homepage, collection → sort →
  product, cart changes that survive a reload, quick buy, search, 404, and a full checkout to the
  order confirmation. They use the live floki24 catalogue (picking an in-stock product) and the
  local checkout, so no real order is placed. Run `npm run build` first; the tests start their own
  server on port 3100.
- **CI** (`.github/workflows/ci.yml`) runs formatting, lint, type check and unit tests, then the
  build and the end-to-end suite.

**Adding a translation.** Add the key to all four files in `src/i18n/dictionaries/`. TypeScript
fails the build if one language is missing it. Use `{placeholders}` and `format()` for values.

**Updating the screenshots.** With the production server running:

```bash
node scripts/screenshots.mjs    # writes docs/screenshots/*.jpg
```

**Local data.** Local accounts and orders are saved in `.data/` (ignored by git). Delete the folder
to start fresh.

---

## 📌 Good to know

- **Live data changes.** Products, prices and stock come from floki24.ch as they are right now,
  so screenshots and test products can differ from day to day. Some menu categories (19 of 175)
  are empty on the live shop too.
- **No real orders.** Without a store token, carts are real Shopify carts but checkout stays in
  the app. Nothing is ordered from floki24.
- **Third-party widgets** on the original (Trusted Shops, the rewards launcher, the FAQ bubble)
  aren't included. They're external scripts tied to the shop's own accounts.
- **Brand colour contrast.** The gold accent (`#d4b654`) is kept for fidelity, but it doesn't
  meet WCAG AA contrast for small text on white. A production fix would darken it for text only.
- **404 status on streamed pages.** Product, collection and article pages stream, so a missing
  page is sent with status 200 plus `noindex`. Search engines still treat it as missing.

---

## 👥 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Fleur41">
        <img src="https://github.com/Fleur41.png?size=100" width="100" alt="Fleur41"><br>
        <sub><b>Fleur41</b></sub>
      </a>
    </td>
  </tr>
</table>

<div align="center">
<br>
Made for <a href="https://floki24.ch">floki24.ch</a> 🇨🇭 by <a href="https://github.com/Fleur41">Fleur41</a>
</div>
