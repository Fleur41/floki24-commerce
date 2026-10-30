import type { ReactNode } from "react";

/** Checkout runs without the storefront header and footer, like Shopify's hosted checkout. */
export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return children;
}
