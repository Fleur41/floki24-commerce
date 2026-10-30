"use client";

import { useState } from "react";
import { findVariant } from "@/lib/product";
import type { Product, ProductVariant, SelectedOption } from "@/lib/shopify/types";

/**
 * Selected variant of a product. Changing one option keeps the others and
 * resolves the matching variant; combinations that don't exist are ignored.
 */
export function useVariantSelection(product: Product, initialVariant: ProductVariant) {
  const [variant, setVariant] = useState(initialVariant);

  const selectOption = (option: SelectedOption): ProductVariant | undefined => {
    const selectedOptions = variant.selectedOptions.map((current) =>
      current.name === option.name ? option : current,
    );
    const nextVariant = findVariant(product, selectedOptions);
    if (nextVariant) setVariant(nextVariant);
    return nextVariant;
  };

  return { variant, selectOption };
}
