import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, type Locale } from "@/i18n/config";

/** Stores the language for `proxy.ts` and reloads the page in it. */
export function switchLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
  // A full reload drops pages the client router cached in the old language.
  window.location.reload();
}
