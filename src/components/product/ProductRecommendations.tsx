import { getProductRecommendations } from "@/lib/shopify/products";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "./ProductCard";
import { ProductSlider } from "./ProductSlider";
import styles from "./ProductRecommendations.module.css";

const TITLE = "Kunden interessierten sich auch für";

type ProductRecommendationsProps = {
  productId: string;
};

export async function ProductRecommendations({ productId }: ProductRecommendationsProps) {
  const products = await getProductRecommendations(productId);
  if (!products.length) return null;

  return (
    <section className={styles.section} aria-label={TITLE}>
      <SectionHeading>{TITLE}</SectionHeading>
      <ProductSlider label={TITLE}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductSlider>
    </section>
  );
}
