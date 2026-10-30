import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CartContents } from "@/components/cart/CartContents";

export const metadata: Metadata = {
  title: "Ihr Warenkorb",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="container">
      <PageHeader title="Ihr Warenkorb" />
      <Suspense fallback={<p>Warenkorb wird geladen …</p>}>
        <CartContents />
      </Suspense>
    </div>
  );
}
