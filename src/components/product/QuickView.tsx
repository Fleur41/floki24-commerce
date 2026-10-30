"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { hasSelectableOptions, resolveInitialVariant } from "@/lib/product";
import type { Product } from "@/lib/shopify/types";
import { CloseIcon } from "@/components/ui/icons";
import { AddToCartForm } from "./AddToCartForm";
import { ProductPrice } from "./ProductPrice";
import { useVariantSelection } from "./useVariantSelection";
import { VariantSelector } from "./VariantSelector";
import styles from "./QuickView.module.css";

type QuickViewProps = {
  handle: string;
  onClose: () => void;
};

type LoadState =
  { status: "loading" } | { status: "error" } | { status: "ready"; product: Product };

/** "Schnellkauf" dialog: choose options and add to cart without leaving the listing. */
export function QuickView({ handle, onClose }: QuickViewProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    dialogRef.current?.showModal();

    const controller = new AbortController();
    fetch(`/api/products/${encodeURIComponent(handle)}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((product: Product) => setState({ status: "ready", product }))
      .catch(() => !controller.signal.aborted && setState({ status: "error" }));

    return () => controller.abort();
  }, [handle]);

  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label="Schnellkauf"
      onClose={onClose}
      onClick={(event) => event.target === event.currentTarget && close()}
    >
      <button type="button" className={styles.close} onClick={close} aria-label="Schliessen">
        <CloseIcon />
      </button>

      {state.status === "loading" && <p className={styles.message}>Wird geladen …</p>}
      {state.status === "error" && (
        <p className={styles.message}>Das Produkt konnte nicht geladen werden.</p>
      )}
      {state.status === "ready" && <QuickViewContent product={state.product} onAdded={close} />}
    </dialog>
  );
}

type QuickViewContentProps = {
  product: Product;
  onAdded: () => void;
};

function QuickViewContent({ product, onAdded }: QuickViewContentProps) {
  const { variant, selectOption } = useVariantSelection(product, resolveInitialVariant(product));
  const image = variant.image ?? product.featuredImage;

  return (
    <div className={styles.content}>
      <div className={styles.media}>
        {image && (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            sizes="(min-width: 720px) 400px, 100vw"
            className={styles.image}
          />
        )}
      </div>

      <div className={styles.details}>
        <h2 className={styles.title}>{product.title}</h2>
        <ProductPrice variant={variant} />
        {hasSelectableOptions(product) && (
          <VariantSelector product={product} selectedVariant={variant} onSelect={selectOption} />
        )}
        <AddToCartForm variant={variant} onAdded={onAdded} />
        <Link href={`/products/${product.handle}`} className={styles.detailsLink}>
          Vollständige Details anzeigen
        </Link>
      </div>
    </div>
  );
}
