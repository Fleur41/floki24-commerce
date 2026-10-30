"use client";

import { useActionState } from "react";
import { useDictionary } from "@/i18n/client";
import { Button } from "@/components/ui/Button";
import { subscribe, type NewsletterState } from "./actions";
import styles from "./NewsletterForm.module.css";

const initialState: NewsletterState = { status: "idle" };

export function NewsletterForm() {
  const { newsletter } = useDictionary();
  const [state, formAction, isPending] = useActionState(subscribe, initialState);

  return (
    <form action={formAction} className={styles.form}>
      <label htmlFor="newsletter-email" className="visually-hidden">
        {newsletter.email}
      </label>
      <input
        id="newsletter-email"
        className={styles.input}
        type="email"
        name="email"
        placeholder={newsletter.email}
        autoComplete="email"
        required
      />
      <Button type="submit" size="large" disabled={isPending}>
        {newsletter.submit}
      </Button>
      {state.status !== "idle" && (
        <p role="status" className={styles[state.status]}>
          {state.message}
        </p>
      )}
    </form>
  );
}
