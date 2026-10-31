import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { locales, type Locale } from "@/i18n/config";
import { cacheTags } from "./cache";
import { storefront } from "./client";

type Resource = "product" | "collection";

const FIND_QUERIES: Record<Resource, string> = {
  product: /* GraphQL */ `
    query FindProduct($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
      resource: product(handle: $handle) {
        id
      }
    }
  `,
  collection: /* GraphQL */ `
    query FindCollection($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
      resource: collection(handle: $handle) {
        id
      }
    }
  `,
};

const HANDLE_QUERY = /* GraphQL */ `
  query Handle($id: ID!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    node(id: $id) {
      ... on Product {
        handle
      }
      ... on Collection {
        handle
      }
    }
  }
`;

/**
 * Shopify translates handles, and a translated handle only resolves in its own
 * language, while our URLs stay the same in every language. So after a
 * language switch, `/products/sauna-interieur-…` (French) isn't found in
 * German. This finds the resource by its handle in the other languages and
 * returns its handle in the current one, or `null` if it doesn't exist.
 *
 * `locale` is only needed outside pages (Route Handlers).
 */
export async function findTranslatedHandle(
  resource: Resource,
  handle: string,
  locale?: Locale,
): Promise<string | null> {
  "use cache";
  cacheLife("days");
  cacheTag(resource === "product" ? cacheTags.products : cacheTags.collections);

  for (const other of locales) {
    const found = await storefront<{ resource: { id: string } | null }>(
      FIND_QUERIES[resource],
      { handle },
      { locale: other },
    );
    if (!found.resource) continue;

    const current = await storefront<{ node: { handle: string } | null }>(
      HANDLE_QUERY,
      { id: found.resource.id },
      { locale },
    );
    return current.node?.handle ?? null;
  }
  return null;
}

/**
 * Runs `load` with the handle from the URL and, if nothing is found, once more
 * with the resource's handle in the current language (see `findTranslatedHandle`).
 */
export async function withTranslatedHandle<T>(
  resource: Resource,
  handle: string,
  load: (handle: string) => Promise<T | null>,
  locale?: Locale,
): Promise<T | null> {
  const result = await load(handle);
  if (result !== null) return result;
  const translated = await findTranslatedHandle(resource, handle, locale);
  return translated && translated !== handle ? load(translated) : null;
}
