import { announcement } from "@/content/site";
import { PaymentIcons } from "@/components/layout/PaymentIcons";
import { EnvelopeIcon, PackageIcon } from "@/components/ui/icons";
import styles from "./ProductInfo.module.css";

type ProductInfoProps = {
  descriptionHtml: string;
};

/** Trust block (payment methods, shipping, invoice) and the product description. */
export function ProductInfo({ descriptionHtml }: ProductInfoProps) {
  return (
    <>
      <section className={styles.payments} aria-labelledby="payment-methods-title">
        <h2 id="payment-methods-title" className={styles.paymentsTitle}>
          Sichere Zahlungsmöglichkeiten
        </h2>
        <PaymentIcons className={styles.paymentIcons} />
      </section>

      <ul className={styles.notices}>
        <li className={styles.notice}>
          <PackageIcon />
          {announcement}
        </li>
        <li className={styles.notice}>
          <EnvelopeIcon />
          Kauf auf Rechnung
        </li>
      </ul>

      {descriptionHtml && (
        <div
          className={`rte ${styles.description}`}
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
      )}
    </>
  );
}
