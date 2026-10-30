import { getDictionary } from "@/i18n/server";
import styles from "./ProductSkeleton.module.css";

/** Placeholder for the product page while its data streams in. */
export async function ProductSkeleton() {
  const { product } = await getDictionary();
  return (
    <div className={styles.skeleton} aria-busy aria-label={product.loading}>
      <div className={styles.image} />
      <div className={styles.details}>
        <div className={styles.title} />
        <div className={styles.line} />
        <div className={styles.button} />
      </div>
    </div>
  );
}
