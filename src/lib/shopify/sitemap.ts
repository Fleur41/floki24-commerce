import { defaultLocale } from "@/i18n/config";
import { cacheLife, cacheTag } from "next/cache";
import { cacheTags } from "./cache";
import { storefront } from "./client";
import { PAGE_INFO_FRAGMENT, gql } from "./fragments";
import type { PageInfo } from "./types";

export type SitemapEntry = { handle: string; updatedAt: string };

/** Upper bound of pages fetched per resource, to keep sitemap generation bounded. */
const MAX_PAGES = 20;

const SITEMAP_QUERY = gql(
  /* GraphQL */ `
    query SitemapEntries($productsAfter: String, $collectionsAfter: String) {
      products(first: 250, after: $productsAfter) {
        pageInfo {
          ...PageInfo
        }
        nodes {
          handle
          updatedAt
        }
      }
      collections(first: 250, after: $collectionsAfter) {
        pageInfo {
          ...PageInfo
        }
        nodes {
          handle
          updatedAt
        }
      }
    }
  `,
  PAGE_INFO_FRAGMENT,
);

type Connection = { pageInfo: PageInfo; nodes: SitemapEntry[] };

/** Every product and collection handle, walking the cursors of both connections. */
export async function getSitemapEntries(): Promise<{
  products: SitemapEntry[];
  collections: SitemapEntry[];
}> {
  "use cache";
  cacheLife("days");
  cacheTag(cacheTags.products, cacheTags.collections);

  const products: SitemapEntry[] = [];
  const collections: SitemapEntry[] = [];
  let productsAfter: string | null = null;
  let collectionsAfter: string | null = null;
  let hasMoreProducts = true;
  let hasMoreCollections = true;

  for (let page = 0; page < MAX_PAGES && (hasMoreProducts || hasMoreCollections); page++) {
    const data: { products: Connection; collections: Connection } = await storefront(
      SITEMAP_QUERY,
      { productsAfter, collectionsAfter },
      // Handles are the same in every language; the sitemap has no [lang] segment.
      { locale: defaultLocale },
    );

    if (hasMoreProducts) {
      products.push(...data.products.nodes);
      hasMoreProducts = data.products.pageInfo.hasNextPage;
      productsAfter = data.products.pageInfo.endCursor;
    }
    if (hasMoreCollections) {
      collections.push(...data.collections.nodes);
      hasMoreCollections = data.collections.pageInfo.hasNextPage;
      collectionsAfter = data.collections.pageInfo.endCursor;
    }
  }

  return { products, collections };
}
