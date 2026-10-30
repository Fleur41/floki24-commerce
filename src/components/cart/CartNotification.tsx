"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { formatMoney } from "@/lib/format";
import { variantLabel } from "@/lib/product";
import type { CartLine } from "@/lib/shopify/types";
import { ButtonLink } from "@/components/ui/Button";
import { CloseIcon } from "@/components/ui/icons";
import { useCart, useCartActions } from "./CartProvider";
import styles from "./CartNotification.module.css";

/** "Zu Ihrem Warenkorb hinzugefügt" dialog, opened after every add to cart. */
export function CartNotification() {
  const { addedLine, dismissAddedLine } = useCartActions();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (addedLine) dialogRef.current?.showModal();
  }, [addedLine]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="cart-notification-title"
      onClose={dismissAddedLine}
      onClick={(event) => event.target === event.currentTarget && dialogRef.current?.close()}
    >
      {addedLine && (
        <NotificationContent line={addedLine} onClose={() => dialogRef.current?.close()} />
      )}
    </dialog>
  );
}

type NotificationContentProps = {
  line: CartLine;
  onClose: () => void;
};

function NotificationContent({ line, onClose }: NotificationContentProps) {
  const cart = useCart();
  const { merchandise } = line;
  const variantTitle = variantLabel(merchandise.title);

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <h2 id="cart-notification-title" className={styles.title}>
          Zu Ihrem Warenkorb hinzugefügt:
        </h2>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Schliessen">
          <CloseIcon />
        </button>
      </div>

      <div className={styles.line}>
        {merchandise.image && (
          <Image
            src={merchandise.image.url}
            alt={merchandise.image.altText ?? merchandise.product.title}
            width={96}
            height={96}
            className={styles.image}
          />
        )}
        <div>
          <p className={styles.productTitle}>{merchandise.product.title}</p>
          {variantTitle && <p className={styles.meta}>{variantTitle}</p>}
          <p className={styles.meta}>
            {line.quantity} × {formatMoney(merchandise.price)}
          </p>
        </div>
      </div>

      {cart && (
        <>
          <p className={styles.subtotal}>
            Zwischensumme des Warenkorbs: <strong>{formatMoney(cart.cost.subtotalAmount)}</strong>
          </p>
          <div className={styles.actions}>
            <ButtonLink href="/cart" variant="secondary" onClick={onClose}>
              Warenkorb anzeigen ({cart.totalQuantity})
            </ButtonLink>
            <ButtonLink href={cart.checkoutUrl}>Kasse</ButtonLink>
          </div>
        </>
      )}
    </div>
  );
}
