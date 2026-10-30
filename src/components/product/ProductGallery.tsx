import Image from "next/image";
import type { Image as ShopifyImage } from "@/lib/shopify/types";
import styles from "./ProductGallery.module.css";

type ProductGalleryProps = {
  images: ShopifyImage[];
  activeIndex: number;
  onSelect: (index: number) => void;
  productTitle: string;
};

export function ProductGallery({
  images,
  activeIndex,
  onSelect,
  productTitle,
}: ProductGalleryProps) {
  const activeImage = images[activeIndex];
  if (!activeImage) return <div className={styles.placeholder} />;

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        <Image
          src={activeImage.url}
          alt={activeImage.altText ?? productTitle}
          fill
          sizes="(min-width: 720px) 50vw, 100vw"
          className={styles.mainImage}
          preload
        />
      </div>

      {images.length > 1 && (
        <ul className={styles.thumbnails} aria-label="Produktbilder">
          {images.map((image, index) => (
            <li key={image.url}>
              <button
                type="button"
                className={styles.thumbnail}
                aria-current={index === activeIndex}
                aria-label={`Bild ${index + 1} anzeigen`}
                onClick={() => onSelect(index)}
              >
                <Image src={image.url} alt="" fill sizes="80px" className={styles.thumbnailImage} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
