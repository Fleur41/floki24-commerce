"use client";

import { useState } from "react";
import { format } from "@/i18n/config";
import { useDictionary } from "@/i18n/client";
import { parsePriceRange, type PriceRange } from "@/lib/shopify/listing";
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
 * group (or the price range) still offers a real choice.
 */
function visibleListFilters(
  filters: Filter[],
  activeFilters: string[],
  hasPriceRange: boolean,
): Filter[] {
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
  return hasPriceRange || withValues.some(isChoice) ? withValues.filter(isChoice) : withValues;
}

/** Filters from the Storefront API: checkbox lists (availability, brand, …) and the price range. */
export function FilterSidebar({ filters }: FilterSidebarProps) {
  const [isOpen, setOpen] = useState(true);
  const { listing } = useDictionary();
  const { activeFilters, toggleFilter, setPriceRange, clearFilters, isPending } =
    useListingParams();

  const priceFilter = filters.find((filter) => filter.type === "PRICE_RANGE");
  const listFilters = filters.filter((filter) => filter.type !== "PRICE_RANGE");
  const visibleFilters = visibleListFilters(listFilters, activeFilters, Boolean(priceFilter));

  const activePriceInput = activeFilters.find((filter) => parsePriceRange(filter) !== null);
  const activePrice = activePriceInput ? parsePriceRange(activePriceInput) : null;
  const priceBounds = priceFilter && parsePriceRange(priceFilter.values[0].input);

  const activeChips = listFilters
    .flatMap((filter) => filter.values)
    .filter((value) => activeFilters.includes(value.input))
    .map((value) => ({ id: value.id, label: value.label, input: value.input }));
  if (activePriceInput && activePrice) {
    const label = `${priceFilter?.label ?? listing.price}: ${activePrice.min ?? 0} – ${activePrice.max ?? priceBounds?.max ?? "∞"}`;
    activeChips.push({ id: "price", label, input: activePriceInput });
  }

  if (visibleFilters.length === 0 && !priceFilter && activeChips.length === 0) return null;

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
        {activeChips.length > 0 && (
          <div className={styles.active}>
            <ul className={styles.chips} aria-label={listing.activeFilters}>
              {activeChips.map((value) => (
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

        {priceFilter && (
          <PriceRangeFilter
            // Re-mounts with the URL's values when the range changes elsewhere (chip, "clear all").
            key={activePriceInput ?? "none"}
            label={priceFilter.label}
            bounds={priceBounds ?? {}}
            active={activePrice}
            onApply={setPriceRange}
          />
        )}
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

type PriceRangeFilterProps = {
  label: string;
  /** Lowest and highest price in the listing. */
  bounds: PriceRange;
  active: PriceRange | null;
  onApply: (range: PriceRange) => void;
};

function toNumber(value: string): number | undefined {
  const number = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(number) && number >= 0 ? number : undefined;
}

/** "From / To" price inputs, applied with the button or Enter. */
function PriceRangeFilter({ label, bounds, active, onApply }: PriceRangeFilterProps) {
  const { listing } = useDictionary();
  const [min, setMin] = useState(active?.min?.toString() ?? "");
  const [max, setMax] = useState(active?.max?.toString() ?? "");

  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{label}</legend>
      <form
        className={styles.price}
        onSubmit={(event) => {
          event.preventDefault();
          onApply({ min: toNumber(min), max: toNumber(max) });
        }}
      >
        <label className={styles.priceField}>
          <span>{listing.priceFrom}</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            className={styles.priceInput}
            placeholder={String(bounds.min ?? 0)}
            value={min}
            onChange={(event) => setMin(event.target.value)}
          />
        </label>
        <span className={styles.priceDash} aria-hidden>
          –
        </span>
        <label className={styles.priceField}>
          <span>{listing.priceTo}</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            className={styles.priceInput}
            placeholder={bounds.max !== undefined ? String(Math.ceil(bounds.max)) : ""}
            value={max}
            onChange={(event) => setMax(event.target.value)}
          />
        </label>
        <button type="submit" className={styles.priceApply}>
          {listing.applyPrice}
        </button>
      </form>
    </fieldset>
  );
}
