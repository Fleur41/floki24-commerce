import { paymentMethods } from "@/content/site";
import styles from "./PaymentIcons.module.css";

type PaymentIconsProps = {
  className?: string;
};

export function PaymentIcons({ className }: PaymentIconsProps) {
  return (
    <ul className={`${styles.icons} ${className ?? ""}`} aria-label="Zahlungsmethoden">
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
