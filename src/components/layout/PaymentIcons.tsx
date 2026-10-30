import { getDictionary } from "@/i18n/server";
import { paymentMethods } from "@/content/site";
import styles from "./PaymentIcons.module.css";

type PaymentIconsProps = {
  className?: string;
};

export async function PaymentIcons({ className }: PaymentIconsProps) {
  const { common } = await getDictionary();
  return (
    <ul className={`${styles.icons} ${className ?? ""}`} aria-label={common.paymentMethods}>
      {paymentMethods.map(({ id, label }) => (
        <li key={id}>
          {/* Static SVGs: next/image would only add a wrapper around them. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/payment-icons/${id}.svg`} alt={label} width={38} height={24} />
        </li>
      ))}
    </ul>
  );
}
