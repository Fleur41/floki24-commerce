import type { Product, ProductVariant, SelectedOption } from "@/lib/shopify/types";

/** Title Shopify gives the single variant of a product without options. */
const DEFAULT_VARIANT_TITLE = "Default Title";

/** Variant title worth showing to buyers, or `null` for the default variant. */
export function variantLabel(variantTitle: string): string | null {
  return variantTitle === DEFAULT_VARIANT_TITLE ? null : variantTitle;
}

/** Whether the product has real options to choose from. */
export function hasSelectableOptions(product: Product): boolean {
  return !(product.variants.length === 1 && product.variants[0].title === DEFAULT_VARIANT_TITLE);
}

export function findVariant(
  product: Product,
  selectedOptions: SelectedOption[],
): ProductVariant | undefined {
  return product.variants.find((variant) =>
    variant.selectedOptions.every((option) =>
      selectedOptions.some(
        (selected) => selected.name === option.name && selected.value === option.value,
      ),
    ),
  );
}

/** The variant from `?variant=` (Shopify's URL convention) or the first available one. */
export function resolveInitialVariant(product: Product, variantId?: string | null): ProductVariant {
  return (
    product.variants.find((variant) => variant.id.endsWith(`/${variantId}`)) ??
    product.variants.find((variant) => variant.availableForSale) ??
    product.variants[0]
  );
}
