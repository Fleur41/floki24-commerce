import Image from "next/image";
import Link from "next/link";
import type { FeaturedCollection as FeaturedCollectionContent } from "@/content/home";
import { getCollectionPreview } from "@/lib/shopify/collections";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductSlider } from "@/components/product/ProductSlider";
import { ChevronRightIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./FeaturedCollection.module.css";

const PRODUCT_LIMIT = 12;

type FeaturedCollectionProps = {
  section: FeaturedCollectionContent;
};

/** Promo card plus a product slider for one collection ("Angebote", "Neue Artikel"). */
export async function FeaturedCollection({ section }: FeaturedCollectionProps) {
  const products = await getCollectionPreview(section.collectionHandle, PRODUCT_LIMIT);
  if (!products.length) return null;

  const href = `/collections/${section.collectionHandle}`;

  return (
    <section className={`container ${styles.section}`} aria-label={section.title}>
      <SectionHeading>{section.title}</SectionHeading>

      <div className={styles.row}>
        <Link href={href} className={styles.promo}>
          <Image src={section.promo.image} alt="" fill sizes="20vw" className={styles.promoImage} />
          <span className={styles.promoContent}>
            <span className={styles.promoTitle}>{section.promo.title}</span>
            <span className={styles.promoLink}>
              {section.promo.buttonLabel}
              <ChevronRightIcon />
            </span>
          </span>
        </Link>

        <ProductSlider label={section.title}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductSlider>
      </div>
    </section>
  );
}
