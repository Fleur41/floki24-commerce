import { findVariant } from "@/lib/product";
import type { Product, ProductVariant, SelectedOption } from "@/lib/shopify/types";
import { ChevronDownIcon } from "@/components/ui/icons";
import styles from "./VariantSelector.module.css";

type VariantSelectorProps = {
  product: Product;
  selectedVariant: ProductVariant;
  onSelect: (option: SelectedOption) => void;
};

/** One dropdown per product option, like the theme's "select" variant style. */
export function VariantSelector({ product, selectedVariant, onSelect }: VariantSelectorProps) {
  return (
    <div className={styles.options}>
      {product.options.map((option) => {
        const id = `option-${option.name}`;
        const selectedValue = selectedVariant.selectedOptions.find(
          (selected) => selected.name === option.name,
        )?.value;

        return (
          <div key={option.name} className={styles.option}>
            <label htmlFor={id} className={styles.label}>
              {option.name}
            </label>
            <div className={styles.selectWrapper}>
              <select
                id={id}
                className={styles.select}
                value={selectedValue}
                onChange={(event) => onSelect({ name: option.name, value: event.target.value })}
              >
                {option.values.map((value) => (
                  <option key={value} value={value}>
                    {value}
                    {isSoldOut(product, selectedVariant, { name: option.name, value }) &&
                      " – Ausverkauft"}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className={styles.icon} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Whether choosing `option` (keeping the other current choices) leads to a sold-out variant. */
function isSoldOut(product: Product, current: ProductVariant, option: SelectedOption): boolean {
  const selectedOptions = current.selectedOptions.map((selected) =>
    selected.name === option.name ? option : selected,
  );
  return !findVariant(product, selectedOptions)?.availableForSale;
}
