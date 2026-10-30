"use client";

import { isLocale, localeNames, locales } from "@/i18n/config";
import { useDictionary, useLocale } from "@/i18n/client";
import { switchLocale } from "@/components/i18n/switchLocale";
import { ChevronDownIcon } from "@/components/ui/icons";
import styles from "./Footer.module.css";

/** Language and country selects at the bottom of the footer, like Shopify's localization form. */
export function FooterLocalization() {
  const locale = useLocale();
  const { topBar, footer } = useDictionary();

  return (
    <div className={styles.localization}>
      <div className={styles.select}>
        <select
          aria-label={topBar.language}
          value={locale}
          onChange={(event) => {
            const next = event.target.value;
            if (isLocale(next) && next !== locale) switchLocale(next);
          }}
        >
          {locales.map((code) => (
            <option key={code} value={code}>
              {localeNames[code]}
            </option>
          ))}
        </select>
        <ChevronDownIcon />
      </div>
      {/* floki24 sells in Switzerland only, so this is the single market. */}
      <div className={styles.select}>
        <select aria-label={footer.country} defaultValue="CH">
          <option value="CH">{footer.countryName}</option>
        </select>
        <ChevronDownIcon />
      </div>
    </div>
  );
}
