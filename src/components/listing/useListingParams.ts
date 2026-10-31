"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { listingParamNames } from "@/lib/listing-params";
import { parsePriceRange, priceRangeInput, type PriceRange } from "@/lib/shopify/listing";

/**
 * Updates sorting and filters in the URL. Any change starts again on the
 * first page, because pagination cursors are only valid for one query.
 */
export function useListingParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Checkboxes reflect a click immediately, before the new listing has loaded.
  const [activeFilters, setOptimisticFilters] = useOptimistic(
    searchParams.getAll(listingParamNames.filter),
  );

  const navigate = (update: (params: URLSearchParams) => void, nextFilters?: string[]) => {
    const params = new URLSearchParams(searchParams);
    params.delete(listingParamNames.after);
    params.delete(listingParamNames.before);
    update(params);

    const query = params.toString();
    startTransition(() => {
      if (nextFilters) setOptimisticFilters(nextFilters);
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  const setFilters = (next: string[]) =>
    navigate((params) => {
      params.delete(listingParamNames.filter);
      next.forEach((filter) => params.append(listingParamNames.filter, filter));
    }, next);

  return {
    isPending,
    activeFilters,
    sortValue: searchParams.get(listingParamNames.sort),
    setSort: (value: string) => navigate((params) => params.set(listingParamNames.sort, value)),
    toggleFilter: (input: string) => {
      const next = activeFilters.includes(input)
        ? activeFilters.filter((filter) => filter !== input)
        : [...activeFilters, input];
      setFilters(next);
    },
    /** Replaces the price filter; an open range on both ends removes it. */
    setPriceRange: (range: PriceRange) => {
      const input = priceRangeInput(range);
      const others = activeFilters.filter((filter) => parsePriceRange(filter) === null);
      setFilters(input ? [...others, input] : others);
    },
    clearFilters: () => navigate((params) => params.delete(listingParamNames.filter), []),
  };
}
