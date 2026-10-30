"use client";

import { useActionState } from "react";
import { register, type AccountFormState } from "@/app/account/actions";
import { Button } from "@/components/ui/Button";
import styles from "./AccountForm.module.css";

const initialState: AccountFormState = { status: "idle" };

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, initialState);

  if (state.status === "success") {
    return (
      <p role="status" className={styles.success}>
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.row}>
        <label className={styles.field}>
          Vorname
          <input
            className={styles.input}
            name="firstName"
            autoComplete="given-name"
            defaultValue={state.values?.firstName}
            required
          />
        </label>
        <label className={styles.field}>
          Nachname
          <input
            className={styles.input}
            name="lastName"
            autoComplete="family-name"
            defaultValue={state.values?.lastName}
            required
          />
        </label>
      </div>
      <label className={styles.field}>
        E-Mail-Adresse
        <input
          className={styles.input}
          type="email"
          name="email"
          autoComplete="email"
          defaultValue={state.values?.email}
          required
        />
      </label>
      <label className={styles.field}>
        Passwort
        <input
          className={styles.input}
          type="password"
          name="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={40}
          required
        />
        <span className={styles.hint}>Mindestens 8 Zeichen</span>
      </label>
      <label className={styles.checkbox}>
        <input type="checkbox" name="acceptsMarketing" />
        Ich möchte den Newsletter mit Angeboten und Neuheiten erhalten.
      </label>
      {state.status === "error" && (
        <p role="alert" className={styles.error}>
          {state.message}
        </p>
      )}
      <Button type="submit" size="large" fullWidth disabled={isPending}>
        {isPending ? "Konto wird erstellt …" : "Konto erstellen"}
      </Button>
    </form>
  );
}
