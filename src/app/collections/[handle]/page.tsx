import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
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

/** Shopify's virtual collection containing every product. */
const ALL_PRODUCTS_HANDLE = "all";

export async function generateMetadata({
  params,
}: PageProps<"/collections/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  if (handle === ALL_PRODUCTS_HANDLE) return { title: "Alle Produkte" };

  const collection = await getCollection(handle);
  if (!collection) return {};

  return {
    title: collection.seo.title || collection.title,
    description: collection.seo.description || collection.description,
  };
}

export default function CollectionPage(props: PageProps<"/collections/[handle]">) {
  return (
    <div className="container">
      <Suspense fallback={<ProductListingSkeleton />}>
        <CollectionContent {...props} />
      </Suspense>
    </div>
  );
}

async function CollectionContent({ params, searchParams }: PageProps<"/collections/[handle]">) {
  const { handle } = await params;
  const resolvedSearchParams = await searchParams;
  const pathname = `/collections/${handle}`;

  if (handle === ALL_PRODUCTS_HANDLE) {
    const { sortValue, query } = readListingQuery(resolvedSearchParams, catalogSortOptions);
    const listing = await getCatalogProducts(query);

    return (
      <>
        <PageHeader title="Alle Produkte" />
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
          dangerouslySetInnerHTML={{ __html: collection.descriptionHtml }}
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
