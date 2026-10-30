import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { RegisterForm } from "@/components/account/RegisterForm";
import styles from "../account.module.css";

export const metadata: Metadata = {
  title: "Konto erstellen",
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <div className="container">
      <PageHeader title="Konto erstellen" />
      <div className={styles.panel}>
        <p className={styles.intro}>
          Mit einem Kundenkonto bestellen Sie schneller und behalten Ihre Bestellungen im Blick.
        </p>
        <RegisterForm />
        <p className={styles.switch}>
          Bereits registriert? <Link href="/account/login">Jetzt anmelden</Link>
        </p>
      </div>
    </div>
  );
}
