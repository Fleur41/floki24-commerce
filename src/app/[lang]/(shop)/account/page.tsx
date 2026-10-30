import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getDictionary } from "@/i18n/server";
import { getSessionCustomer } from "@/lib/customer-session";
import { formatDate, formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { logout } from "./actions";
import styles from "./account.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { account } = await getDictionary();
  return { title: account.title, robots: { index: false } };
}

export default async function AccountPage() {
  const { account } = await getDictionary();
  return (
    <div className="container">
      <PageHeader title={account.title} />
      <Suspense fallback={<p>{account.loading}</p>}>
        <AccountOverview />
      </Suspense>
    </div>
  );
}

async function AccountOverview() {
  const [customer, { account: t }] = await Promise.all([getSessionCustomer(), getDictionary()]);
  if (!customer) redirect("/account/session-expired");

  const name = [customer.firstName, customer.lastName].filter(Boolean).join(" ");

  return (
    <div className={styles.overview}>
      <section>
        <h2 className={styles.sectionTitle}>{t.orders}</h2>
        {customer.orders.length === 0 ? (
          <p>{t.noOrders}</p>
        ) : (
          <table className={styles.orders}>
            <thead>
              <tr>
                <th>{t.order}</th>
                <th>{t.date}</th>
                <th>{t.status}</th>
                <th>{t.total}</th>
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
                    {t.fulfillment[order.fulfillmentStatus as keyof typeof t.fulfillment] ??
                      order.fulfillmentStatus}
                  </td>
                  <td>{formatMoney(order.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className={styles.details}>
        <h2 className={styles.sectionTitle}>{t.details}</h2>
        {name && <p>{name}</p>}
        <p>{customer.email}</p>
        <p>
          {t.newsletter}: {customer.acceptsMarketing ? t.subscribed : t.notSubscribed}
        </p>
        <form action={logout}>
          <Button type="submit" variant="secondary" fullWidth>
            {t.logout}
          </Button>
        </form>
      </section>
    </div>
  );
}
