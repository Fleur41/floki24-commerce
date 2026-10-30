"use client";

import { useState, useTransition } from "react";
import type { ProductVariant } from "@/lib/shopify/types";
import { useDictionary } from "@/i18n/client";
import { useCartActions } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import styles from "./AddToCartForm.module.css";

type AddToCartFormProps = {
  variant: ProductVariant;
  /** Called after the variant was added, e.g. to close a quick-view dialog. */
  onAdded?: () => void;
};

export function AddToCartForm({ variant, onAdded }: AddToCartFormProps) {
  const { addItem } = useCartActions();
  const { common } = useDictionary();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const addToCart = () =>
    startTransition(async () => {
      setError(null);
      const result = await addItem(variant.id, quantity);
      if (result.ok) onAdded?.();
      else setError(result.error);
    });

  const isSoldOut = !variant.availableForSale;

  return (
    <div className={styles.form}>
      <div className={styles.row}>
        <QuantitySelector
          label={common.quantity}
          value={quantity}
          onChange={setQuantity}
          disabled={isSoldOut}
        />
        <Button
          size="large"
          className={styles.submit}
          onClick={addToCart}
          disabled={isSoldOut || isPending}
          aria-busy={isPending}
        >
          {isSoldOut ? common.soldOut : isPending ? common.adding : common.addToCart}
        </Button>
      </div>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
