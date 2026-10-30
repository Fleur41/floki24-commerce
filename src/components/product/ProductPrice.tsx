import { format } from "@/i18n/config";
import { useDictionary } from "@/i18n/client";
import { discountPercentage, formatMoney } from "@/lib/format";
import type { ProductVariant } from "@/lib/shopify/types";
import styles from "./ProductPrice.module.css";

type ProductPriceProps = {
  variant: ProductVariant;
};

/** Price row of the product page: status badge, compare-at price and current price. */
export function ProductPrice({ variant }: ProductPriceProps) {
  const discount = discountPercentage(variant.price, variant.compareAtPrice);
  const { common, product: t } = useDictionary();

  return (
    <div className={styles.price}>
      {!variant.availableForSale ? (
        <span className={`${styles.badge} ${styles.soldOut}`}>{common.soldOut}</span>
      ) : (
        discount && (
          <span className={`${styles.badge} ${styles.sale}`}>{format(t.save, { discount })}</span>
        )
      )}
      {discount && variant.compareAtPrice && (
        <s className={styles.compareAt}>
          <span className="visually-hidden">{t.originalPrice}</span>
          {formatMoney(variant.compareAtPrice)}
        </s>
      )}
      <span className={discount ? styles.salePrice : styles.current}>
        <span className="visually-hidden">{t.currentPrice}</span>
        {formatMoney(variant.price)}
      </span>
    </div>
  );
}
