/**
 * Domain types used by the UI. Storefront API connections (`{ nodes: [] }`)
 * are flattened to plain arrays in `reshape.ts`, so components never deal
 * with GraphQL shapes.
 */

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductOption = {
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
  image: Image | null;
};

/** Lightweight product shape used by grids and sliders. */
export type ProductSummary = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  availableForSale: boolean;
  featuredImage: Image | null;
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  compareAtPriceRange: { maxVariantPrice: Money };
  /** Set when the product has exactly one variant, so it can be added without choosing options. */
  singleVariantId: string | null;
};

export type Product = ProductSummary & {
  description: string;
  descriptionHtml: string;
  productType: string;
  options: ProductOption[];
  variants: ProductVariant[];
  images: Image[];
  seo: Seo;
};

export type Seo = {
  title: string | null;
  description: string | null;
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  image: Image | null;
  seo: Seo;
};

export type FilterValue = {
  id: string;
  label: string;
  count: number;
  /** Serialised `ProductFilter` input, used as-is in the URL. */
  input: string;
};

export type Filter = {
  id: string;
  label: string;
  type: "LIST" | "PRICE_RANGE" | "BOOLEAN";
  values: FilterValue[];
};

export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
};

export type ProductListing = {
  products: ProductSummary[];
  filters: Filter[];
  pageInfo: PageInfo;
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    image: Image | null;
    price: Money;
    product: { handle: string; title: string; vendor: string };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  discountCodes: { code: string; applicable: boolean }[];
  lines: CartLine[];
};

export type Article = {
  id: string;
  handle: string;
  title: string;
  excerpt: string | null;
  contentHtml: string;
  publishedAt: string;
  authorName: string | null;
  image: Image | null;
  blogHandle: string;
  seo: Seo;
};

export type Blog = {
  handle: string;
  title: string;
  articles: Article[];
};

export type Page = {
  handle: string;
  title: string;
  body: string;
  seo: Seo;
};

export type ShopPolicy = {
  handle: string;
  title: string;
  body: string;
};

export type Shop = {
  name: string;
  primaryDomainUrl: string;
};

export type PredictiveSearchResult = {
  products: ProductSummary[];
  queries: string[];
};

export type CustomerOrder = {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string;
  totalPrice: Money;
  statusUrl: string;
};

export type Customer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  acceptsMarketing: boolean;
  orders: CustomerOrder[];
};

export type CustomerAccessToken = {
  accessToken: string;
  expiresAt: string;
};
