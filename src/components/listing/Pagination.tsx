import Link from "next/link";
import { getDictionary } from "@/i18n/server";
import { listingParamNames, toURLSearchParams, type SearchParams } from "@/lib/listing-params";
import type { PageInfo } from "@/lib/shopify/types";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import styles from "./Pagination.module.css";

type PaginationProps = {
  pathname: string;
  searchParams: SearchParams;
  pageInfo: PageInfo;
};

/** Previous/next navigation; the Storefront API paginates with cursors, not page numbers. */
export async function Pagination({ pathname, searchParams, pageInfo }: PaginationProps) {
  if (!pageInfo.hasPreviousPage && !pageInfo.hasNextPage) return null;
  const { listing } = await getDictionary();

  const hrefWithCursor = (name: "after" | "before", cursor: string | null) => {
    const params = toURLSearchParams(searchParams);
    params.delete(listingParamNames.after);
    params.delete(listingParamNames.before);
    if (cursor) params.set(listingParamNames[name], cursor);
    return `${pathname}?${params}`;
  };

  return (
    <nav className={styles.pagination} aria-label={listing.pagination}>
      {pageInfo.hasPreviousPage && (
        <Link href={hrefWithCursor("before", pageInfo.startCursor)} className={styles.link}>
          <ChevronLeftIcon />
          {listing.previousPage}
        </Link>
      )}
      {pageInfo.hasNextPage && (
        <Link href={hrefWithCursor("after", pageInfo.endCursor)} className={styles.link}>
          {listing.nextPage}
          <ChevronRightIcon />
        </Link>
      )}
    </nav>
  );
}
