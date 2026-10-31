import { getDictionary } from "@/i18n/server";
import type { SearchParams } from "@/lib/listing-params";
import { getCheckboxFilters } from "@/lib/shopify/listing";
import type { ProductListing as ProductListingData } from "@/lib/shopify/types";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterSidebar } from "./FilterSidebar";
import { ListingLayout } from "./ListingLayout";
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
export async function ProductListing({
  listing,
  sortOptions,
  sortValue,
  pathname,
  searchParams,
}: ProductListingProps) {
  const { common, listing: t } = await getDictionary();
  const filters = getCheckboxFilters(listing.filters);
  const hasFilters = filters.length > 0;

  return (
    <div className={hasFilters ? styles.withSidebar : undefined}>
      {hasFilters && <FilterSidebar filters={filters} />}

      <div>
        <ListingLayout
          sort={
            <SortSelect
              options={sortOptions.map((option) => ({
                ...option,
                label: t.sort[option.value as keyof typeof t.sort] ?? option.label,
              }))}
              value={sortValue}
            />
          }
        >
          <h2 className="visually-hidden">{common.products}</h2>
          {listing.products.length ? (
            <ul className={styles.grid}>
              {listing.products.map((product, index) => (
                <li key={product.id}>
                  <ProductCard product={product} eager={index < 4} />
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>{t.noProducts}</p>
          )}
        </ListingLayout>

        <Pagination pathname={pathname} searchParams={searchParams} pageInfo={listing.pageInfo} />
      </div>
    </div>
  );
}
