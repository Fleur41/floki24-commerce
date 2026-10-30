"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { listingParamNames } from "@/lib/listing-params";

/**
 * Updates sorting and filters in the URL. Any change starts again on the
 * first page, because pagination cursors are only valid for one query.
 */
export function useListingParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const navigate = (update: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams);
    params.delete(listingParamNames.after);
    params.delete(listingParamNames.before);
    update(params);

    const query = params.toString();
    startTransition(() =>
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false }),
    );
  };

  const activeFilters = searchParams.getAll(listingParamNames.filter);

  return {
    isPending,
    activeFilters,
    sortValue: searchParams.get(listingParamNames.sort),
    setSort: (value: string) => navigate((params) => params.set(listingParamNames.sort, value)),
    toggleFilter: (input: string) =>
      navigate((params) => {
        const next = activeFilters.includes(input)
          ? activeFilters.filter((filter) => filter !== input)
          : [...activeFilters, input];
        params.delete(listingParamNames.filter);
        next.forEach((filter) => params.append(listingParamNames.filter, filter));
      }),
    clearFilters: () => navigate((params) => params.delete(listingParamNames.filter)),
  };
}
