"use client";

import { useEffect, useState } from "react";
import type { PredictiveSearchResult } from "@/lib/shopify/types";

const DEBOUNCE_MS = 250;
const MIN_QUERY_LENGTH = 2;

/** Debounced predictive search; returns `null` while there is nothing to show. */
export function usePredictiveSearch(query: string): PredictiveSearchResult | null {
  const [result, setResult] = useState<PredictiveSearchResult | null>(null);
  const term = query.trim();

  useEffect(() => {
    if (term.length < MIN_QUERY_LENGTH) return;

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(`/api/predictive-search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        if (response.ok) setResult(await response.json());
      } catch (error) {
        if (!controller.signal.aborted) console.error("Predictive search failed", error);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [term]);

  return term.length < MIN_QUERY_LENGTH ? null : result;
}
