import type {
  Article,
  Cart,
  CartLine,
  Image,
  Product,
  ProductOption,
  ProductSummary,
  ProductVariant,
  Seo,
} from "./types";

/** Raw Storefront API shapes that differ from the domain types. */

type Connection<T> = { nodes: T[] };

export type RawProductSummary = Omit<ProductSummary, "singleVariantId"> & {
  quickAddVariants: Connection<{ id: string }>;
};

export type RawProduct = RawProductSummary &
  Omit<Product, keyof ProductSummary | "options" | "images" | "variants"> & {
    options: { name: string; optionValues: { name: string }[] }[];
    images: Connection<Image>;
    variants: Connection<ProductVariant>;
  };

export type RawCart = Omit<Cart, "lines"> & {
  lines: Connection<CartLine>;
};

export type RawArticle = Omit<Article, "authorName" | "blogHandle"> & {
  authorV2: { name: string } | null;
  blog: { handle: string };
  seo: Seo;
};

function singleVariantId({ nodes }: RawProductSummary["quickAddVariants"]): string | null {
  return nodes.length === 1 ? nodes[0].id : null;
}

export function reshapeProductSummary({
  quickAddVariants,
  ...product
}: RawProductSummary): ProductSummary {
  return { ...product, singleVariantId: singleVariantId(quickAddVariants) };
}

export function reshapeProduct({
  quickAddVariants,
  options,
  images,
  variants,
  ...product
}: RawProduct): Product {
  const productOptions: ProductOption[] = options.map((option) => ({
    name: option.name,
    values: option.optionValues.map((value) => value.name),
  }));

  return {
    ...product,
    singleVariantId: singleVariantId(quickAddVariants),
    options: productOptions,
    images: images.nodes,
    variants: variants.nodes,
  };
}

export function reshapeCart(cart: RawCart): Cart {
  return { ...cart, lines: cart.lines.nodes };
}

export function reshapeArticle({ authorV2, blog, ...article }: RawArticle): Article {
  return { ...article, authorName: authorV2?.name ?? null, blogHandle: blog.handle };
}
