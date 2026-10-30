import type { SearchParams } from "@/lib/listing-params";
import { getCheckboxFilters } from "@/lib/shopify/listing";
import type { ProductListing as ProductListingData } from "@/lib/shopify/types";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterSidebar } from "./FilterSidebar";
import { Pagination } from "./Pagination";
import { SortSelect } from "./SortSelect";
import styles from "./ProductListing.module.css";

type ProductListingProps = {
  listing: ProductListingData;
  sortOptions: { value: string; label: string }[];
  sortValue: string;
  pathname: string;
  searchParams: SearchParams;
};

/** Filter sidebar, sort toolbar, product grid and pagination of collection and search pages. */
export function ProductListing({
  listing,
  sortOptions,
  sortValue,
  pathname,
  searchParams,
}: ProductListingProps) {
  const filters = getCheckboxFilters(listing.filters);
  const hasFilters = filters.length > 0;

  return (
    <div className={hasFilters ? styles.withSidebar : undefined}>
      {hasFilters && <FilterSidebar filters={filters} />}

      <div>
        <div className={styles.toolbar}>
          <SortSelect options={sortOptions} value={sortValue} />
        </div>

        <h2 className="visually-hidden">Produkte</h2>
        {listing.products.length ? (
          <ul className={styles.grid}>
            {listing.products.map((product, index) => (
              <li key={product.id}>
                <ProductCard product={product} eager={index < 4} />
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>Leider wurden keine Produkte gefunden.</p>
        )}

        <Pagination pathname={pathname} searchParams={searchParams} pageInfo={listing.pageInfo} />
      </div>
    </div>
  );
}
