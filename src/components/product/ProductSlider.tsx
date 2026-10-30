"use client";

import { Children, useRef, type ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import styles from "./ProductSlider.module.css";

type ProductSliderProps = {
  label: string;
  children: ReactNode;
};

/**
 * Horizontally scrolling row built on native scroll snapping, so touch,
 * trackpad and keyboard scrolling all work; the arrows are an extra for mice.
 */
export function ProductSlider({ label, children }: ProductSliderProps) {
  const listRef = useRef<HTMLUListElement>(null);

  const scrollByPage = (direction: 1 | -1) => {
    const list = listRef.current;
    list?.scrollBy({ left: direction * list.clientWidth, behavior: "smooth" });
  };

  return (
    <div className={styles.slider}>
      <ul ref={listRef} className={styles.list} aria-label={label}>
        {Children.map(children, (child) => (
          <li className={styles.item}>{child}</li>
        ))}
      </ul>
      <button
        type="button"
        className={`${styles.arrow} ${styles.previous}`}
        onClick={() => scrollByPage(-1)}
        aria-label="Zurück"
      >
        <ChevronLeftIcon />
      </button>
      <button
        type="button"
        className={`${styles.arrow} ${styles.next}`}
        onClick={() => scrollByPage(1)}
        aria-label="Weiter"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}
