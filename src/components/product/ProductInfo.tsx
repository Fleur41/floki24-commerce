import { announcement } from "@/content/site";
import { translateContent } from "@/content/translations";
import { getDictionary, getLocale } from "@/i18n/server";
import { PaymentIcons } from "@/components/layout/PaymentIcons";
import { EnvelopeIcon, PackageIcon } from "@/components/ui/icons";
import styles from "./ProductInfo.module.css";
import { demoteHeadings } from "@/lib/html";

type ProductInfoProps = {
  descriptionHtml: string;
};

/** Trust block (payment methods, shipping, invoice) and the product description. */
export async function ProductInfo({ descriptionHtml }: ProductInfoProps) {
  const [{ product: t }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <>
      <section className={styles.payments} aria-labelledby="payment-methods-title">
        <h2 id="payment-methods-title" className={styles.paymentsTitle}>
          {t.securePayment}
        </h2>
        <PaymentIcons className={styles.paymentIcons} />
      </section>

      <ul className={styles.notices}>
        <li className={styles.notice}>
          <PackageIcon />
          {translateContent(announcement, locale)}
        </li>
        <li className={styles.notice}>
          <EnvelopeIcon />
          {t.invoice}
        </li>
      </ul>

      {descriptionHtml && (
        <div
          className={`rte ${styles.description}`}
          dangerouslySetInnerHTML={{ __html: demoteHeadings(descriptionHtml) }}
        />
      )}
    </>
  );
}
