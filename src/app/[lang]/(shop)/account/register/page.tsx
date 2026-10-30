import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/i18n/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { RegisterForm } from "@/components/account/RegisterForm";
import styles from "../account.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { account } = await getDictionary();
  return { title: account.registerTitle, robots: { index: false } };
}

export default async function RegisterPage() {
  const { account } = await getDictionary();
  return (
    <div className="container">
      <PageHeader title={account.registerTitle} />
      <div className={styles.panel}>
        <p className={styles.intro}>{account.registerIntro}</p>
        <RegisterForm />
        <p className={styles.switch}>
          {account.alreadyRegistered} <Link href="/account/login">{account.loginNow}</Link>
        </p>
      </div>
    </div>
  );
}
