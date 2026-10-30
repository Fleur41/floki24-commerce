import type { Metadata } from "next";
import { Suspense } from "react";
import { firstParam, readListingQuery } from "@/lib/listing-params";
import { searchProducts } from "@/lib/shopify/search";
import { searchSortOptions } from "@/lib/shopify/sorting";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProductListing } from "@/components/listing/ProductListing";
import { ProductListingSkeleton } from "@/components/listing/ProductListingSkeleton";

export const metadata: Metadata = {
  title: "Suche",
  robots: { index: false },
};

export default function SearchPage(props: PageProps<"/search">) {
  return (
    <div className="container">
      <Suspense fallback={<ProductListingSkeleton />}>
        <SearchResults {...props} />
      </Suspense>
    </div>
  );
}

async function SearchResults({ searchParams }: PageProps<"/search">) {
  const resolvedSearchParams = await searchParams;
  const searchTerm = firstParam(resolvedSearchParams.q)?.trim() ?? "";
  // Set by the "Alle Kategorien" dropdown in the header search.
  const productType = firstParam(resolvedSearchParams.type);

  if (!searchTerm) {
    return (
      <>
        <PageHeader title="Suche" />
        <p>Bitte geben Sie einen Suchbegriff ein.</p>
      </>
    );
  }

  const { sortValue, query } = readListingQuery(resolvedSearchParams, searchSortOptions);
  if (productType) query.filters.push({ productType });

  const result = await searchProducts(searchTerm, query);
  const resultLabel = result.totalCount === 1 ? "Ergebnis" : "Ergebnisse";

  return (
    <>
      <PageHeader
        title="Suche"
        heading={`${result.totalCount} ${resultLabel} für „${searchTerm}“`}
      />
      <ProductListing
        listing={result}
        sortOptions={searchSortOptions}
        sortValue={sortValue}
        pathname="/search"
        searchParams={resolvedSearchParams}
      />
    </>
  );
}
