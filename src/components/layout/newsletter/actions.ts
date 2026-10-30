"use server";

import { subscribeToNewsletter } from "@/lib/shopify/customers";

export type NewsletterState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribe(_: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!EMAIL_PATTERN.test(email)) {
    return { status: "error", message: "Bitte geben Sie eine gültige E-Mail-Adresse ein." };
  }

  try {
    await subscribeToNewsletter(email);
    return { status: "success", message: "Vielen Dank für Ihre Anmeldung!" };
  } catch (error) {
    console.error("Newsletter signup failed", error);
    return {
      status: "error",
      message: "Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es später erneut.",
    };
  }
}
