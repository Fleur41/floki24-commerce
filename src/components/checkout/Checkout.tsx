"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { formatMoney } from "@/lib/format";
import type { Cart, ShopPolicy } from "@/lib/shopify/types";
import { BagIcon, ChevronDownIcon } from "@/components/ui/icons";
import { CheckoutForm, isAddressComplete } from "./CheckoutForm";
import { CheckoutSummary } from "./CheckoutSummary";
import { TermsDialog } from "./TermsDialog";
import styles from "./Checkout.module.css";

type CheckoutProps = {
  cart: Cart;
  shopName: string;
  policies: ShopPolicy[];
  defaults: Record<string, string>;
  isLoggedIn: boolean;
};

/** Two-column checkout modelled on Shopify's: form on the left, order summary on the right. */
export function Checkout({
  cart: initialCart,
  shopName,
  policies,
  defaults,
  isLoggedIn,
}: CheckoutProps) {
  const [cart, setCart] = useState(initialCart);
  const [addressComplete, setAddressComplete] = useState(isAddressComplete(defaults));
  const [summaryOpen, setSummaryOpen] = useState(false);
  const termsRef = useRef<HTMLDialogElement>(null);

  return (
    <div className={styles.page}>
      <aside className={styles.aside} aria-label="Bestellübersicht">
        <div className={styles.asideInner}>
          <header className={styles.brand}>
            <Link href="/" className={styles.shopName}>
              {shopName}
            </Link>
            <Link href="/cart" className={styles.bag} aria-label="Zurück zum Warenkorb">
              <BagIcon />
            </Link>
          </header>
          <button
            type="button"
            className={styles.summaryToggle}
            aria-expanded={summaryOpen}
            aria-controls="checkout-summary"
            onClick={() => setSummaryOpen((open) => !open)}
          >
            <span>
              {summaryOpen ? "Bestellübersicht ausblenden" : "Bestellübersicht anzeigen"}
              <ChevronDownIcon className={styles.toggleChevron} />
            </span>
            <strong>{formatMoney(cart.cost.totalAmount)}</strong>
          </button>
          <div
            id="checkout-summary"
            className={`${styles.summaryBody} ${summaryOpen ? styles.summaryOpen : ""}`}
          >
            <CheckoutSummary cart={cart} addressComplete={addressComplete} onCartChange={setCart} />
          </div>
        </div>
      </aside>

      <main className={styles.main} id="main-content">
        <div className={styles.mainInner}>
          <p className={styles.demoNotice}>
            Demo-Shop: Bestellungen werden gespeichert, es wird aber keine Zahlung ausgelöst und
            nichts versendet.
          </p>
          <CheckoutForm
            defaults={defaults}
            isLoggedIn={isLoggedIn}
            addressComplete={addressComplete}
            onAddressCompleteChange={setAddressComplete}
            onShowTerms={() => termsRef.current?.showModal()}
          />
        </div>
      </main>

      <TermsDialog ref={termsRef} policies={policies} />
    </div>
  );
}
