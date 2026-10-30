"use client";

import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState, type FocusEvent } from "react";
import { useDictionary } from "@/i18n/client";
import { formatMoney } from "@/lib/format";
import { ChevronDownIcon, SearchIcon } from "@/components/ui/icons";
import { usePredictiveSearch } from "./usePredictiveSearch";
import styles from "./SearchForm.module.css";

type SearchFormProps = {
  productTypes: string[];
  className?: string;
  /** Placement of the mobile toggle button inside the header grid. */
  toggleClassName?: string;
};

/**
 * Header search with the "Alle Kategorien" product-type filter and live
 * results. On small screens it collapses behind a toggle button.
 */
export function SearchForm({ productTypes, className, toggleClassName }: SearchFormProps) {
  const { header } = useDictionary();
  const [isOpenOnMobile, setOpenOnMobile] = useState(false);
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const resultsId = `${id}-results`;
  const typeSelectId = `${id}-type`;
  const result = usePredictiveSearch(query);

  const toggleMobileSearch = () => {
    setOpenOnMobile((open) => !open);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const hideResultsWhenFocusLeaves = (event: FocusEvent<HTMLFormElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setShowResults(false);
  };

  const hasResults = Boolean(result?.products.length);

  return (
    <>
      <button
        type="button"
        className={`${styles.toggle} ${toggleClassName ?? ""}`}
        aria-expanded={isOpenOnMobile}
        aria-label={header.openSearch}
        onClick={toggleMobileSearch}
      >
        <SearchIcon />
      </button>

      <Form
        action="/search"
        role="search"
        className={`${styles.form} ${className ?? ""}`}
        data-open-on-mobile={isOpenOnMobile}
        onBlur={hideResultsWhenFocusLeaves}
        onSubmit={() => setShowResults(false)}
        onKeyDown={(event) => event.key === "Escape" && setShowResults(false)}
      >
        {productTypes.length > 0 && (
          <div className={styles.typeSelect}>
            <label className="visually-hidden" htmlFor={typeSelectId}>
              Kategorie
            </label>
            <select id={typeSelectId} name="type" defaultValue="">
              <option value="">{header.allCategories}</option>
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDownIcon className={styles.selectIcon} />
          </div>
        )}

        <input
          ref={inputRef}
          className={styles.input}
          type="search"
          name="q"
          placeholder={header.searchPlaceholder}
          aria-label={header.searchPlaceholder}
          autoComplete="off"
          aria-controls={resultsId}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
        />

        <button type="submit" className={styles.submit} aria-label={header.search}>
          <SearchIcon />
        </button>

        <div id={resultsId} className={styles.results} hidden={!showResults || !hasResults}>
          <ul className={styles.resultList}>
            {result?.products.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/products/${product.handle}`}
                  className={styles.result}
                  onClick={() => setShowResults(false)}
                >
                  {product.featuredImage && (
                    <Image
                      src={product.featuredImage.url}
                      alt=""
                      width={48}
                      height={48}
                      className={styles.resultImage}
                    />
                  )}
                  <span className={styles.resultTitle}>{product.title}</span>
                  <span className={styles.resultPrice}>
                    {formatMoney(product.priceRange.minVariantPrice)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <button type="submit" className={styles.viewAll}>
            {header.allResults}
          </button>
        </div>
      </Form>
    </>
  );
}
