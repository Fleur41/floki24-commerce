import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSessionCart } from "@/lib/cart-session";
import { getSessionCustomer } from "@/lib/customer-session";
import { isMockShop } from "@/lib/shopify/client";
import { getPolicies } from "@/lib/shopify/content";
import { site } from "@/content/site";
import { Checkout } from "@/components/checkout/Checkout";
import { ButtonLink } from "@/components/ui/Button";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Kasse",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<p className={styles.message}>Kasse wird geladen …</p>}>
      <CheckoutContent />
    </Suspense>
  );
}

async function CheckoutContent() {
  const [cart, customer, policies] = await Promise.all([
    getSessionCart(),
    getSessionCustomer(),
    getPolicies(),
  ]);

  if (!cart?.lines.length) {
    return (
      <div className={styles.message}>
        <p>Ihr Warenkorb ist leer.</p>
        <ButtonLink href="/">Weiter einkaufen</ButtonLink>
      </div>
    );
  }
  // With a real store, Shopify's hosted checkout takes the payment.
  if (!isMockShop) redirect(cart.checkoutUrl);

  return (
    <Checkout
      cart={cart}
      shopName={site.name}
      policies={policies}
      isLoggedIn={Boolean(customer)}
      defaults={{
        email: customer?.email ?? "",
        firstName: customer?.firstName ?? "",
        lastName: customer?.lastName ?? "",
      }}
    />
  );
}
