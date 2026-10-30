"use client";

import { useId } from "react";
import { MinusIcon, PlusIcon } from "./icons";
import styles from "./QuantitySelector.module.css";

type QuantitySelectorProps = {
  value: number;
  onChange: (quantity: number) => void;
  label: string;
  /** Visually hide the label, e.g. inside cart line items. */
  hideLabel?: boolean;
  min?: number;
  disabled?: boolean;
};

export function QuantitySelector({
  value,
  onChange,
  label,
  hideLabel = false,
  min = 1,
  disabled = false,
}: QuantitySelectorProps) {
  const inputId = useId();

  const commit = (next: number) => {
    if (Number.isInteger(next) && next >= min) onChange(next);
  };

  return (
    <div className={styles.root}>
      <label htmlFor={inputId} className={hideLabel ? "visually-hidden" : styles.label}>
        {label}
      </label>
      <div className={styles.control}>
        <button
          type="button"
          className={styles.button}
          onClick={() => commit(value - 1)}
          disabled={disabled || value <= min}
          aria-label="Menge verringern"
        >
          <MinusIcon />
        </button>
        <input
          id={inputId}
          className={styles.input}
          type="number"
          inputMode="numeric"
          min={min}
          value={value}
          disabled={disabled}
          onChange={(event) => commit(event.currentTarget.valueAsNumber)}
        />
        <button
          type="button"
          className={styles.button}
          onClick={() => commit(value + 1)}
          disabled={disabled}
          aria-label="Menge erhöhen"
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}
