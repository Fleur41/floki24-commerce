"use client";

import Image from "next/image";
import { useState, useTransition, type FormEvent } from "react";
import { formatMoney } from "@/lib/format";
import { variantLabel } from "@/lib/product";
import type { Cart } from "@/lib/shopify/types";
import { CloseIcon, HelpIcon } from "@/components/ui/icons";
import { applyDiscountCode, removeDiscountCode } from "./actions";
import { Field } from "./fields";
import { includedVat } from "./options";
import styles from "./Checkout.module.css";

type CheckoutSummaryProps = {
  cart: Cart;
  addressComplete: boolean;
  onCartChange: (cart: Cart) => void;
};

/** Right-hand column: items, discount code and totals. */
export function CheckoutSummary({ cart, addressComplete, onCartChange }: CheckoutSummaryProps) {
  const [discountError, setDiscountError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const subtotal = cart.cost.subtotalAmount;
  const total = cart.cost.totalAmount;
  const discount = Number(subtotal.amount) - Number(total.amount);
  const appliedCodes = cart.discountCodes.filter((code) => code.applicable);

  const submitDiscount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const code = String(new FormData(form).get("discountCode") ?? "");
    startTransition(async () => {
      const result = await applyDiscountCode(code);
      if (result.ok) {
        setDiscountError(undefined);
        onCartChange(result.cart);
        form.reset();
      } else {
        setDiscountError(result.error);
      }
    });
  };

  const removeCode = (code: string) =>
    startTransition(async () => {
      const result = await removeDiscountCode(code);
      if (result.ok) onCartChange(result.cart);
    });

  return (
    <div className={styles.summary}>
      <ul className={styles.lines}>
        {cart.lines.map((line) => {
          const variant = variantLabel(line.merchandise.title);
          return (
            <li key={line.id} className={styles.line}>
              <div className={styles.thumb}>
                {line.merchandise.image && (
                  <Image
                    src={line.merchandise.image.url}
                    alt=""
                    fill
                    sizes="64px"
                    className={styles.thumbImage}
                  />
                )}
                <span className={styles.quantity}>
                  <span className="visually-hidden">Menge: </span>
                  {line.quantity}
                </span>
              </div>
              <div className={styles.lineInfo}>
                <p>{line.merchandise.product.title}</p>
                {variant && <p className={styles.muted}>{variant}</p>}
              </div>
              <p className={styles.linePrice}>{formatMoney(line.cost.totalAmount)}</p>
            </li>
          );
        })}
      </ul>

      <form className={styles.discount} onSubmit={submitDiscount} noValidate>
        <Field
          name="discountCode"
          label="Rabattcode"
          autoComplete="off"
          error={discountError}
          onInput={() => setDiscountError(undefined)}
        />
        <button type="submit" className={styles.applyButton} disabled={isPending}>
          Anwenden
        </button>
      </form>
      {appliedCodes.length > 0 && (
        <ul className={styles.codes}>
          {appliedCodes.map(({ code }) => (
            <li key={code} className={styles.code}>
              {code}
              <button
                type="button"
                onClick={() => removeCode(code)}
                aria-label={`Rabattcode ${code} entfernen`}
                disabled={isPending}
              >
                <CloseIcon width={10} height={10} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dl className={styles.totals} aria-busy={isPending}>
        <div>
          <dt>Zwischensumme · {cart.totalQuantity} Artikel</dt>
          <dd>{formatMoney(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div>
            <dt>Rabatt</dt>
            <dd>−{formatMoney({ ...subtotal, amount: String(discount) })}</dd>
          </div>
        )}
        <div>
          <dt className={styles.withIcon}>
            Versand
            <span title="Versandkosten werden anhand der Lieferadresse berechnet.">
              <HelpIcon width={16} height={16} />
            </span>
          </dt>
          <dd className={addressComplete ? undefined : styles.muted}>
            {addressComplete ? "Kostenlos" : "Lieferadresse eingeben"}
          </dd>
        </div>
        <div className={styles.grandTotal}>
          <dt>Gesamt</dt>
          <dd>{formatMoney(total)}</dd>
        </div>
      </dl>
      <p className={styles.vat}>inkl. {formatMoney(includedVat(total))} MwSt.</p>
    </div>
  );
}
