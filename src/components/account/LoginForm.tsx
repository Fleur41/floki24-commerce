"use client";

import { useActionState } from "react";
import { useDictionary } from "@/i18n/client";
import { login, type AccountFormState } from "@/app/[lang]/(shop)/account/actions";
import { Button } from "@/components/ui/Button";
import styles from "./AccountForm.module.css";

const initialState: AccountFormState = { status: "idle" };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);
  const { account } = useDictionary();

  return (
    <form action={formAction} className={styles.form}>
      <label className={styles.field}>
        {account.email}
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
        {account.password}
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
        {isPending ? account.loggingIn : account.login}
      </Button>
    </form>
  );
}
