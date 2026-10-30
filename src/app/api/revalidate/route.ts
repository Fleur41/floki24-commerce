import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { cacheTags } from "@/lib/shopify/cache";

/**
 * Shopify webhook endpoint. Subscribe it to product, collection and
 * inventory topics in the Shopify admin; each delivery expires the matching
 * cached Storefront data.
 */

const tagsByTopicPrefix: Record<string, string[]> = {
  products: [cacheTags.products, cacheTags.collections],
  inventory_levels: [cacheTags.products, cacheTags.collections],
  collections: [cacheTags.collections],
};

function hasValidSignature(body: string, signature: string | null): boolean {
  const secret = process.env.SHOPIFY_REVALIDATION_SECRET;
  if (!secret || !signature) return false;

  const expected = createHmac("sha256", secret).update(body, "utf8").digest();
  const received = Buffer.from(signature, "base64");
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export async function POST(request: Request) {
  const body = await request.text();
  if (!hasValidSignature(body, request.headers.get("x-shopify-hmac-sha256"))) {
    return new Response("Invalid signature", { status: 401 });
  }

  // Topics look like "products/update" or "collections/delete".
  const topicPrefix = request.headers.get("x-shopify-topic")?.split("/")[0] ?? "";
  const tags = tagsByTopicPrefix[topicPrefix] ?? [];
  tags.forEach((tag) => revalidateTag(tag, "max"));

  return Response.json({ revalidated: tags });
}
