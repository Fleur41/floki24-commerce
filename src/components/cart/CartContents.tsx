"use client";

import Image from "next/image";
import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { format } from "@/i18n/config";
import { useDictionary } from "@/i18n/client";
import { formatMoney, multiplyMoney } from "@/lib/format";
import { variantLabel } from "@/lib/product";
import type { Cart, CartLine } from "@/lib/shopify/types";
import { ButtonLink } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { useCart, useCartActions } from "./CartProvider";
import styles from "./CartContents.module.css";

type OptimisticUpdate = { lineId: string; quantity: number };

/** Applies a pending quantity change locally so the UI responds instantly. */
function applyQuantity(cart: Cart, { lineId, quantity }: OptimisticUpdate): Cart {
  const lines = cart.lines
    .map((line) =>
      line.id === lineId
        ? {
            ...line,
            quantity,
            cost: { totalAmount: multiplyMoney(line.merchandise.price, quantity) },
          }
        : line,
    )
    .filter((line) => line.quantity > 0);

  const subtotal = lines.reduce((sum, line) => sum + Number(line.cost.totalAmount.amount), 0);

  return {
    ...cart,
    lines,
    totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
    cost: {
      subtotalAmount: { ...cart.cost.subtotalAmount, amount: String(subtotal) },
      // Discounts are recalculated by Shopify once the update settles.
      totalAmount: { ...cart.cost.totalAmount, amount: String(subtotal) },
    },
  };
}

export function CartContents() {
  const cart = useCart();
  const { common, cart: t } = useDictionary();

  if (!cart?.lines.length) {
    return (
      <div className={styles.empty}>
        <p>{t.empty}</p>
        <ButtonLink href="/">{common.continueShopping}</ButtonLink>
      </div>
    );
  }

  return <CartTable cart={cart} />;
}

function CartTable({ cart }: { cart: Cart }) {
  const { updateQuantity } = useCartActions();
  const { cart: t } = useDictionary();
  const [optimisticCart, setOptimisticQuantity] = useOptimistic(cart, applyQuantity);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const changeQuantity = (lineId: string, quantity: number) =>
    startTransition(async () => {
      setError(null);
      setOptimisticQuantity({ lineId, quantity });
      const result = await updateQuantity(lineId, quantity);
      if (!result.ok) setError(result.error);
    });

  return (
    <div className={styles.layout}>
      <div>
        <ul className={styles.lines}>
          {optimisticCart.lines.map((line) => (
            <CartLineItem key={line.id} line={line} onQuantityChange={changeQuantity} />
          ))}
        </ul>
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
      </div>

      <aside className={styles.summary} aria-label={t.summary} aria-busy={isPending}>
        <p className={styles.subtotal}>
          <span>{t.subtotal}</span>
          <strong>{formatMoney(optimisticCart.cost.subtotalAmount)}</strong>
        </p>
        <p className={styles.note}>{t.taxNote}</p>
        <ButtonLink href={optimisticCart.checkoutUrl} size="large" fullWidth>
          {t.checkout}
        </ButtonLink>
      </aside>
    </div>
  );
}

type CartLineItemProps = {
  line: CartLine;
  onQuantityChange: (lineId: string, quantity: number) => void;
};

function CartLineItem({ line, onQuantityChange }: CartLineItemProps) {
  const { merchandise } = line;
  const { cart: t } = useDictionary();
  const href = `/products/${merchandise.product.handle}`;
  const variantTitle = variantLabel(merchandise.title);

  return (
    <li className={styles.line}>
      <Link href={href} className={styles.image} tabIndex={-1} aria-hidden>
        {merchandise.image && (
          <Image
            src={merchandise.image.url}
            alt=""
            fill
            sizes="120px"
            className={styles.imageInner}
          />
        )}
      </Link>

      <div className={styles.info}>
        <Link href={href} className={styles.title}>
          {merchandise.product.title}
        </Link>
        {variantTitle && <p className={styles.meta}>{variantTitle}</p>}
        <p className={styles.meta}>{formatMoney(merchandise.price)}</p>
      </div>

      <div className={styles.quantity}>
        <QuantitySelector
          label={format(t.quantityFor, { title: merchandise.product.title })}
          hideLabel
          min={0}
          value={line.quantity}
          onChange={(quantity) => onQuantityChange(line.id, quantity)}
        />
        <button
          type="button"
          className={styles.remove}
          onClick={() => onQuantityChange(line.id, 0)}
        >
          {t.remove}
        </button>
      </div>

      <p className={styles.total}>{formatMoney(line.cost.totalAmount)}</p>
    </li>
  );
}
