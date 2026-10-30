import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { formatDate } from "@/lib/format";
import { getMockOrder } from "@/lib/shopify/mock-orders";
import { ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { countryName, paymentOption } from "@/components/checkout/options";
import type { ShippingAddress } from "@/lib/shopify/mock-orders";
import styles from "../../checkout.module.css";

export const metadata: Metadata = {
  title: "Bestellbestätigung",
  robots: { index: false },
};

export default function OrderPage(props: PageProps<"/checkout/orders/[id]">) {
  return (
    <div className="container">
      <Suspense fallback={<p>Bestellung wird geladen …</p>}>
        <OrderConfirmation {...props} />
      </Suspense>
    </div>
  );
}

async function OrderConfirmation({ params }: PageProps<"/checkout/orders/[id]">) {
  const { id } = await params;
  const order = await getMockOrder(id);
  if (!order) notFound();

  const address = order.shippingAddress;
  const payment = paymentOption(order.paymentMethod);

  return (
    <>
      <PageHeader
        title={`Bestellung #${order.orderNumber}`}
        heading={`Vielen Dank, ${address.firstName}!`}
      />
      <div className={styles.layout}>
        <div>
          <p>
            Ihre Bestellung <strong>#{order.orderNumber}</strong> vom{" "}
            {formatDate(order.processedAt)} ist bei uns eingegangen.
          </p>
          <div className={styles.details}>
            <section>
              <h2>Lieferadresse</h2>
              <Address address={address} />
            </section>
            <section>
              <h2>Kontakt</h2>
              <p>{order.email}</p>
            </section>
            <section>
              <h2>Zahlungsart</h2>
              <p>
                {payment?.title}
                <br />
                {payment?.description}
              </p>
            </section>
            {order.billingAddress && (
              <section>
                <h2>Rechnungsadresse</h2>
                <Address address={order.billingAddress} />
              </section>
            )}
            {order.discountCodes && order.discountCodes.length > 0 && (
              <section>
                <h2>Rabattcode</h2>
                <p>{order.discountCodes.join(", ")}</p>
              </section>
            )}
          </div>
          <div className={styles.actions}>
            <ButtonLink href="/">Weiter einkaufen</ButtonLink>
            <ButtonLink href="/account" variant="secondary">
              Meine Bestellungen
            </ButtonLink>
          </div>
        </div>
        <aside className={styles.aside} aria-label="Bestellübersicht">
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

function Address({ address }: { address: ShippingAddress }) {
  const lines = [
    `${address.firstName} ${address.lastName}`,
    address.company,
    address.address1,
    address.address2,
    `${address.zip} ${address.city}`,
    countryName(address.country),
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
