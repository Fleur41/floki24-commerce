"use client";

import { createContext, use, type ReactNode } from "react";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/de";

const I18nContext = createContext<{ locale: Locale; dictionary: Dictionary } | null>(null);

export function I18nProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
}) {
  return <I18nContext value={{ locale, dictionary }}>{children}</I18nContext>;
}

function useI18n() {
  const context = use(I18nContext);
  if (!context) throw new Error("i18n hooks must be used inside <I18nProvider>");
  return context;
}

export const useDictionary = () => useI18n().dictionary;
export const useLocale = () => useI18n().locale;
