import { discountPercentage, formatMoney } from "@/lib/format";
import type { ProductVariant } from "@/lib/shopify/types";
import styles from "./ProductPrice.module.css";

type ProductPriceProps = {
  variant: ProductVariant;
};

/** Price row of the product page: status badge, compare-at price and current price. */
export function ProductPrice({ variant }: ProductPriceProps) {
  const discount = discountPercentage(variant.price, variant.compareAtPrice);

  return (
    <div className={styles.price}>
      {!variant.availableForSale ? (
        <span className={`${styles.badge} ${styles.soldOut}`}>Ausverkauft</span>
      ) : (
        discount && <span className={`${styles.badge} ${styles.sale}`}>Sparen Sie {discount}%</span>
      )}
      {discount && variant.compareAtPrice && (
        <s className={styles.compareAt}>
          <span className="visually-hidden">Ursprünglicher Preis</span>
          {formatMoney(variant.compareAtPrice)}
        </s>
      )}
      <span className={discount ? styles.salePrice : styles.current}>
        <span className="visually-hidden">Aktueller Preis</span>
        {formatMoney(variant.price)}
      </span>
    </div>
  );
}
