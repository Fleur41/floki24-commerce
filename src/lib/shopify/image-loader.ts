import type { ImageLoaderProps } from "next/image";

/**
 * Next.js image loader for the Shopify CDN. Shopify resizes images through
 * the `width` query parameter, so no server-side optimisation is needed.
 * Small local assets (icons) are rendered with a plain <img> instead.
 */
export default function shopifyImageLoader({ src, width }: ImageLoaderProps): string {
  const url = new URL(src);
  url.searchParams.set("width", String(width));
  return url.toString();
}
