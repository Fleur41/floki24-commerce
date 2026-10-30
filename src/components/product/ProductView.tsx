"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { hasSelectableOptions, resolveInitialVariant } from "@/lib/product";
import type { Product, ProductVariant, SelectedOption } from "@/lib/shopify/types";
import { AddToCartForm } from "./AddToCartForm";
import { ProductGallery } from "./ProductGallery";
import { ProductPrice } from "./ProductPrice";
import { useVariantSelection } from "./useVariantSelection";
import { VariantSelector } from "./VariantSelector";
import styles from "./ProductView.module.css";

type ProductViewProps = {
  product: Product;
  /** Server-rendered content below the buy box (payment icons, description, …). */
  children: ReactNode;
};

/** Gallery and buy box. Owns the selected variant, which drives price, image and cart. */
export function ProductView({ product, children }: ProductViewProps) {
  const searchParams = useSearchParams();
  const { variant, selectOption: selectVariantOption } = useVariantSelection(
    product,
    resolveInitialVariant(product, searchParams.get("variant")),
  );
  const [imageIndex, setImageIndex] = useState(() => imageIndexOf(product, variant));

  const selectOption = (option: SelectedOption) => {
    const nextVariant = selectVariantOption(option);
    if (!nextVariant) return;

    if (nextVariant.image) setImageIndex(imageIndexOf(product, nextVariant));

    // Keep Shopify's `?variant=` convention so the selection can be shared.
    const variantId = nextVariant.id.split("/").at(-1);
    window.history.replaceState(null, "", `?variant=${variantId}`);
  };

  return (
    <div className={styles.layout}>
      <ProductGallery
        images={product.images}
        activeIndex={imageIndex}
        onSelect={setImageIndex}
        productTitle={product.title}
      />

      <div className={styles.details}>
        <h1 className={styles.title}>{product.title}</h1>
        {product.vendor && (
          <p className={styles.vendor}>
            von{" "}
            <Link href={`/search?q=${encodeURIComponent(product.vendor)}`}>{product.vendor}</Link>
          </p>
        )}

        <ProductPrice variant={variant} />

        {hasSelectableOptions(product) && (
          <VariantSelector product={product} selectedVariant={variant} onSelect={selectOption} />
        )}

        <AddToCartForm variant={variant} />

        {children}
      </div>
    </div>
  );
}

function imageIndexOf(product: Product, variant: ProductVariant): number {
  const index = product.images.findIndex((image) => image.url === variant.image?.url);
  return Math.max(index, 0);
}
