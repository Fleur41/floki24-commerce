import type { ContentLink } from "./types";

const FILES_CDN = "https://cdn.shopify.com/s/files/1/0791/6676/7386/files";

/** Absolute URL of a file uploaded to the shop's "Files" section. */
export function shopFile(fileName: string): string {
  return `${FILES_CDN}/${fileName}`;
}

export const site = {
  name: "floki24",
  title: "Saunen | Infrarotkabinen | Massagesessel | Möbel — floki24",
  description:
    "Saunen, Infrarotkabinen, Whirlpools, Massagesessel, Garten- & Loungemöbel und vieles mehr — kostenloser Versand in der Schweiz und Liechtenstein.",
  logo: shopFile("floki_gold_1.png"),
  swissFlag: shopFile("Schweizer_Flagge.png"),
  phone: { display: "071 511 98 64", href: "tel:+41715119864" },
  email: "info@floki24.ch",
  company: {
    name: "Schrader GmbH",
    street: "Hafenstrasse 19",
    city: "CH-8280 Kreuzlingen",
  },
} as const;

export const announcement = "Kostenloser Versand in der Schweiz und Liechtenstein!";

export const footerMenu: ContentLink[] = [
  { title: "Strandkörbe", href: "/collections/strandkorbe" },
  { title: "Whirlpools", href: "/collections/whirlpools" },
  { title: "Wellnessprodukte", href: "/collections/wellnessprodukte" },
  { title: "Saunen- und Infrarotkabinen", href: "/collections/saunen-infrarotkabinen" },
  { title: "Garten- & Loungemöbel", href: "/collections/gartenmobel" },
  { title: "Garten & Gärtnern", href: "/collections/saunen-whirpool" },
  { title: "Haus & Wohnen", href: "/collections/mobel" },
  { title: "Sport & Freizeit", href: "/collections/sport-freizeit" },
  { title: "Camping & Outdoor", href: "/collections/camping" },
  { title: "Duschkabinen & Badewannen", href: "/collections/duschkabinen-badewannen" },
  { title: "Haustierzubehör", href: "/collections/haustierzubehor" },
  { title: "Baby & Kind", href: "/collections/baby-kind" },
  { title: "Ballistol", href: "/collections/ballistol" },
];

export const legalLinks: ContentLink[] = [
  { title: "Allgemeine Geschäftsbedingungen", href: "/policies/terms-of-service" },
  { title: "Datenschutz", href: "/policies/privacy-policy" },
  { title: "Widerrufsrecht", href: "/policies/refund-policy" },
  { title: "Impressum", href: "/pages/impressum" },
  { title: "Versand und Zustellung", href: "/policies/shipping-policy" },
  { title: "FAQ", href: "/pages/faq" },
  { title: "Kontakt", href: "/pages/contact" },
  { title: "Über Uns", href: "/pages/uber-uns" },
];

/** Payment icons in the footer and on product pages (files in /public/payment-icons). */
export const paymentMethods = [
  { id: "american-express", label: "American Express" },
  { id: "apple-pay", label: "Apple Pay" },
  { id: "google-pay", label: "Google Pay" },
  { id: "klarna", label: "Klarna" },
  { id: "master", label: "Mastercard" },
  { id: "paypal", label: "PayPal" },
  { id: "shopify-pay", label: "Shop Pay" },
  { id: "unionpay", label: "Union Pay" },
  { id: "visa", label: "Visa" },
] as const;
