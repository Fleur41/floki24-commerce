"use client";

import Link from "next/link";
import { format } from "@/i18n/config";
import { useDictionary } from "@/i18n/client";
import { CartIcon } from "@/components/ui/icons";
import { useCart } from "./CartProvider";
import styles from "./CartLink.module.css";

function CartLinkView({ count }: { count: number }) {
  const { header } = useDictionary();
  const label =
    count === 0
      ? header.cart
      : count === 1
        ? header.cartWithOne
        : format(header.cartWithCount, { count });

  return (
    <Link href="/cart" className={styles.link} aria-label={label}>
      <CartIcon />
      {count > 0 && (
        <span className={styles.count} aria-hidden>
          {count}
        </span>
      )}
    </Link>
  );
}

export function CartLink() {
  const cart = useCart();
  return <CartLinkView count={cart?.totalQuantity ?? 0} />;
}

/** Rendered while the cart loads, so the header never shifts. */
export function CartLinkFallback() {
  return <CartLinkView count={0} />;
}
