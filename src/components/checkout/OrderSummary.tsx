import Image from "next/image";
import { getDictionary } from "@/i18n/server";
import { formatMoney } from "@/lib/format";
import { variantLabel } from "@/lib/product";
import type { Image as ShopifyImage, Money } from "@/lib/shopify/types";
import styles from "./OrderSummary.module.css";

export type SummaryLine = {
  key: string;
  title: string;
  variantTitle: string;
  quantity: number;
  total: Money;
  image: ShopifyImage | null;
};

type OrderSummaryProps = {
  lines: SummaryLine[];
  subtotal: Money;
  shipping: Money;
  total: Money;
};

/** Read-only list of purchased items with totals, shared by checkout and order confirmation. */
export async function OrderSummary({ lines, subtotal, shipping, total }: OrderSummaryProps) {
  const { cart, checkout: t } = await getDictionary();
  return (
    <div className={styles.summary}>
      <ul className={styles.lines}>
        {lines.map((line) => {
          const variant = variantLabel(line.variantTitle);
          return (
            <li key={line.key} className={styles.line}>
              <div className={styles.image}>
                {line.image && (
                  <Image
                    src={line.image.url}
                    alt=""
                    fill
                    sizes="64px"
                    className={styles.imageInner}
                  />
                )}
                <span className={styles.quantity} aria-label={`${t.quantity}${line.quantity}`}>
                  {line.quantity}
                </span>
              </div>
              <div>
                <p className={styles.title}>{line.title}</p>
                {variant && <p className={styles.meta}>{variant}</p>}
              </div>
              <p className={styles.price}>{formatMoney(line.total)}</p>
            </li>
          );
        })}
      </ul>
      <dl className={styles.totals}>
        <div>
          <dt>{cart.subtotal}</dt>
          <dd>{formatMoney(subtotal)}</dd>
        </div>
        <div>
          <dt>{t.shipping}</dt>
          <dd>{Number(shipping.amount) === 0 ? t.free : formatMoney(shipping)}</dd>
        </div>
        <div className={styles.grandTotal}>
          <dt>{t.totalInclVat}</dt>
          <dd>{formatMoney(total)}</dd>
        </div>
      </dl>
    </div>
  );
}
