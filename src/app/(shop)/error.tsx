"use client";

import { Button } from "@/components/ui/Button";
import styles from "../not-found.module.css";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className={`container ${styles.notFound}`}>
      <h1>Etwas ist schiefgelaufen</h1>
      <p>Die Seite konnte nicht geladen werden. Bitte versuchen Sie es erneut.</p>
      <Button onClick={reset}>Erneut versuchen</Button>
    </div>
  );
}
