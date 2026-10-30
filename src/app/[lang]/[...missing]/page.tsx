import { notFound } from "next/navigation";

/**
 * Every unmatched URL lands here (the proxy rewrites it under a locale), so it
 * gets the localized `[lang]/not-found.tsx` instead of Next's bare default 404.
 */
export default function MissingPage() {
  notFound();
}
