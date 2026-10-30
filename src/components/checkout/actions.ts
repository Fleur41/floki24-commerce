"use server";

import { redirect } from "next/navigation";
import { clearSessionCart, getSessionCart } from "@/lib/cart-session";
import { getSessionCustomer } from "@/lib/customer-session";
import { updateCartDiscountCodes } from "@/lib/shopify/cart";
import { subscribeToNewsletter } from "@/lib/shopify/customers";
import {
  createMockOrder,
  type PaymentMethod,
  type ShippingAddress,
} from "@/lib/shopify/mock-orders";
import type { Cart } from "@/lib/shopify/types";
import { SHIPPING_COUNTRIES, paymentOption } from "./options";

export type CheckoutFormState = {
  status: "idle" | "error";
  /** Problems not tied to a single field. */
  message?: string;
  /** Field name → message shown below that field. */
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_PATTERN = /^\d{4}$/;

const ADDRESS_FIELDS = [
  "country",
  "firstName",
  "lastName",
  "company",
  "address1",
  "address2",
  "zip",
  "city",
  "phone",
] as const;

function readAddress(formData: FormData, prefix = ""): ShippingAddress {
  const value = (name: string) => String(formData.get(prefix + name) ?? "").trim();
  return Object.fromEntries(ADDRESS_FIELDS.map((name) => [name, value(name)])) as ShippingAddress;
}

/** Shopify-style messages, keyed like the form fields (with an optional prefix). */
function validateAddress(address: ShippingAddress, prefix = ""): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!SHIPPING_COUNTRIES.some((country) => country.code === address.country)) {
    errors[prefix + "country"] = "Wir liefern nur in die Schweiz und nach Liechtenstein";
  }
  if (!address.firstName) errors[prefix + "firstName"] = "Geben Sie einen Vornamen ein";
  if (!address.lastName) errors[prefix + "lastName"] = "Geben Sie einen Nachnamen ein";
  if (!address.address1) errors[prefix + "address1"] = "Geben Sie eine Adresse ein";
  if (!address.zip) errors[prefix + "zip"] = "Geben Sie eine Postleitzahl ein";
  else if (!ZIP_PATTERN.test(address.zip)) {
    errors[prefix + "zip"] = "Geben Sie eine gültige Postleitzahl ein";
  }
  if (!address.city) errors[prefix + "city"] = "Geben Sie einen Ort ein";
  return errors;
}

export async function placeOrder(
  _: CheckoutFormState,
  formData: FormData,
): Promise<CheckoutFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const paymentMethod = String(formData.get("paymentMethod") ?? "");
  const acceptsMarketing = formData.get("acceptsMarketing") === "on";
  const billingSameAsShipping = formData.get("billingSameAsShipping") === "on";

  const shippingAddress = readAddress(formData);
  const billingAddress = billingSameAsShipping ? null : readAddress(formData, "billing_");

  // Echoed back so the form keeps what was typed after an error.
  const values: Record<string, string> = Object.fromEntries(
    [...formData.entries()]
      .filter(([name, value]) => typeof value === "string" && !name.startsWith("$"))
      .map(([name, value]) => [name, String(value)]),
  );

  const fieldErrors: Record<string, string> = {
    ...validateAddress(shippingAddress),
    ...(billingAddress && validateAddress(billingAddress, "billing_")),
  };
  if (!email) fieldErrors.email = "Geben Sie eine E-Mail-Adresse ein";
  else if (!EMAIL_PATTERN.test(email))
    fieldErrors.email = "Geben Sie eine gültige E-Mail-Adresse ein";

  const option = paymentOption(paymentMethod);
  if (!option) fieldErrors.paymentMethod = "Wählen Sie eine Zahlungsart";
  else if (option.requiresProvider) {
    fieldErrors.paymentMethod = `${option.title} ist im Demo-Shop nicht verfügbar. Bitte wählen Sie Kauf auf Rechnung oder Banküberweisung.`;
  }

  if (Object.keys(fieldErrors).length) return { status: "error", fieldErrors, values };

  // The order is built from the server-side cart, never from submitted data.
  const [cart, customer] = await Promise.all([getSessionCart(), getSessionCustomer()]);
  if (!cart?.lines.length) return { status: "error", message: "Ihr Warenkorb ist leer.", values };

  let orderId: string;
  try {
    const order = await createMockOrder({
      cart,
      customerId: customer?.id ?? null,
      email,
      shippingAddress,
      billingAddress,
      paymentMethod: paymentMethod as PaymentMethod,
    });
    orderId = order.id;
  } catch (error) {
    console.error("Placing order failed", error);
    return {
      status: "error",
      message: "Die Bestellung konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut.",
      values,
    };
  }

  if (acceptsMarketing) {
    await subscribeToNewsletter(email).catch((error: unknown) =>
      console.error("Newsletter signup during checkout failed", error),
    );
  }

  await clearSessionCart();
  redirect(`/checkout/orders/${orderId}`);
}

export type DiscountResult = { ok: true; cart: Cart } | { ok: false; error: string };

const INVALID_DISCOUNT = "Geben Sie einen gültigen Rabattcode ein";

export async function applyDiscountCode(code: string): Promise<DiscountResult> {
  const trimmed = code.trim();
  if (!trimmed) return { ok: false, error: INVALID_DISCOUNT };

  const cart = await getSessionCart();
  if (!cart) return { ok: false, error: "Ihr Warenkorb ist leer." };

  try {
    const existing = cart.discountCodes
      .filter((entry) => entry.applicable)
      .map((entry) => entry.code);
    const updated = await updateCartDiscountCodes(cart.id, [...existing, trimmed]);
    const applied = updated.discountCodes.find(
      (entry) => entry.code.toLowerCase() === trimmed.toLowerCase(),
    );
    if (applied?.applicable) return { ok: true, cart: updated };

    // Shopify keeps unknown codes on the cart; drop it again so it doesn't linger.
    await updateCartDiscountCodes(cart.id, existing);
    return { ok: false, error: INVALID_DISCOUNT };
  } catch (error) {
    console.error("Applying discount code failed", error);
    return { ok: false, error: "Der Rabattcode konnte nicht geprüft werden." };
  }
}

export async function removeDiscountCode(code: string): Promise<DiscountResult> {
  const cart = await getSessionCart();
  if (!cart) return { ok: false, error: "Ihr Warenkorb ist leer." };

  try {
    const remaining = cart.discountCodes
      .filter((entry) => entry.applicable && entry.code !== code)
      .map((entry) => entry.code);
    return { ok: true, cart: await updateCartDiscountCodes(cart.id, remaining) };
  } catch (error) {
    console.error("Removing discount code failed", error);
    return { ok: false, error: "Der Rabattcode konnte nicht entfernt werden." };
  }
}
