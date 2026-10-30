import type { Metadata } from "next";
import { Suspense } from "react";
import { getDictionary } from "@/i18n/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { CartContents } from "@/components/cart/CartContents";

export async function generateMetadata(): Promise<Metadata> {
  const { cart } = await getDictionary();
  return { title: cart.title, robots: { index: false } };
}

export default async function CartPage() {
  const { cart } = await getDictionary();
  return (
    <div className="container">
      <PageHeader title={cart.title} />
      <Suspense fallback={<p>{cart.loading}</p>}>
        <CartContents />
      </Suspense>
    </div>
  );
}
