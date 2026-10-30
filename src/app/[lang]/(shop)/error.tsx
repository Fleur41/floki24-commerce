"use client";

import { useDictionary } from "@/i18n/client";
import { Button } from "@/components/ui/Button";
import styles from "../not-found.module.css";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const { errors } = useDictionary();
  return (
    <div className={`container ${styles.notFound}`}>
      <h1>{errors.errorTitle}</h1>
      <p>{errors.errorText}</p>
      <Button onClick={reset}>{errors.retry}</Button>
    </div>
  );
}
