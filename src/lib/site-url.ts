/** Public origin of the storefront, used for absolute URLs (sitemap, robots, Open Graph). */
export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
