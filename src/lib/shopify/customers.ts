import { randomBytes } from "node:crypto";
import { ShopifyError, isMockShop, storefront } from "./client";
import {
  MockCustomerError,
  createMockAccessToken,
  createMockCustomer,
  deleteMockAccessToken,
  getMockCustomer,
} from "./mock-customers";
import type { Customer, CustomerAccessToken, CustomerOrder, Money } from "./types";

type CustomerUserError = { code: string | null; message: string };

/** A problem the customer can fix (e.g. wrong password), as opposed to an API failure. */
export class CustomerError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "CustomerError";
  }
}

function throwUserErrors(errors: CustomerUserError[]): void {
  if (errors.length) {
    throw new CustomerError(
      errors[0].code ?? "UNKNOWN",
      errors.map((error) => error.message).join("\n"),
    );
  }
}

/** Runs the local fallback, translating its errors to the shape Shopify callers expect. */
async function mockCall<T>(call: () => Promise<T>): Promise<T> {
  try {
    return await call();
  } catch (error) {
    if (error instanceof MockCustomerError) throw new CustomerError(error.code, error.message);
    throw error;
  }
}

const CUSTOMER_CREATE_MUTATION = /* GraphQL */ `
  mutation CustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        message
      }
    }
  }
`;

type CustomerCreatePayload = {
  customerCreate: {
    customer: { id: string } | null;
    customerUserErrors: CustomerUserError[];
  } | null;
};

export type CustomerCreateInput = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptsMarketing?: boolean;
};

/** Creates a customer account. Throws `CustomerError` with code `TAKEN` for a known email. */
export async function createCustomer(input: CustomerCreateInput): Promise<void> {
  if (isMockShop) return mockCall(() => createMockCustomer(input));

  const data = await storefront<CustomerCreatePayload>(CUSTOMER_CREATE_MUTATION, { input });
  const payload = data.customerCreate;
  if (!payload) {
    throw new ShopifyError("customerCreate is not available on this storefront", "customerCreate");
  }
  throwUserErrors(payload.customerUserErrors);
}

/**
 * Subscribes an email address to marketing emails.
 *
 * The Storefront API has no dedicated newsletter endpoint, so — like the
 * theme's newsletter form — we create a customer record that accepts
 * marketing. The password is random and never shown; the customer can set
 * one later through "Passwort vergessen".
 */
export async function subscribeToNewsletter(email: string): Promise<void> {
  try {
    await createCustomer({
      email,
      acceptsMarketing: true,
      password: randomBytes(24).toString("base64url"),
    });
  } catch (error) {
    // An existing customer is not an error for a newsletter signup.
    if (error instanceof CustomerError && error.code === "TAKEN") return;
    throw error;
  }
}

const ACCESS_TOKEN_CREATE_MUTATION = /* GraphQL */ `
  mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        message
      }
    }
  }
`;

type AccessTokenCreatePayload = {
  customerAccessTokenCreate: {
    customerAccessToken: CustomerAccessToken | null;
    customerUserErrors: CustomerUserError[];
  } | null;
};

/** Logs a customer in. Throws `CustomerError` with code `UNIDENTIFIED_CUSTOMER` on bad credentials. */
export async function createCustomerAccessToken(
  email: string,
  password: string,
): Promise<CustomerAccessToken> {
  if (isMockShop) return mockCall(() => createMockAccessToken(email, password));

  const data = await storefront<AccessTokenCreatePayload>(ACCESS_TOKEN_CREATE_MUTATION, {
    input: { email, password },
  });
  const payload = data.customerAccessTokenCreate;
  if (!payload) {
    throw new ShopifyError(
      "customerAccessTokenCreate is not available on this storefront",
      "customerAccessTokenCreate",
    );
  }
  throwUserErrors(payload.customerUserErrors);
  if (!payload.customerAccessToken) {
    throw new CustomerError("UNIDENTIFIED_CUSTOMER", "Unidentified customer");
  }
  return payload.customerAccessToken;
}

const ACCESS_TOKEN_DELETE_MUTATION = /* GraphQL */ `
  mutation CustomerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
    }
  }
`;

export async function deleteCustomerAccessToken(accessToken: string): Promise<void> {
  if (isMockShop) return deleteMockAccessToken(accessToken);

  await storefront(ACCESS_TOKEN_DELETE_MUTATION, { customerAccessToken: accessToken });
}

const CUSTOMER_QUERY = /* GraphQL */ `
  query Customer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      acceptsMarketing
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          orderNumber
          processedAt
          financialStatus
          fulfillmentStatus
          statusUrl
          currentTotalPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

type RawCustomerOrder = Omit<CustomerOrder, "totalPrice"> & { currentTotalPrice: Money };

type CustomerPayload = {
  customer:
    | (Omit<Customer, "orders"> & {
        orders: { nodes: RawCustomerOrder[] };
      })
    | null;
};

/** The customer behind an access token, or `null` when the token is invalid or expired. */
export async function getCustomer(accessToken: string): Promise<Customer | null> {
  if (isMockShop) return getMockCustomer(accessToken);

  const { customer } = await storefront<CustomerPayload>(CUSTOMER_QUERY, {
    customerAccessToken: accessToken,
  });
  if (!customer) return null;

  return {
    ...customer,
    orders: customer.orders.nodes.map(({ currentTotalPrice, ...order }) => ({
      ...order,
      totalPrice: currentTotalPrice,
    })),
  };
}
