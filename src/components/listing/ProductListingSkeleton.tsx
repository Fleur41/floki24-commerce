import styles from "./ProductListingSkeleton.module.css";

const PLACEHOLDER_COUNT = 8;

/** Placeholder grid shown while a listing streams in. */
export function ProductListingSkeleton() {
  return (
    <div className={styles.skeleton} aria-busy aria-label="Produkte werden geladen">
      <div className={styles.title} />
      <ul className={styles.grid}>
        {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
          <li key={index} className={styles.card} />
        ))}
      </ul>
    </div>
  );
}
