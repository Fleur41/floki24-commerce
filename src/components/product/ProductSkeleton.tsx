import styles from "./ProductSkeleton.module.css";

/** Placeholder for the product page while its data streams in. */
export function ProductSkeleton() {
  return (
    <div className={styles.skeleton} aria-busy aria-label="Produkt wird geladen">
      <div className={styles.image} />
      <div className={styles.details}>
        <div className={styles.title} />
        <div className={styles.line} />
        <div className={styles.button} />
      </div>
    </div>
  );
}
