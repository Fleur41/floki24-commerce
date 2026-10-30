import Image from "next/image";
import Link from "next/link";
import { format } from "@/i18n/config";
import { getDictionary } from "@/i18n/server";
import { discountPercentage, formatMoney } from "@/lib/format";
import type { ProductSummary } from "@/lib/shopify/types";
import { ProductCardActions } from "./ProductCardActions";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
  product: ProductSummary;
  /** Load the image eagerly, for cards above the fold. */
  eager?: boolean;
};

export async function ProductCard({ product, eager = false }: ProductCardProps) {
  const { common, product: t } = await getDictionary();
  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange.maxVariantPrice;
  const discount = discountPercentage(price, compareAtPrice);
  const href = `/products/${product.handle}`;

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {product.featuredImage && (
          <Image
            src={product.featuredImage.url}
            alt=""
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 720px) 33vw, 50vw"
            className={styles.image}
            loading={eager ? "eager" : "lazy"}
          />
        )}
        {!product.availableForSale ? (
          <span className={`${styles.badge} ${styles.soldOutBadge}`}>{common.soldOut}</span>
        ) : (
          discount && (
            <span className={`${styles.badge} ${styles.saleBadge}`}>
              {format(t.save, { discount })}
            </span>
          )
        )}
      </div>

      <div className={styles.price}>
        {discount && (
          <s className={styles.compareAt}>
            <span className="visually-hidden">{t.originalPrice}</span>
            {formatMoney(compareAtPrice)}
          </s>
        )}
        <span className={discount ? styles.salePrice : styles.currentPrice}>
          <span className="visually-hidden">{t.currentPrice}</span>
          {formatMoney(price)}
        </span>
      </div>

      <h3 className={styles.title}>
        <Link href={href}>{product.title}</Link>
      </h3>
      <p className={styles.vendor}>{product.vendor}</p>
      <p className={product.availableForSale ? styles.inStock : styles.soldOut}>
        {product.availableForSale ? common.inStock : common.soldOut}
      </p>
      {product.availableForSale && (
        <div className={styles.actions}>
          <ProductCardActions product={product} />
        </div>
      )}
    </article>
  );
}
