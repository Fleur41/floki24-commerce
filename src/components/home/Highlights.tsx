import { getDictionary } from "@/i18n/server";
import type { Highlight } from "@/content/home";
import styles from "./Highlights.module.css";

type HighlightsProps = {
  items: Highlight[];
};

/** USP strip below the slideshow ("Kostenloser Versand", …). */
export async function Highlights({ items }: HighlightsProps) {
  const { home } = await getDictionary();
  return (
    <section className={styles.highlights} aria-label={home.highlights}>
      {/* Scrolls sideways on phones; focusable so keyboard users can scroll it too. */}
      <ul className={`container ${styles.list}`} tabIndex={0}>
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
