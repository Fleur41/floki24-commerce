"use server";

import { redirect } from "next/navigation";
import { format } from "@/i18n/config";
import { getRequestDictionary } from "@/i18n/server";
import type { Dictionary } from "@/i18n/dictionaries/de";
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

type AccountErrors = Dictionary["account"]["errors"];

const field = (formData: FormData, name: string) => String(formData.get(name) ?? "").trim();

function customerErrorMessage(error: CustomerError, errors: AccountErrors): string {
  switch (error.code) {
    case "TAKEN":
      return errors.taken;
    case "UNIDENTIFIED_CUSTOMER":
      return errors.wrongCredentials;
    case "CUSTOMER_DISABLED":
      return errors.disabled;
    default:
      return error.message;
  }
}

export async function register(_: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const { account } = await getRequestDictionary();
  const { errors } = account;
  const values = {
    firstName: field(formData, "firstName"),
    lastName: field(formData, "lastName"),
    email: field(formData, "email"),
  };
  const password = String(formData.get("password") ?? "");
  const acceptsMarketing = formData.get("acceptsMarketing") === "on";

  const fail = (message: string): AccountFormState => ({ status: "error", message, values });

  if (!values.firstName || !values.lastName) return fail(errors.nameRequired);
  if (!EMAIL_PATTERN.test(values.email)) {
    return fail(errors.invalidEmail);
  }
  if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
    return fail(
      format(errors.passwordLength, { min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH }),
    );
  }

  try {
    await createCustomer({ ...values, password, acceptsMarketing });
  } catch (error) {
    if (error instanceof CustomerError) return fail(customerErrorMessage(error, errors));
    console.error("Customer registration failed", error);
    return fail(errors.unexpected);
  }

  try {
    await saveCustomerSession(await createCustomerAccessToken(values.email, password));
  } catch (error) {
    // Stores that require email confirmation create the account but refuse
    // to log it in until the customer has clicked the activation link.
    if (error instanceof CustomerError && error.code === "CUSTOMER_DISABLED") {
      return { status: "success", message: account.activationSent };
    }
    console.error("Login after registration failed", error);
    redirect("/account/login");
  }

  redirect("/account");
}

export async function login(_: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const { errors } = (await getRequestDictionary()).account;
  const values = { email: field(formData, "email") };
  const password = String(formData.get("password") ?? "");

  if (!EMAIL_PATTERN.test(values.email) || !password) {
    return {
      status: "error",
      message: errors.credentialsRequired,
      values,
    };
  }

  try {
    await saveCustomerSession(await createCustomerAccessToken(values.email, password));
  } catch (error) {
    const message =
      error instanceof CustomerError ? customerErrorMessage(error, errors) : errors.unexpected;
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
