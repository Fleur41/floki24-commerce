import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getDictionary } from "@/i18n/server";
import { readListingQuery } from "@/lib/listing-params";
import {
  getCatalogProducts,
  getCollection,
  getCollectionProducts,
} from "@/lib/shopify/collections";
import { catalogSortOptions, collectionSortOptions } from "@/lib/shopify/sorting";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProductListing } from "@/components/listing/ProductListing";
import { ProductListingSkeleton } from "@/components/listing/ProductListingSkeleton";
import styles from "./page.module.css";
import { demoteHeadings } from "@/lib/html";

/** Shopify's virtual collection containing every product. */
const ALL_PRODUCTS_HANDLE = "all";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/collections/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  if (handle === ALL_PRODUCTS_HANDLE) return { title: (await getDictionary()).listing.allProducts };

  const collection = await getCollection(handle);
  if (!collection) return {};

  return {
    title: collection.seo.title || collection.title,
    description: collection.seo.description || collection.description,
  };
}

export default function CollectionPage(props: PageProps<"/[lang]/collections/[handle]">) {
  return (
    <div className="container">
      <Suspense fallback={<ProductListingSkeleton />}>
        <CollectionContent {...props} />
      </Suspense>
    </div>
  );
}

async function CollectionContent({
  params,
  searchParams,
}: PageProps<"/[lang]/collections/[handle]">) {
  const { handle } = await params;
  const resolvedSearchParams = await searchParams;
  const pathname = `/collections/${handle}`;

  if (handle === ALL_PRODUCTS_HANDLE) {
    const { sortValue, query } = readListingQuery(resolvedSearchParams, catalogSortOptions);
    const [listing, { listing: t }] = await Promise.all([
      getCatalogProducts(query),
      getDictionary(),
    ]);

    return (
      <>
        <PageHeader title={t.allProducts} />
        <ProductListing
          listing={listing}
          sortOptions={catalogSortOptions}
          sortValue={sortValue}
          pathname={pathname}
          searchParams={resolvedSearchParams}
        />
      </>
    );
  }

  const { sortValue, query } = readListingQuery(resolvedSearchParams, collectionSortOptions);
  const [collection, listing] = await Promise.all([
    getCollection(handle),
    getCollectionProducts(handle, query),
  ]);
  if (!collection || !listing) notFound();

  return (
    <>
      <PageHeader title={collection.title} />
      {collection.descriptionHtml && (
        <div
          className={`rte ${styles.description}`}
          dangerouslySetInnerHTML={{ __html: demoteHeadings(collection.descriptionHtml) }}
        />
      )}
      <ProductListing
        listing={listing}
        sortOptions={collectionSortOptions}
        sortValue={sortValue}
        pathname={pathname}
        searchParams={resolvedSearchParams}
      />
    </>
  );
}
