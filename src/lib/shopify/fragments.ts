/**
 * Shared GraphQL fragments.
 *
 * A fragment declares the fragments it spreads, and `gql()` collects the
 * whole dependency tree once. That way an operation never ships a fragment
 * definition twice, which the Storefront API would reject.
 */

type Fragment = {
  source: string;
  dependencies: Fragment[];
};

function fragment(source: string, ...dependencies: Fragment[]): Fragment {
  return { source, dependencies };
}

export function gql(operation: string, ...fragments: Fragment[]): string {
  const sources = new Set<string>();
  const collect = (item: Fragment) => {
    item.dependencies.forEach(collect);
    sources.add(item.source);
  };
  fragments.forEach(collect);

  return [operation, ...sources].join("\n");
}

export const IMAGE_FRAGMENT = fragment(/* GraphQL */ `
  fragment Image on Image {
    url
    altText
    width
    height
  }
`);

export const MONEY_FRAGMENT = fragment(/* GraphQL */ `
  fragment Money on MoneyV2 {
    amount
    currencyCode
  }
`);

export const SEO_FRAGMENT = fragment(/* GraphQL */ `
  fragment Seo on SEO {
    title
    description
  }
`);

export const PAGE_INFO_FRAGMENT = fragment(/* GraphQL */ `
  fragment PageInfo on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`);

export const FILTER_FRAGMENT = fragment(/* GraphQL */ `
  fragment Filter on Filter {
    id
    label
    type
    values {
      id
      label
      count
      input
    }
  }
`);

export const PRODUCT_SUMMARY_FRAGMENT = fragment(
  /* GraphQL */ `
    fragment ProductSummary on Product {
      id
      handle
      title
      vendor
      availableForSale
      featuredImage {
        ...Image
      }
      priceRange {
        minVariantPrice {
          ...Money
        }
        maxVariantPrice {
          ...Money
        }
      }
      compareAtPriceRange {
        maxVariantPrice {
          ...Money
        }
      }
      # Two are enough to tell whether the product has options (see reshapeProductSummary).
      # Aliased so it never conflicts with the full variant list of the Product fragment.
      quickAddVariants: variants(first: 2) {
        nodes {
          id
        }
      }
    }
  `,
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
);

export const PRODUCT_FRAGMENT = fragment(
  /* GraphQL */ `
    fragment Product on Product {
      ...ProductSummary
      description
      descriptionHtml
      productType
      options {
        name
        optionValues {
          name
        }
      }
      images(first: 20) {
        nodes {
          ...Image
        }
      }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            ...Money
          }
          compareAtPrice {
            ...Money
          }
          image {
            ...Image
          }
        }
      }
      seo {
        ...Seo
      }
    }
  `,
  PRODUCT_SUMMARY_FRAGMENT,
  SEO_FRAGMENT,
);

export const CART_FRAGMENT = fragment(
  /* GraphQL */ `
    fragment Cart on Cart {
      id
      checkoutUrl
      totalQuantity
      cost {
        subtotalAmount {
          ...Money
        }
      }
      lines(first: 100) {
        nodes {
          id
          quantity
          cost {
            totalAmount {
              ...Money
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              image {
                ...Image
              }
              price {
                ...Money
              }
              product {
                handle
                title
                vendor
              }
            }
          }
        }
      }
    }
  `,
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
);

export const ARTICLE_FRAGMENT = fragment(
  /* GraphQL */ `
    fragment Article on Article {
      id
      handle
      title
      excerpt
      contentHtml
      publishedAt
      authorV2 {
        name
      }
      image {
        ...Image
      }
      blog {
        handle
      }
      seo {
        ...Seo
      }
    }
  `,
  IMAGE_FRAGMENT,
  SEO_FRAGMENT,
);
