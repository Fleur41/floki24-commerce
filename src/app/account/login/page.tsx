import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoginForm } from "@/components/account/LoginForm";
import styles from "../account.module.css";

export const metadata: Metadata = {
  title: "Anmelden",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="container">
      <PageHeader title="Anmelden" />
      <div className={styles.panel}>
        <LoginForm />
        <p className={styles.switch}>
          Neu bei uns? <Link href="/account/register">Konto erstellen</Link>
        </p>
      </div>
    </div>
  );
}
