import { cacheLife, cacheTag } from "next/cache";
import { cacheTags } from "./cache";
import { storefront } from "./client";
import { ARTICLE_FRAGMENT, SEO_FRAGMENT, gql } from "./fragments";
import { reshapeArticle, type RawArticle } from "./reshape";
import type { Article, Blog, Page, Shop, ShopPolicy } from "./types";

const SHOP_QUERY = /* GraphQL */ `
  query Shop {
    shop {
      name
      primaryDomain {
        url
      }
    }
  }
`;

const BLOG_QUERY = gql(
  /* GraphQL */ `
    query Blog($handle: String!, $first: Int!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
      blog(handle: $handle) {
        handle
        title
        articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
          nodes {
            ...Article
          }
        }
      }
    }
  `,
  ARTICLE_FRAGMENT,
);

const ARTICLE_QUERY = gql(
  /* GraphQL */ `
    query Article(
      $blogHandle: String!
      $articleHandle: String!
      $country: CountryCode
      $language: LanguageCode
    ) @inContext(country: $country, language: $language) {
      blog(handle: $blogHandle) {
        articleByHandle(handle: $articleHandle) {
          ...Article
        }
      }
    }
  `,
  ARTICLE_FRAGMENT,
);

const PAGE_QUERY = gql(
  /* GraphQL */ `
    query Page($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
      page(handle: $handle) {
        handle
        title
        body
        seo {
          ...Seo
        }
      }
    }
  `,
  SEO_FRAGMENT,
);

const POLICIES_QUERY = /* GraphQL */ `
  query Policies($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy {
        ...Policy
      }
      refundPolicy {
        ...Policy
      }
      shippingPolicy {
        ...Policy
      }
      termsOfService {
        ...Policy
      }
    }
  }

  fragment Policy on ShopPolicy {
    handle
    title
    body
  }
`;

export async function getShop(): Promise<Shop> {
  "use cache";
  cacheLife("days");
  cacheTag(cacheTags.content);

  const data = await storefront<{ shop: { name: string; primaryDomain: { url: string } } }>(
    SHOP_QUERY,
  );
  return { name: data.shop.name, primaryDomainUrl: data.shop.primaryDomain.url };
}

export async function getBlog(handle: string, first = 12): Promise<Blog | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(cacheTags.content);

  const data = await storefront<{
    blog: { handle: string; title: string; articles: { nodes: RawArticle[] } } | null;
  }>(BLOG_QUERY, { handle, first });

  if (!data.blog) return null;
  return { ...data.blog, articles: data.blog.articles.nodes.map(reshapeArticle) };
}

export async function getArticle(
  blogHandle: string,
  articleHandle: string,
): Promise<Article | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(cacheTags.content);

  const data = await storefront<{ blog: { articleByHandle: RawArticle | null } | null }>(
    ARTICLE_QUERY,
    { blogHandle, articleHandle },
  );
  const article = data.blog?.articleByHandle;
  return article ? reshapeArticle(article) : null;
}

export async function getPage(handle: string): Promise<Page | null> {
  "use cache";
  cacheLife("days");
  cacheTag(cacheTags.content);

  const data = await storefront<{ page: Page | null }>(PAGE_QUERY, { handle });
  return data.page;
}

export async function getPolicy(handle: string): Promise<ShopPolicy | null> {
  "use cache";
  cacheLife("days");
  cacheTag(cacheTags.content);

  const data = await storefront<{ shop: Record<string, ShopPolicy | null> }>(POLICIES_QUERY);
  return Object.values(data.shop).find((policy) => policy?.handle === handle) ?? null;
}
