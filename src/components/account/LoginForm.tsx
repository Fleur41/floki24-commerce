"use client";

import { useActionState } from "react";
import { login, type AccountFormState } from "@/app/(shop)/account/actions";
import { Button } from "@/components/ui/Button";
import styles from "./AccountForm.module.css";

const initialState: AccountFormState = { status: "idle" };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className={styles.form}>
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
          autoComplete="current-password"
          required
        />
      </label>
      {state.status === "error" && (
        <p role="alert" className={styles.error}>
          {state.message}
        </p>
      )}
      <Button type="submit" size="large" fullWidth disabled={isPending}>
        {isPending ? "Anmeldung läuft …" : "Anmelden"}
      </Button>
    </form>
  );
}
