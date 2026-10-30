import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { format } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/server";
import { formatDate } from "@/lib/format";
import { getMockOrder } from "@/lib/shopify/mock-orders";
import { ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { countryName, localizePaymentOption, paymentOption } from "@/components/checkout/options";
import type { Dictionary } from "@/i18n/dictionaries/de";
import type { ShippingAddress } from "@/lib/shopify/mock-orders";
import styles from "../../checkout.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { order } = await getDictionary();
  return { title: order.confirmationTitle, robots: { index: false } };
}

export default async function OrderPage(props: PageProps<"/[lang]/checkout/orders/[id]">) {
  const { order } = await getDictionary();
  return (
    <div className="container">
      <Suspense fallback={<p>{order.loading}</p>}>
        <OrderConfirmation {...props} />
      </Suspense>
    </div>
  );
}

async function OrderConfirmation({ params }: PageProps<"/[lang]/checkout/orders/[id]">) {
  const { id } = await params;
  const [order, { common, checkout, order: t }, locale] = await Promise.all([
    getMockOrder(id),
    getDictionary(),
    getLocale(),
  ]);
  if (!order) notFound();

  const address = order.shippingAddress;
  const baseOption = paymentOption(order.paymentMethod);
  const payment = baseOption && localizePaymentOption(baseOption, checkout);

  return (
    <>
      <PageHeader
        title={format(t.title, { number: order.orderNumber })}
        heading={format(t.thanks, { name: address.firstName })}
      />
      <div className={styles.layout}>
        <div>
          <p>
            {format(t.received, {
              number: order.orderNumber,
              date: formatDate(order.processedAt, locale),
            })}
          </p>
          <div className={styles.details}>
            <section>
              <h2>{t.shippingAddress}</h2>
              <Address address={address} texts={checkout} />
            </section>
            <section>
              <h2>{t.contact}</h2>
              <p>{order.email}</p>
            </section>
            <section>
              <h2>{t.paymentMethod}</h2>
              <p>
                {payment?.title}
                <br />
                {payment?.description}
              </p>
            </section>
            {order.billingAddress && (
              <section>
                <h2>{t.billingAddress}</h2>
                <Address address={order.billingAddress} texts={checkout} />
              </section>
            )}
            {order.discountCodes && order.discountCodes.length > 0 && (
              <section>
                <h2>{t.discountCode}</h2>
                <p>{order.discountCodes.join(", ")}</p>
              </section>
            )}
          </div>
          <div className={styles.actions}>
            <ButtonLink href="/">{common.continueShopping}</ButtonLink>
            <ButtonLink href="/account" variant="secondary">
              {t.myOrders}
            </ButtonLink>
          </div>
        </div>
        <aside className={styles.aside} aria-label={checkout.summary}>
          <OrderSummary
            lines={order.lines.map((line, index) => ({ key: String(index), ...line }))}
            subtotal={order.subtotal}
            shipping={order.shipping}
            total={order.total}
          />
        </aside>
      </div>
    </>
  );
}

function Address({ address, texts }: { address: ShippingAddress; texts: Dictionary["checkout"] }) {
  const lines = [
    `${address.firstName} ${address.lastName}`,
    address.company,
    address.address1,
    address.address2,
    `${address.zip} ${address.city}`,
    countryName(address.country, texts),
    address.phone,
  ].filter(Boolean);

  return (
    <p>
      {lines.map((line, index) => (
        <span key={index}>
          {index > 0 && <br />}
          {line}
        </span>
      ))}
    </p>
  );
}
