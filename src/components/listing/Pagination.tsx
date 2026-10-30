import Link from "next/link";
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
export function Pagination({ pathname, searchParams, pageInfo }: PaginationProps) {
  if (!pageInfo.hasPreviousPage && !pageInfo.hasNextPage) return null;

  const hrefWithCursor = (name: "after" | "before", cursor: string | null) => {
    const params = toURLSearchParams(searchParams);
    params.delete(listingParamNames.after);
    params.delete(listingParamNames.before);
    if (cursor) params.set(listingParamNames[name], cursor);
    return `${pathname}?${params}`;
  };

  return (
    <nav className={styles.pagination} aria-label="Seitennavigation">
      {pageInfo.hasPreviousPage && (
        <Link href={hrefWithCursor("before", pageInfo.startCursor)} className={styles.link}>
          <ChevronLeftIcon />
          Vorherige Seite
        </Link>
      )}
      {pageInfo.hasNextPage && (
        <Link href={hrefWithCursor("after", pageInfo.endCursor)} className={styles.link}>
          Nächste Seite
          <ChevronRightIcon />
        </Link>
      )}
    </nav>
  );
}
