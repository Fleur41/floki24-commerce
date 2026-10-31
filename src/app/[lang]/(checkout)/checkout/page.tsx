import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getDictionary } from "@/i18n/server";
import { getSessionCart } from "@/lib/cart-session";
import { getSessionCustomer } from "@/lib/customer-session";
import { usesDemoCheckout } from "@/lib/shopify/client";
import { getPolicies } from "@/lib/shopify/content";
import { site } from "@/content/site";
import { Checkout } from "@/components/checkout/Checkout";
import { ButtonLink } from "@/components/ui/Button";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { checkout } = await getDictionary();
  return { title: checkout.title, robots: { index: false } };
}

export default async function CheckoutPage() {
  const { checkout } = await getDictionary();
  return (
    <Suspense fallback={<p className={styles.message}>{checkout.loading}</p>}>
      <CheckoutContent />
    </Suspense>
  );
}

async function CheckoutContent() {
  const [cart, customer, policies, { common, checkout }] = await Promise.all([
    getSessionCart(),
    getSessionCustomer(),
    getPolicies(),
    getDictionary(),
  ]);

  if (!cart?.lines.length) {
    return (
      <div className={styles.message}>
        <p>{checkout.empty}</p>
        <ButtonLink href="/">{common.continueShopping}</ButtonLink>
      </div>
    );
  }
  // With a real store, Shopify's hosted checkout takes the payment.
  if (!usesDemoCheckout) redirect(cart.checkoutUrl);

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
