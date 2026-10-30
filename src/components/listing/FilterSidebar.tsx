"use client";

import { useState } from "react";
import type { Filter } from "@/lib/shopify/types";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";
import { useListingParams } from "./useListingParams";
import styles from "./FilterSidebar.module.css";

/** Values shown per filter before "Mehr anzeigen". */
const COLLAPSED_VALUE_COUNT = 5;

type FilterSidebarProps = {
  filters: Filter[];
};

/** Checkbox filters from the Storefront API (vendor, availability, product type, …). */
export function FilterSidebar({ filters }: FilterSidebarProps) {
  const [isOpen, setOpen] = useState(true);
  const { activeFilters, toggleFilter, clearFilters, isPending } = useListingParams();

  return (
    <aside className={styles.sidebar} aria-busy={isPending}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Filter</h2>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={isOpen}
          aria-controls="filter-groups"
          aria-label={isOpen ? "Filter ausblenden" : "Filter einblenden"}
          onClick={() => setOpen(!isOpen)}
        >
          {isOpen ? <MinusIcon /> : <PlusIcon />}
        </button>
      </div>

      <div id="filter-groups" hidden={!isOpen}>
        {activeFilters.length > 0 && (
          <button type="button" className={styles.clear} onClick={clearFilters}>
            Alle Filter entfernen
          </button>
        )}
        {filters.map((filter) => (
          <FilterGroup
            key={filter.id}
            filter={filter}
            activeFilters={activeFilters}
            onToggle={toggleFilter}
            showLabel={filters.length > 1}
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
  showLabel: boolean;
};

function FilterGroup({ filter, activeFilters, onToggle, showLabel }: FilterGroupProps) {
  const [isExpanded, setExpanded] = useState(false);
  const values = isExpanded ? filter.values : filter.values.slice(0, COLLAPSED_VALUE_COUNT);

  return (
    <fieldset className={styles.group}>
      <legend className={showLabel ? styles.legend : "visually-hidden"}>{filter.label}</legend>
      <ul className={styles.values}>
        {values.map((value) => (
          <li key={value.id}>
            <label className={styles.value}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={activeFilters.includes(value.input)}
                disabled={value.count === 0 && !activeFilters.includes(value.input)}
                onChange={() => onToggle(value.input)}
              />
              {value.label} ({value.count})
            </label>
          </li>
        ))}
      </ul>
      {filter.values.length > COLLAPSED_VALUE_COUNT && (
        <button type="button" className={styles.more} onClick={() => setExpanded(!isExpanded)}>
          {isExpanded ? "Weniger anzeigen" : "Mehr anzeigen"}
        </button>
      )}
    </fieldset>
  );
}
