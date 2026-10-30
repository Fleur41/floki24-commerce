import { NextResponse, type NextRequest } from "next/server";

/** Must match the cookie name in `lib/customer-session.ts`. */
const CUSTOMER_COOKIE = "customerAccessToken";

/**
 * Optimistic routing for the account pages, based only on whether a session
 * cookie exists: guests go to the login form, logged-in customers skip it.
 * Redirecting here — before rendering — keeps the client router from caching
 * a redirect for /account. The account page still validates the token itself.
 */
export function proxy(request: NextRequest) {
  const isLoggedIn = request.cookies.has(CUSTOMER_COOKIE);
  const isAccountPage = request.nextUrl.pathname === "/account";

  if (isAccountPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/account/login", request.url));
  }
  if (!isAccountPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/account", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/account", "/account/login", "/account/register"],
};
