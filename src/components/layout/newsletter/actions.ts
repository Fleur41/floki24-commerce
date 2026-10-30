"use server";

import { getRequestDictionary } from "@/i18n/server";
import { subscribeToNewsletter } from "@/lib/shopify/customers";

export type NewsletterState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribe(_: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const { newsletter } = await getRequestDictionary();
  const email = String(formData.get("email") ?? "").trim();

  if (!EMAIL_PATTERN.test(email)) {
    return { status: "error", message: newsletter.invalidEmail };
  }

  try {
    await subscribeToNewsletter(email);
    return { status: "success", message: newsletter.success };
  } catch (error) {
    console.error("Newsletter signup failed", error);
    return {
      status: "error",
      message: newsletter.failed,
    };
  }
}
