import { cookies } from "next/headers";
import { lang } from "next/root-params";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "./config";
import de from "./dictionaries/de";
import en from "./dictionaries/en";
import fr from "./dictionaries/fr";
import it from "./dictionaries/it";
import type { Dictionary } from "./dictionaries/de";

const dictionaries: Record<Locale, Dictionary> = { de, en, fr, it };

/** Locale of the page being rendered (the `[lang]` root segment). Server Components only. */
export async function getLocale(): Promise<Locale> {
  const locale = await lang();
  return isLocale(locale) ? locale : defaultLocale;
}

export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()];
}

/**
 * Server Actions and Route Handlers have no root params, so they read the
 * locale cookie that `proxy.ts` routes by instead.
 */
export async function getRequestLocale(): Promise<Locale> {
  const locale = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(locale) ? locale : defaultLocale;
}

export async function getRequestDictionary(): Promise<Dictionary> {
  return dictionaries[await getRequestLocale()];
}
