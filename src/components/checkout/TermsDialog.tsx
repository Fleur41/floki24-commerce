"use client";

import { useState, type Ref } from "react";
import type { ShopPolicy } from "@/lib/shopify/types";
import { CloseIcon } from "@/components/ui/icons";
import fieldStyles from "./fields.module.css";
import styles from "./Checkout.module.css";

type TermsDialogProps = {
  ref: Ref<HTMLDialogElement>;
  policies: ShopPolicy[];
};

/** "AGB und Richtlinien": the shop's policies, picked from a dropdown. */
export function TermsDialog({ ref, policies }: TermsDialogProps) {
  const [handle, setHandle] = useState(policies[0]?.handle);
  const policy = policies.find((entry) => entry.handle === handle);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="terms-title"
      // Close when the backdrop (the dialog element itself) is clicked.
      onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
    >
      <div className={styles.dialogInner}>
        <header className={styles.dialogHeader}>
          <h2 id="terms-title">AGB und Richtlinien</h2>
          <form method="dialog">
            <button type="submit" className={styles.dialogClose} aria-label="Schliessen">
              <CloseIcon />
            </button>
          </form>
        </header>
        {policies.length === 0 ? (
          <p className={styles.muted}>
            Es sind noch keine Richtlinien hinterlegt. Sie werden im Shopify-Admin unter
            Einstellungen → Richtlinien gepflegt und erscheinen hier automatisch.
          </p>
        ) : (
          <>
            <div className={`${fieldStyles.field} ${fieldStyles.select}`}>
              <select
                id="policy"
                className={fieldStyles.input}
                value={handle}
                onChange={(event) => setHandle(event.target.value)}
              >
                {policies.map((entry) => (
                  <option key={entry.handle} value={entry.handle}>
                    {entry.title}
                  </option>
                ))}
              </select>
              <label htmlFor="policy" className={fieldStyles.label}>
                Richtlinie
              </label>
            </div>
            {policy && (
              <div className={styles.policy} dangerouslySetInnerHTML={{ __html: policy.body }} />
            )}
          </>
        )}
      </div>
    </dialog>
  );
}
