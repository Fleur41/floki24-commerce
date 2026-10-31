import { getRequestLocale } from "@/i18n/server";
import { getProduct } from "@/lib/shopify/products";

/** Full product data for the quick-view dialog on product cards. */
export async function GET(_: Request, { params }: RouteContext<"/api/products/[handle]">) {
  const product = await getProduct((await params).handle, await getRequestLocale());
  if (!product) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json(product);
}
