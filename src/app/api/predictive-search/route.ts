import type { NextRequest } from "next/server";
import { predictiveSearch } from "@/lib/shopify/search";

const MAX_QUERY_LENGTH = 100;

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim().slice(0, MAX_QUERY_LENGTH);
  if (!query) {
    return Response.json({ products: [], queries: [] });
  }

  return Response.json(await predictiveSearch(query));
}
