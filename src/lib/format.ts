import type { Locale } from "@/i18n/config";
import type { Money } from "@/lib/shopify/types";

// The reference shop renders "CHF 1,999.00": currency code first, comma
// thousands separator and two decimals — not the de-CH default "CHF 1’999.00".
const amountFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMoney({ amount, currencyCode }: Money): string {
  return `${currencyCode} ${amountFormat.format(Number(amount))}`;
}

/** Multiplies a unit price, e.g. for optimistic cart line totals. */
export function multiplyMoney({ amount, currencyCode }: Money, factor: number): Money {
  return { amount: String(Number(amount) * factor), currencyCode };
}

/** Rounded discount in percent, or `null` when there is no real saving. */
export function discountPercentage(price: Money, compareAtPrice: Money | null): number | null {
  if (!compareAtPrice) return null;

  const current = Number(price.amount);
  const original = Number(compareAtPrice.amount);
  if (original <= current) return null;

  const percentage = Math.round(((original - current) / original) * 100);
  return percentage > 0 ? percentage : null;
}

/** Swiss conventions where they exist; English keeps the reference shop's "September 27, 2024". */
const DATE_LOCALES: Record<Locale, string> = { de: "de-CH", en: "en-US", fr: "fr-CH", it: "it-CH" };

const dateFormats = new Map<Locale, Intl.DateTimeFormat>();

export function formatDate(isoDate: string, locale: Locale = "en"): string {
  let dateFormat = dateFormats.get(locale);
  if (!dateFormat) {
    dateFormat = new Intl.DateTimeFormat(DATE_LOCALES[locale], {
      dateStyle: "long",
      timeZone: "Europe/Zurich",
    });
    dateFormats.set(locale, dateFormat);
  }
  return dateFormat.format(new Date(isoDate));
}
