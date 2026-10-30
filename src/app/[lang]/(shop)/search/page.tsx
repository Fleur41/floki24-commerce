import type { Metadata } from "next";
import { Suspense } from "react";
import { format } from "@/i18n/config";
import { getDictionary } from "@/i18n/server";
import { firstParam, readListingQuery } from "@/lib/listing-params";
import { searchProducts } from "@/lib/shopify/search";
import { searchSortOptions } from "@/lib/shopify/sorting";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProductListing } from "@/components/listing/ProductListing";
import { ProductListingSkeleton } from "@/components/listing/ProductListingSkeleton";

export async function generateMetadata(): Promise<Metadata> {
  const { search } = await getDictionary();
  return { title: search.title, robots: { index: false } };
}

export default function SearchPage(props: PageProps<"/[lang]/search">) {
  return (
    <div className="container">
      <Suspense fallback={<ProductListingSkeleton />}>
        <SearchResults {...props} />
      </Suspense>
    </div>
  );
}

async function SearchResults({ searchParams }: PageProps<"/[lang]/search">) {
  const [resolvedSearchParams, { search }] = await Promise.all([searchParams, getDictionary()]);
  const searchTerm = firstParam(resolvedSearchParams.q)?.trim() ?? "";
  // Set by the "Alle Kategorien" dropdown in the header search.
  const productType = firstParam(resolvedSearchParams.type);

  if (!searchTerm) {
    return (
      <>
        <PageHeader title={search.title} />
        <p>{search.enterTerm}</p>
      </>
    );
  }

  const { sortValue, query } = readListingQuery(resolvedSearchParams, searchSortOptions);
  if (productType) query.filters.push({ productType });

  const result = await searchProducts(searchTerm, query);
  const heading = format(result.totalCount === 1 ? search.resultsOne : search.resultsOther, {
    count: result.totalCount,
    term: searchTerm,
  });

  return (
    <>
      <PageHeader title={search.title} heading={heading} />
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
