"use server";

import { redirect } from "next/navigation";
import {
  CustomerError,
  createCustomer,
  createCustomerAccessToken,
  deleteCustomerAccessToken,
} from "@/lib/shopify/customers";
import { clearCustomerSession, saveCustomerSession } from "@/lib/customer-session";

export type AccountFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  /** Submitted values (never the password), so the form keeps them after an error. */
  values?: Record<string, string>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Shopify accepts passwords of 5–40 characters; we ask for a little more.
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 40;

const UNEXPECTED_ERROR = "Etwas ist schiefgelaufen. Bitte versuchen Sie es später erneut.";

const field = (formData: FormData, name: string) => String(formData.get(name) ?? "").trim();

function customerErrorMessage(error: CustomerError): string {
  switch (error.code) {
    case "TAKEN":
      return "Für diese E-Mail-Adresse existiert bereits ein Konto. Bitte melden Sie sich an.";
    case "UNIDENTIFIED_CUSTOMER":
      return "E-Mail-Adresse oder Passwort ist falsch.";
    case "CUSTOMER_DISABLED":
      return "Bitte bestätigen Sie zuerst Ihr Konto über den Link in der E-Mail, die wir Ihnen gesendet haben.";
    default:
      return error.message;
  }
}

export async function register(_: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const values = {
    firstName: field(formData, "firstName"),
    lastName: field(formData, "lastName"),
    email: field(formData, "email"),
  };
  const password = String(formData.get("password") ?? "");
  const acceptsMarketing = formData.get("acceptsMarketing") === "on";

  const fail = (message: string): AccountFormState => ({ status: "error", message, values });

  if (!values.firstName || !values.lastName) return fail("Bitte geben Sie Vor- und Nachnamen ein.");
  if (!EMAIL_PATTERN.test(values.email)) {
    return fail("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
  }
  if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
    return fail(
      `Das Passwort muss zwischen ${PASSWORD_MIN_LENGTH} und ${PASSWORD_MAX_LENGTH} Zeichen lang sein.`,
    );
  }

  try {
    await createCustomer({ ...values, password, acceptsMarketing });
  } catch (error) {
    if (error instanceof CustomerError) return fail(customerErrorMessage(error));
    console.error("Customer registration failed", error);
    return fail(UNEXPECTED_ERROR);
  }

  try {
    await saveCustomerSession(await createCustomerAccessToken(values.email, password));
  } catch (error) {
    // Stores that require email confirmation create the account but refuse
    // to log it in until the customer has clicked the activation link.
    if (error instanceof CustomerError && error.code === "CUSTOMER_DISABLED") {
      return {
        status: "success",
        message:
          "Ihr Konto wurde erstellt. Bitte bestätigen Sie es über den Link in der E-Mail, die wir Ihnen gesendet haben.",
      };
    }
    console.error("Login after registration failed", error);
    redirect("/account/login");
  }

  redirect("/account");
}

export async function login(_: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const values = { email: field(formData, "email") };
  const password = String(formData.get("password") ?? "");

  if (!EMAIL_PATTERN.test(values.email) || !password) {
    return {
      status: "error",
      message: "Bitte geben Sie Ihre E-Mail-Adresse und Ihr Passwort ein.",
      values,
    };
  }

  try {
    await saveCustomerSession(await createCustomerAccessToken(values.email, password));
  } catch (error) {
    const message = error instanceof CustomerError ? customerErrorMessage(error) : UNEXPECTED_ERROR;
    if (!(error instanceof CustomerError)) console.error("Customer login failed", error);
    return { status: "error", message, values };
  }

  redirect("/account");
}

export async function logout(): Promise<void> {
  const accessToken = await clearCustomerSession();
  if (accessToken) {
    // The session cookie is already gone; revoking the token is best effort.
    await deleteCustomerAccessToken(accessToken).catch((error: unknown) =>
      console.error("Revoking customer access token failed", error),
    );
  }
  redirect("/account/login");
}
