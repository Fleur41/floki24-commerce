import Image from "next/image";
import Link from "next/link";
import type { ImageLink } from "@/content/types";
import styles from "./ImageTiles.module.css";

type ImageTilesProps = {
  items: ImageLink[];
  /**
   * `mosaic`: one large and one narrow tile side by side (promo mosaic).
   * `grid`: two-column grid of equal tiles (promo grid).
   */
  layout: "mosaic" | "grid";
  label: string;
};

/** Image tiles with a heading overlay, linking to collections. */
export function ImageTiles({ items, layout, label }: ImageTilesProps) {
  return (
    <section className={`container ${styles.tiles} ${styles[layout]}`} aria-label={label}>
      {items.map((item) => (
        <Link key={item.href} href={item.href} className={styles.tile}>
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(min-width: 720px) 50vw, 100vw"
            className={styles.image}
          />
          <h2 className={styles.title}>{item.title}</h2>
        </Link>
      ))}
    </section>
  );
}
