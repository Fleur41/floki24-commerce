"use client";

import type { ComponentProps, ReactNode } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";
import styles from "./fields.module.css";

type FieldProps = ComponentProps<"input"> & {
  name: string;
  label: string;
  error?: string;
  optional?: boolean;
  /** Trailing icon inside the field, e.g. a help tooltip. */
  adornment?: ReactNode;
};

/** Text input with a floating label and an inline error, like Shopify's checkout. */
export function Field({
  name,
  label,
  error,
  optional,
  adornment,
  id = name,
  ...props
}: FieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className={styles.wrap}>
      <div className={`${styles.field} ${error ? styles.invalid : ""}`}>
        <input
          id={id}
          name={name}
          className={styles.input}
          placeholder=" "
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        <label htmlFor={id} className={styles.label}>
          {label}
          {optional && " (optional)"}
        </label>
        {adornment && <span className={styles.adornment}>{adornment}</span>}
      </div>
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

type SelectFieldProps = ComponentProps<"select"> & {
  name: string;
  label: string;
  error?: string;
  options: readonly { code: string; name: string }[];
};

export function SelectField({
  name,
  label,
  error,
  options,
  id = name,
  ...props
}: SelectFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className={styles.wrap}>
      <div className={`${styles.field} ${styles.select} ${error ? styles.invalid : ""}`}>
        <select
          id={id}
          name={name}
          className={styles.input}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.code} value={option.code}>
              {option.name}
            </option>
          ))}
        </select>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        <ChevronDownIcon className={styles.chevron} />
      </div>
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

export function Checkbox({ label, ...props }: ComponentProps<"input"> & { label: ReactNode }) {
  return (
    <label className={styles.checkbox}>
      <input type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  );
}
