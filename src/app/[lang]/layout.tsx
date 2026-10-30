import type { Metadata } from "next";
import { Montserrat, Nunito_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { locales } from "@/i18n/config";
import { I18nProvider } from "@/i18n/client";
import { getDictionary, getLocale } from "@/i18n/server";
import { getSessionCart } from "@/lib/cart-session";
import { siteUrl } from "@/lib/site-url";
import { CartNotification } from "@/components/cart/CartNotification";
import { CartProvider } from "@/components/cart/CartProvider";
import "../globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-nunito-sans",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-montserrat",
});

/** Every page is prerendered once per language; `proxy.ts` picks the visitor's. */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return {
    metadataBase: siteUrl,
    title: { default: meta.title, template: `%s — ${site.name}` },
    description: meta.description,
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [locale, dictionary] = await Promise.all([getLocale(), getDictionary()]);
  // Not awaited: the cart streams in, so the page shell stays static.
  const cartPromise = getSessionCart();

  return (
    <html lang={locale} className={`${nunitoSans.variable} ${montserrat.variable}`}>
      <body>
        <I18nProvider locale={locale} dictionary={dictionary}>
          <CartProvider cartPromise={cartPromise}>
            {/* Storefront chrome lives in (shop)/layout; checkout has its own. */}
            {children}
            <CartNotification />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
