import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSessionCustomer } from "@/lib/customer-session";
import { formatDate, formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { logout } from "./actions";
import styles from "./account.module.css";

const FULFILLMENT_STATUS_LABELS: Record<string, string> = {
  UNFULFILLED: "In Bearbeitung",
  IN_PROGRESS: "In Bearbeitung",
  PARTIALLY_FULFILLED: "Teilweise versendet",
  FULFILLED: "Versendet",
  ON_HOLD: "Zurückgestellt",
};

export const metadata: Metadata = {
  title: "Mein Konto",
  robots: { index: false },
};

export default function AccountPage() {
  return (
    <div className="container">
      <PageHeader title="Mein Konto" />
      <Suspense fallback={<p>Konto wird geladen …</p>}>
        <AccountOverview />
      </Suspense>
    </div>
  );
}

async function AccountOverview() {
  const customer = await getSessionCustomer();
  if (!customer) redirect("/account/session-expired");

  const name = [customer.firstName, customer.lastName].filter(Boolean).join(" ");

  return (
    <div className={styles.overview}>
      <section>
        <h2 className={styles.sectionTitle}>Bestellungen</h2>
        {customer.orders.length === 0 ? (
          <p>Sie haben noch keine Bestellungen aufgegeben.</p>
        ) : (
          <table className={styles.orders}>
            <thead>
              <tr>
                <th>Bestellung</th>
                <th>Datum</th>
                <th>Status</th>
                <th>Summe</th>
              </tr>
            </thead>
            <tbody>
              {customer.orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <a href={order.statusUrl}>#{order.orderNumber}</a>
                  </td>
                  <td>{formatDate(order.processedAt)}</td>
                  <td>
                    {FULFILLMENT_STATUS_LABELS[order.fulfillmentStatus] ?? order.fulfillmentStatus}
                  </td>
                  <td>{formatMoney(order.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className={styles.details}>
        <h2 className={styles.sectionTitle}>Kontodaten</h2>
        {name && <p>{name}</p>}
        <p>{customer.email}</p>
        <p>Newsletter: {customer.acceptsMarketing ? "abonniert" : "nicht abonniert"}</p>
        <form action={logout}>
          <Button type="submit" variant="secondary" fullWidth>
            Abmelden
          </Button>
        </form>
      </section>
    </div>
  );
}
