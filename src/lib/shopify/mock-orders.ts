import "server-only";
import { randomUUID } from "node:crypto";
import { readMockStore, updateMockStore } from "./mock-store";
import type { Cart, CustomerOrder, Image, Money } from "./types";

/**
 * Orders placed through the in-app checkout, which replaces Shopify's hosted
 * checkout while the app runs against mock.shop (its checkout is a separate
 * demo storefront that can't see our carts). No payment is taken.
 */

const STORE = "mock-orders";
const FIRST_ORDER_NUMBER = 1001;

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
};

/** Payment methods the in-app checkout can complete without a payment provider. */
export type PaymentMethod = "invoice" | "prepayment";

export type MockOrderLine = {
  title: string;
  variantTitle: string;
  handle: string;
  quantity: number;
  price: Money;
  total: Money;
  image: Image | null;
};

export type MockOrder = {
  id: string;
  orderNumber: number;
  processedAt: string;
  customerId: string | null;
  email: string;
  shippingAddress: ShippingAddress;
  /** `null` when it is the same as the shipping address. */
  billingAddress?: ShippingAddress | null;
  paymentMethod: PaymentMethod;
  discountCodes?: string[];
  lines: MockOrderLine[];
  subtotal: Money;
  shipping: Money;
  total: Money;
  financialStatus: string;
  fulfillmentStatus: string;
};

export type MockOrderInput = {
  cart: Cart;
  customerId: string | null;
  email: string;
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress | null;
  paymentMethod: PaymentMethod;
};

export function createMockOrder({ cart, ...details }: MockOrderInput): Promise<MockOrder> {
  const subtotal = cart.cost.subtotalAmount;
  const discountedTotal = cart.cost.totalAmount;
  // Shipping within Switzerland and Liechtenstein is free (see the top bar).
  const shipping = { amount: "0", currencyCode: subtotal.currencyCode };

  return updateMockStore(STORE, (orders: MockOrder[]) => {
    const order: MockOrder = {
      ...details,
      id: randomUUID(),
      orderNumber: FIRST_ORDER_NUMBER + orders.length,
      processedAt: new Date().toISOString(),
      lines: cart.lines.map(({ quantity, cost, merchandise }) => ({
        title: merchandise.product.title,
        variantTitle: merchandise.title,
        handle: merchandise.product.handle,
        quantity,
        price: merchandise.price,
        total: cost.totalAmount,
        image: merchandise.image,
      })),
      discountCodes: cart.discountCodes.filter((code) => code.applicable).map((code) => code.code),
      subtotal,
      shipping,
      total: {
        amount: String(Number(discountedTotal.amount) + Number(shipping.amount)),
        currencyCode: subtotal.currencyCode,
      },
      financialStatus: "PENDING",
      fulfillmentStatus: "UNFULFILLED",
    };
    orders.push(order);
    return order;
  });
}

/** Looks an order up by its unguessable id, which is what the confirmation link carries. */
export async function getMockOrder(id: string): Promise<MockOrder | null> {
  return (await readMockStore<MockOrder>(STORE)).find((order) => order.id === id) ?? null;
}

export async function getMockCustomerOrders(customerId: string): Promise<CustomerOrder[]> {
  return (await readMockStore<MockOrder>(STORE))
    .filter((order) => order.customerId === customerId)
    .reverse()
    .map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      processedAt: order.processedAt,
      financialStatus: order.financialStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      totalPrice: order.total,
      statusUrl: `/checkout/orders/${order.id}`,
    }));
}
