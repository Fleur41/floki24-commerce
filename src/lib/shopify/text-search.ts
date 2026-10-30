/**
 * Lightweight product matching for the demo catalog, whose own search ignores
 * the vendor and returns many unrelated products. Every search word has to
 * match a field (title, vendor, product type or tag); prefixes and small typos
 * count too, so "Heavenly nest" still finds "Havenly Nest".
 */

export type SearchableProduct = {
  title: string;
  vendor: string;
  productType: string;
  tags: string[];
};

/** Fields in order of importance: a title hit outranks a tag hit. */
const FIELD_WEIGHTS = { title: 4, vendor: 3, productType: 2, tags: 1 } as const;

const EXACT = 3;
const PREFIX = 2;
const FUZZY = 1;
/** Added when the whole query appears in the title, e.g. "wood bed". */
const PHRASE_BONUS = 10;

export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function words(text: string): string[] {
  const normalized = normalize(text);
  return normalized ? normalized.split(" ") : [];
}

/** Levenshtein distance, giving up once it exceeds `max`. */
export function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
      rowMin = Math.min(rowMin, current[j]);
    }
    if (rowMin > max) return max + 1;
    previous = current;
  }
  return previous[b.length];
}

function allowedTypos(term: string): number {
  if (term.length >= 8) return 2;
  return term.length >= 4 ? 1 : 0;
}

function matchWord(term: string, word: string): number {
  if (word === term) return EXACT;
  if (word.startsWith(term)) return PREFIX;
  const typos = allowedTypos(term);
  return typos > 0 && editDistance(term, word, typos) <= typos ? FUZZY : 0;
}

/** Relevance of a product for the search, or `null` when it doesn't match. */
export function scoreProduct(query: string, product: SearchableProduct): number | null {
  const terms = words(query);
  if (terms.length === 0) return null;

  const fields = [
    { weight: FIELD_WEIGHTS.title, words: words(product.title) },
    { weight: FIELD_WEIGHTS.vendor, words: words(product.vendor) },
    { weight: FIELD_WEIGHTS.productType, words: words(product.productType) },
    { weight: FIELD_WEIGHTS.tags, words: product.tags.flatMap(words) },
  ];

  let score = 0;
  for (const term of terms) {
    let best = 0;
    for (const field of fields) {
      for (const word of field.words) best = Math.max(best, field.weight * matchWord(term, word));
    }
    if (best === 0) return null;
    score += best;
  }

  if (terms.length > 1 && normalize(product.title).includes(terms.join(" "))) {
    score += PHRASE_BONUS;
  }
  return score;
}
