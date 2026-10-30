import { redirect } from "next/navigation";
import { clearCustomerSession } from "@/lib/customer-session";

/**
 * Reached when the session cookie holds a token Shopify no longer accepts.
 * Pages can't delete cookies while rendering, so they send the visitor here;
 * without the cookie, the proxy stops bouncing them between login and /account.
 */
export async function GET() {
  await clearCustomerSession();
  redirect("/account/login");
}
