import type { Metadata } from "next";
import { Montserrat, Nunito_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { getSessionCart } from "@/lib/cart-session";
import { siteUrl } from "@/lib/site-url";
import { CartNotification } from "@/components/cart/CartNotification";
import { CartProvider } from "@/components/cart/CartProvider";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // Not awaited: the cart streams in, so the page shell stays static.
  const cartPromise = getSessionCart();

  return (
    <html lang="de" className={`${nunitoSans.variable} ${montserrat.variable}`}>
      <body>
        <CartProvider cartPromise={cartPromise}>
          {/* Storefront chrome lives in (shop)/layout; checkout has its own. */}
          {children}
          <CartNotification />
        </CartProvider>
      </body>
    </html>
  );
}
