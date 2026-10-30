"use client";

import { useEffect, useRef, useState } from "react";
import { localeNames, locales, type Locale } from "@/i18n/config";
import { useDictionary, useLocale } from "@/i18n/client";
import { Flag } from "./Flag";
import { switchLocale } from "./switchLocale";
import styles from "./LanguageSwitcher.module.css";

/** Flag dropdown in the top bar. The choice is stored in a cookie that `proxy.ts` routes by. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const current = useLocale();
  const { topBar } = useDictionary();
  const [isOpen, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const choose = (locale: Locale) => {
    setOpen(false);
    if (locale !== current) switchLocale(locale);
  };

  return (
    <div ref={rootRef} className={`${styles.switcher} ${className ?? ""}`}>
      <button
        type="button"
        className={styles.toggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`${topBar.language}: ${localeNames[current]}`}
        onClick={() => setOpen(!isOpen)}
      >
        <Flag locale={current} />
        <span className={`${styles.caret} ${isOpen ? styles.caretOpen : ""}`} aria-hidden />
      </button>
      {isOpen && (
        <ul className={styles.menu} role="listbox" aria-label={topBar.language}>
          {locales.map((locale) => (
            <li key={locale} role="option" aria-selected={locale === current}>
              <button
                type="button"
                lang={locale}
                className={styles.option}
                onClick={() => choose(locale)}
              >
                <Flag locale={locale} />
                {localeNames[locale]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
