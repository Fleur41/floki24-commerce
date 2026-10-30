import { NextResponse, type NextRequest } from "next/server";
import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  locales,
} from "@/i18n/config";

/** Must match the cookie name in `lib/customer-session.ts`. */
const CUSTOMER_COOKIE = "customerAccessToken";

const LOCALE_PREFIX = new RegExp(`^/(${locales.join("|")})(/.*)?$`);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /en/… (e.g. a shared link) switches the language and drops the prefix.
  const prefixed = pathname.match(LOCALE_PREFIX);
  if (prefixed) {
    const url = request.nextUrl.clone();
    url.pathname = prefixed[2] ?? "/";
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, prefixed[1], {
      path: "/",
      sameSite: "lax",
      maxAge: LOCALE_COOKIE_MAX_AGE,
    });
    return response;
  }

  const accountRedirect = redirectAccountPages(request);
  if (accountRedirect) return accountRedirect;

  // Serve the page in the visitor's language; the URL itself stays unchanged.
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.rewrite(url);
}

/**
 * Optimistic routing for the account pages, based only on whether a session
 * cookie exists: guests go to the login form, logged-in customers skip it.
 * Redirecting here — before rendering — keeps the client router from caching
 * a redirect for /account. The account page still validates the token itself.
 */
function redirectAccountPages(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.has(CUSTOMER_COOKIE);

  if (pathname === "/account" && !isLoggedIn) {
    return NextResponse.redirect(new URL("/account/login", request.url));
  }
  if ((pathname === "/account/login" || pathname === "/account/register") && isLoggedIn) {
    return NextResponse.redirect(new URL("/account", request.url));
  }
}

export const config = {
  // Everything except API routes, Next.js internals and files with an extension.
  matcher: ["/((?!api/|_next/|.*\\.[\\w]+$).*)"],
};
