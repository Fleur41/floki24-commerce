import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProduct } from "@/lib/shopify/products";
import type { Product } from "@/lib/shopify/types";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductRecommendations } from "@/components/product/ProductRecommendations";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { ProductView } from "@/components/product/ProductView";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/products/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return {};

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description.slice(0, 160),
    openGraph: product.featuredImage ? { images: [product.featuredImage.url] } : undefined,
  };
}

export default function ProductPage({ params }: PageProps<"/[lang]/products/[handle]">) {
  return (
    <div className="container">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductContent params={params} />
      </Suspense>
    </div>
  );
}

async function ProductContent({ params }: Pick<PageProps<"/[lang]/products/[handle]">, "params">) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output is safe to inline once "<" is escaped.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(product)).replace(/</g, "\\u003c"),
        }}
      />
      <Breadcrumbs items={[{ title: product.title }]} />
      <ProductView product={product}>
        <ProductInfo descriptionHtml={product.descriptionHtml} />
      </ProductView>
      <ProductRecommendations productId={product.id} />
    </>
  );
}

function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((image) => image.url),
    brand: { "@type": "Brand", name: product.vendor },
    offers: product.variants.map((variant) => ({
      "@type": "Offer",
      sku: variant.id,
      price: variant.price.amount,
      priceCurrency: variant.price.currencyCode,
      availability: variant.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    })),
  };
}
