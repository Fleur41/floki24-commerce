"use client";

import { useState, useTransition } from "react";
import type { ProductSummary } from "@/lib/shopify/types";
import { useCartActions } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { QuickView } from "./QuickView";
import styles from "./ProductCardActions.module.css";

type ProductCardActionsProps = {
  product: ProductSummary;
};

/** "Schnellkauf" and, for products without options, a direct add-to-cart button. */
export function ProductCardActions({ product }: ProductCardActionsProps) {
  const { addItem } = useCartActions();
  const [isQuickViewOpen, setQuickViewOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { singleVariantId } = product;

  return (
    <div className={styles.actions}>
      <Button variant="secondary" fullWidth onClick={() => setQuickViewOpen(true)}>
        Schnellkauf
      </Button>
      {singleVariantId && (
        <Button
          fullWidth
          disabled={isPending}
          aria-busy={isPending}
          onClick={() => startTransition(async () => void (await addItem(singleVariantId, 1)))}
        >
          Zum Warenkorb hinzufügen
        </Button>
      )}
      {isQuickViewOpen && (
        <QuickView handle={product.handle} onClose={() => setQuickViewOpen(false)} />
      )}
    </div>
  );
}
