"use client";

import { ChevronDownIcon } from "@/components/ui/icons";
import { useListingParams } from "./useListingParams";
import styles from "./SortSelect.module.css";

type SortSelectProps = {
  options: { value: string; label: string }[];
  /** Resolved on the server, so the default option is shown even without `?sort_by`. */
  value: string;
};

export function SortSelect({ options, value }: SortSelectProps) {
  const { setSort, isPending } = useListingParams();

  return (
    <div className={styles.sort}>
      <label htmlFor="sort-by" className={styles.label}>
        Sortieren nach
      </label>
      <div className={styles.selectWrapper}>
        <select
          id="sort-by"
          className={styles.select}
          value={value}
          disabled={isPending}
          onChange={(event) => setSort(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className={styles.icon} />
      </div>
    </div>
  );
}
