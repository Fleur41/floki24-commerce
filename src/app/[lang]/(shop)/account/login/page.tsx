import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/i18n/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoginForm } from "@/components/account/LoginForm";
import styles from "../account.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { account } = await getDictionary();
  return { title: account.loginTitle, robots: { index: false } };
}

export default async function LoginPage() {
  const { account } = await getDictionary();
  return (
    <div className="container">
      <PageHeader title={account.loginTitle} />
      <div className={styles.panel}>
        <LoginForm />
        <p className={styles.switch}>
          {account.newCustomer} <Link href="/account/register">{account.createAccount}</Link>
        </p>
      </div>
    </div>
  );
}
