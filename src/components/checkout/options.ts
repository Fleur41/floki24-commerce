import type { Money } from "@/lib/shopify/types";

/** floki24 ships to Switzerland and Liechtenstein only. */
export const SHIPPING_COUNTRIES = [
  { code: "CH", name: "Schweiz" },
  { code: "LI", name: "Liechtenstein" },
] as const;

export function countryName(code: string): string {
  return SHIPPING_COUNTRIES.find((country) => country.code === code)?.name ?? code;
}

export type PaymentOption = {
  value: string;
  title: string;
  /** Text badges standing in for the payment brand logos. */
  badges: string[];
  description: string;
  /** Needs a payment provider, i.e. Shopify's hosted checkout. */
  requiresProvider: boolean;
};

/** The payment methods offered by the floki24 Shopify checkout, in its order. */
export const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    value: "credit_card",
    title: "Kreditkarte",
    badges: ["VISA", "Mastercard", "AMEX", "UnionPay"],
    description: "",
    requiresProvider: true,
  },
  { value: "paypal", title: "PayPal", badges: ["PayPal"], description: "", requiresProvider: true },
  { value: "klarna", title: "Klarna", badges: ["Klarna"], description: "", requiresProvider: true },
  { value: "twint", title: "TWINT", badges: ["TWINT"], description: "", requiresProvider: true },
  {
    value: "invoice",
    title: "Kauf auf Rechnung",
    badges: ["QR-Rechnung"],
    description: "Sie bezahlen innerhalb von 30 Tagen nach Erhalt der Ware.",
    requiresProvider: false,
  },
  {
    value: "prepayment",
    title: "Banküberweisung",
    badges: [],
    description: "Sie überweisen den Betrag vorab; wir versenden nach Zahlungseingang.",
    requiresProvider: false,
  },
];

export function paymentOption(value: string): PaymentOption | undefined {
  return PAYMENT_OPTIONS.find((option) => option.value === value);
}

/** Swiss standard VAT rate; prices are shown including VAT. */
export const VAT_RATE = 0.081;

export function includedVat({ amount, currencyCode }: Money): Money {
  const gross = Number(amount);
  return { amount: String(gross - gross / (1 + VAT_RATE)), currencyCode };
}
