# floki24-commerce

A headless clone of [floki24.ch](https://floki24.ch), built with **Next.js 16 (App Router)** and
**TypeScript**, and connected to **Shopify** through the Storefront API. Shopify is also what the
original shop runs on.

The design follows the shop's "Empire" theme 1:1: colours, typography (Nunito Sans / Montserrat),
spacing, the full mega menu and every homepage section. Catalogue, cart and checkout are live
Shopify data.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

No credentials are needed to try it. Without them the app talks to the public
[mock.shop](https://mock.shop) home-goods catalogue, so you can browse, search, filter, add to cart
and reach the Shopify checkout straight away. In this mode, the floki24 collection handles used on
the homepage and in the top-level menu are mapped to mock collections
(`src/lib/shopify/mock-shop.ts`); deeper menu links return 404.

### Connecting a real Shopify store

1. In the Shopify admin, open **Settings → Apps and sales channels → Headless** and create a
   storefront.
2. Copy `.env.example` to `.env.local` and fill in `SHOPIFY_STORE_DOMAIN` and the **public**
   `SHOPIFY_STOREFRONT_ACCESS_TOKEN`.
3. Set `NEXT_PUBLIC_SITE_URL` to the public origin. It is used for canonical URLs, the sitemap and
   `robots.txt`.
4. Optional, for instant cache updates: add webhooks for `products/*`, `collections/*` and
   `inventory_levels/update` pointing to `/api/revalidate`, and put the webhook signing secret into
   `SHOPIFY_REVALIDATION_SECRET`.

The homepage and navigation use the same collection handles as floki24.ch (`angebote`,
`neue-artikel`, `massagesessel`, …) and the blog handle `news`. Sections whose collection or blog
does not exist are not rendered.

## Scripts

| Script                 | Purpose                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run dev`          | Development server                                               |
| `npm run build`        | Production build                                                 |
| `npm start`            | Serve the production build                                       |
| `npm run lint`         | ESLint (Next.js + TypeScript)                                    |
| `npm run typecheck`    | Generate route types, then `tsc --noEmit`                        |
| `npm run format:check` | Prettier                                                         |
| `npm test`             | Unit tests (Vitest)                                              |
| `npm run test:e2e`     | End-to-end tests (Playwright, desktop + mobile, on a prod build) |

## Testing

- **Unit tests** (`src/**/*.test.ts`) cover the logic that is easy to get subtly wrong: price and
  discount formatting, variant resolution, URL ↔ listing-query parsing, GraphQL fragment
  de-duplication and the API response reshaping.
- **End-to-end tests** (`e2e/`) run the main journeys against a production build: homepage,
  collection → sort → product, add to cart → change quantity → reload → remove, quick buy, search
  and 404. They need no credentials because they run against mock.shop. Run `npm run build` first.
- **CI** (`.github/workflows/ci.yml`) runs formatting, lint, type check and unit tests, and in a
  second job the build and the e2e suite.

## Architecture

```
src/
├── app/                 Routes: home, collections, products, search, cart, blogs, pages, policies
│   └── api/             Predictive search, product JSON (quick buy), webhook revalidation
├── components/
│   ├── layout/          Top bar, header, mega menu, mobile drawer, search, footer
│   ├── home/            Homepage sections (slideshow, highlights, tiles, sliders, …)
│   ├── listing/         Filters, sorting, pagination for collection & search pages
│   ├── product/         Product card, quick buy, gallery, variant picker, add to cart
│   ├── cart/            Cart context, server actions, cart page, "added" dialog
│   └── ui/              Buttons, icons, breadcrumbs, quantity selector, …
├── content/             Theme content: menu, homepage sections, footer (typed, no CMS)
└── lib/
    ├── shopify/         Storefront API client, GraphQL fragments/queries, domain types
    └── …                Formatting, product helpers, URL params, cart session
```

**Data flow.** Server Components read from `lib/shopify/*`. Each query module owns its GraphQL,
maps the API response to the domain types in `types.ts` and caches the result with `"use cache"`
and a cache tag. Components never see GraphQL connection shapes. Fragments declare their own
dependencies, and `gql()` emits each one exactly once.

**Rendering.** Cache Components and Partial Prerendering are enabled. Page shells (header,
navigation, footer, homepage content) are static. Request-specific parts (cart, search params, the
current product) stream in behind `Suspense` boundaries with skeletons.

**Cart.** The cart id lives in an `httpOnly` cookie. Mutations are Server Actions that validate
their input. The client `CartProvider` receives the initial cart as an unresolved promise, so the
cart never blocks the shell. The cart page updates quantities optimistically with `useOptimistic`.
Checkout is Shopify's hosted checkout (`cart.checkoutUrl`).

**Quick buy.** On devices with a mouse, product cards show "Schnellkauf" on hover or focus. It
opens a native `<dialog>` that loads the full product from `/api/products/[handle]` only when
needed, so listings stay light. Products without options also get a direct "add to cart" button.
The variant logic is the same `useVariantSelection` hook the product page uses.

**Images.** All remote images come from the Shopify CDN, so a custom `next/image` loader requests
the right size from it directly instead of running the Next.js optimizer.

**SEO & accessibility.** Per-page metadata with fallbacks, canonical `metadataBase`, product
JSON-LD, `sitemap.xml` (products and collections, paginated) and `robots.txt`. Dialogs are native
`<dialog>` elements; the carousel, menus and forms are keyboard accessible, and the cart summary is
marked `aria-busy` while quantities are updated.

**Content.** Things a Shopify theme keeps in section settings (menu, slides, banners, footer) are
typed modules in `src/content`. The 200+ menu links were generated from the live site's markup.
Moving them to Shopify metaobjects or a CMS later only touches that folder.

## Fidelity notes

Implemented as on the reference: top bar, announcement bar, sticky header with search (product-type
dropdown + live results), mega menu, mobile drill-down menu, slideshow (autoplay, dots, pause on
hover, reduced-motion aware), highlights, promo mosaic & grid, category lists, blog section,
featured-collection sliders, quick buy on product cards, footer with newsletter and payment icons, collection pages
(description, filters, sorting, pagination), product pages (gallery, variants, quantity, sale /
sold-out states, trust block, recommendations, JSON-LD), cart dialog, cart page, search, blog,
CMS pages and policies.

Deliberately not included:

- **Third-party apps** on the original (Trusted Shops badge and reviews, rewards launcher, FAQ
  bubble, "Shop" follow button). They are external scripts with their own accounts.
- **Language / country switcher.** The shop sells in CHF to CH/LI only, so every request runs in the
  `CH`/`DE` buyer context.
- **List-view toggle, image zoom, price-range filter.** These are secondary interactions that can
  be added on top of the existing components.
- **Customer accounts.** "Anmelden" redirects to Shopify's hosted customer accounts.

The reference site blocks automated desktop browsers ("Developer tools are not allowed"). Desktop
layout values were therefore taken from the theme's CSS and markup, and checked against
tablet/mobile renders.

When running against mock.shop, prices are in USD and products are home goods. That is the demo
catalogue's data, not a formatting issue.

## Known trade-offs

- **Brand-colour contrast.** The gold accent (`#d4b654`) on white is used for prices and links on
  the original and fails WCAG AA for small text. It was kept for fidelity. A production fix would
  darken it for text only (e.g. `#8a7425`) and keep the original for buttons and surfaces.
- **404 status on streamed pages.** Product, collection and article pages stream behind
  `Suspense`, so when `notFound()` is called the 200 status has already been sent. Next.js then
  adds `noindex`, so search engines still treat the page as missing.
