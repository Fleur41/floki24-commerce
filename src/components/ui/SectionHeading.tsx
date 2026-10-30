import type { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

type SectionHeadingProps = {
  id?: string;
  children: ReactNode;
};

/** Centred section title ("Unsere Kategorien", "Angebote", …). */
export function SectionHeading({ id, children }: SectionHeadingProps) {
  return (
    <h2 id={id} className={styles.heading}>
      {children}
    </h2>
  );
}
