"use client";

import { useState } from "react";
import { format } from "@/i18n/config";
import { useDictionary } from "@/i18n/client";
import type { Filter, FilterValue } from "@/lib/shopify/types";
import { CloseIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";
import { useListingParams } from "./useListingParams";
import styles from "./FilterSidebar.module.css";

/** Values shown per filter before "Mehr anzeigen". */
const COLLAPSED_VALUE_COUNT = 5;

type FilterSidebarProps = {
  filters: Filter[];
};

/**
 * Options worth showing: values without products are dropped (unless selected).
 * Groups left with a single unselected option can't narrow anything down (e.g.
 * one brand for the whole collection), so they're hidden as long as another
 * group still offers a real choice.
 */
function useVisibleFilters(filters: Filter[], activeFilters: string[]): Filter[] {
  const withValues = filters
    .map((filter) => ({
      ...filter,
      values: filter.values.filter(
        (value) => value.count > 0 || activeFilters.includes(value.input),
      ),
    }))
    .filter((filter) => filter.values.length > 0);
  const isChoice = (filter: Filter) =>
    filter.values.length > 1 || filter.values.some((value) => activeFilters.includes(value.input));
  return withValues.some(isChoice) ? withValues.filter(isChoice) : withValues;
}

/** Checkbox filters from the Storefront API (vendor, availability, product type, …). */
export function FilterSidebar({ filters }: FilterSidebarProps) {
  const [isOpen, setOpen] = useState(true);
  const { listing } = useDictionary();
  const { activeFilters, toggleFilter, clearFilters, isPending } = useListingParams();
  const visibleFilters = useVisibleFilters(filters, activeFilters);

  const activeValues = filters
    .flatMap((filter) => filter.values)
    .filter((value) => activeFilters.includes(value.input));

  if (visibleFilters.length === 0 && activeValues.length === 0) return null;

  return (
    <aside className={styles.sidebar} aria-busy={isPending}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{listing.filter}</h2>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={isOpen}
          aria-controls="filter-groups"
          aria-label={isOpen ? listing.hideFilters : listing.showFilters}
          onClick={() => setOpen(!isOpen)}
        >
          {isOpen ? <MinusIcon /> : <PlusIcon />}
        </button>
      </div>

      <div id="filter-groups" hidden={!isOpen}>
        {activeValues.length > 0 && (
          <div className={styles.active}>
            <ul className={styles.chips} aria-label={listing.activeFilters}>
              {activeValues.map((value) => (
                <li key={value.id}>
                  <button
                    type="button"
                    className={styles.chip}
                    aria-label={format(listing.removeFilter, { label: value.label })}
                    onClick={() => toggleFilter(value.input)}
                  >
                    {value.label}
                    <CloseIcon width={8} height={8} />
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className={styles.clear} onClick={clearFilters}>
              {listing.clearAll}
            </button>
          </div>
        )}

        {visibleFilters.map((filter) => (
          <FilterGroup
            key={filter.id}
            filter={filter}
            activeFilters={activeFilters}
            onToggle={toggleFilter}
          />
        ))}
      </div>
    </aside>
  );
}

type FilterGroupProps = {
  filter: Filter;
  activeFilters: string[];
  onToggle: (input: string) => void;
};

function FilterGroup({ filter, activeFilters, onToggle }: FilterGroupProps) {
  const [isExpanded, setExpanded] = useState(false);
  const { common } = useDictionary();
  const values = isExpanded ? filter.values : filter.values.slice(0, COLLAPSED_VALUE_COUNT);

  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{filter.label}</legend>
      <ul className={styles.values}>
        {values.map((value) => (
          <FilterOption
            key={value.id}
            value={value}
            checked={activeFilters.includes(value.input)}
            onToggle={onToggle}
          />
        ))}
      </ul>
      {filter.values.length > COLLAPSED_VALUE_COUNT && (
        <button type="button" className={styles.more} onClick={() => setExpanded(!isExpanded)}>
          {isExpanded ? common.showLess : common.showMore}
        </button>
      )}
    </fieldset>
  );
}

type FilterOptionProps = {
  value: FilterValue;
  checked: boolean;
  onToggle: (input: string) => void;
};

function FilterOption({ value, checked, onToggle }: FilterOptionProps) {
  return (
    <li>
      <label className={styles.value}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={checked}
          onChange={() => onToggle(value.input)}
        />
        <span className={styles.label}>{value.label}</span>
        {/* Numbers and brand names must not be machine-translated. */}
        <span className={styles.count} translate="no">
          {value.count}
        </span>
      </label>
    </li>
  );
}
