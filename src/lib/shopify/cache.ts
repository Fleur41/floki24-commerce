/** Cache tags for Storefront data, invalidated by Shopify webhooks (see /api/revalidate). */
export const cacheTags = {
  products: "shopify:products",
  collections: "shopify:collections",
  content: "shopify:content",
} as const;
