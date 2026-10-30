import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/shopify/sitemap";
import { siteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products, collections } = await getSitemapEntries();
  const url = (path: string) => new URL(path, siteUrl).toString();

  return [
    { url: url("/"), changeFrequency: "daily", priority: 1 },
    ...collections.map((collection) => ({
      url: url(`/collections/${collection.handle}`),
      lastModified: collection.updatedAt,
    })),
    ...products.map((product) => ({
      url: url(`/products/${product.handle}`),
      lastModified: product.updatedAt,
    })),
  ];
}
