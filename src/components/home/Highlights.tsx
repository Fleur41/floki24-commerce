import type { Highlight } from "@/content/home";
import styles from "./Highlights.module.css";

type HighlightsProps = {
  items: Highlight[];
};

/** USP strip below the slideshow ("Kostenloser Versand", …). */
export function Highlights({ items }: HighlightsProps) {
  return (
    <section className={styles.highlights} aria-label="Unsere Vorteile">
      <ul className={`container ${styles.list}`}>
        {items.map((item) => (
          <li key={item.title} className={styles.item}>
            {/* Tiny icons, partly local SVGs: next/image adds nothing here. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.icon} alt="" width={54} height={44} className={styles.icon} />
            <span className={styles.title}>{item.title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
