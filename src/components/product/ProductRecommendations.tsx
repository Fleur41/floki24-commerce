import { getDictionary } from "@/i18n/server";
import { getProductRecommendations } from "@/lib/shopify/products";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "./ProductCard";
import { ProductSlider } from "./ProductSlider";
import styles from "./ProductRecommendations.module.css";

type ProductRecommendationsProps = {
  productId: string;
};

export async function ProductRecommendations({ productId }: ProductRecommendationsProps) {
  const [products, { product: t }] = await Promise.all([
    getProductRecommendations(productId),
    getDictionary(),
  ]);
  if (!products.length) return null;
  const title = t.recommendations;

  return (
    <section className={styles.section} aria-label={title}>
      <SectionHeading>{title}</SectionHeading>
      <ProductSlider label={title}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductSlider>
    </section>
  );
}
