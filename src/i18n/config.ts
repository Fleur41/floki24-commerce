/** Languages the storefront is available in. German is the shop's own language. */
export const locales = ["de", "en", "fr", "it"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";

/**
 * The chosen language lives in a cookie rather than the URL, so every page
 * keeps its address. `proxy.ts` rewrites each request to `/[lang]/…`.
 */
export const LOCALE_COOKIE = "locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Each language in its own name, as listed in the switcher. */
export const localeNames: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  fr: "Français",
  it: "Italiano",
};

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

/** Fills `{name}` placeholders, e.g. `format("{count} Artikel", { count: 3 })`. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
