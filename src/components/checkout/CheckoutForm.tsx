"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, type FormEvent } from "react";
import { format } from "@/i18n/config";
import { useDictionary } from "@/i18n/client";
import { HelpIcon, LockIcon } from "@/components/ui/icons";
import { placeOrder, type CheckoutFormState } from "./actions";
import { Checkbox, Field, SelectField } from "./fields";
import {
  PAYMENT_OPTIONS,
  localizePaymentOption,
  localizedCountries,
  paymentOption,
} from "./options";
import styles from "./Checkout.module.css";

const DEFAULT_PAYMENT_METHOD = "invoice";
const initialState: CheckoutFormState = { status: "idle" };

/** Shipping rates depend on the address, so they're only shown once it is complete. */
export function isAddressComplete(values: Record<string, string>): boolean {
  return Boolean(
    values.address1?.trim() && /^\d{4}$/.test(values.zip?.trim() ?? "") && values.city?.trim(),
  );
}

type CheckoutFormProps = {
  /** Prefilled from the customer account, when logged in. */
  defaults: Record<string, string>;
  isLoggedIn: boolean;
  addressComplete: boolean;
  onAddressCompleteChange: (complete: boolean) => void;
  onShowTerms: () => void;
};

export function CheckoutForm({
  defaults,
  isLoggedIn,
  addressComplete,
  onAddressCompleteChange,
  onShowTerms,
}: CheckoutFormProps) {
  const [state, formAction, isPending] = useActionState(placeOrder, initialState);
  const { checkout: t } = useDictionary();
  const values = state.values ?? defaults;

  const [paymentMethod, setPaymentMethod] = useState(DEFAULT_PAYMENT_METHOD);
  const [billingSame, setBillingSame] = useState(true);

  // Errors come from the server; each one disappears as soon as its field is edited.
  const [errorsFor, setErrorsFor] = useState(state);
  const [fieldErrors, setFieldErrors] = useState(state.fieldErrors ?? {});
  if (errorsFor !== state) {
    setErrorsFor(state);
    setFieldErrors(state.fieldErrors ?? {});
  }

  // After a failed submit the form is reset to the echoed values; keep the summary in sync.
  useEffect(() => {
    if (state.values) onAddressCompleteChange(isAddressComplete(state.values));
  }, [state, onAddressCompleteChange]);

  const handleInput = (event: FormEvent<HTMLFormElement>) => {
    const { name } = event.target as HTMLInputElement;
    if (fieldErrors[name]) {
      setFieldErrors((errors) => {
        const remaining = { ...errors };
        delete remaining[name];
        return remaining;
      });
    }
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    onAddressCompleteChange(isAddressComplete(data));
  };

  const field = (name: string, label: string, autoComplete: string, extra?: object) => (
    <Field
      name={name}
      label={label}
      autoComplete={autoComplete}
      defaultValue={values[name]}
      error={fieldErrors[name]}
      {...extra}
    />
  );

  const addressFields = (prefix: string, section: string) => {
    const p = (name: string) => prefix + name;
    const ac = (token: string) => `section-${section} ${token}`;
    return (
      <div className={styles.stack}>
        <SelectField
          name={p("country")}
          label={t.country}
          options={localizedCountries(t)}
          autoComplete={ac("country")}
          defaultValue={values[p("country")] || "CH"}
          error={fieldErrors[p("country")]}
        />
        <div className={styles.row}>
          {field(p("firstName"), t.firstName, ac("given-name"))}
          {field(p("lastName"), t.lastName, ac("family-name"))}
        </div>
        {field(p("company"), t.company, ac("organization"), { optional: true })}
        {field(p("address1"), t.address, ac("address-line1"))}
        {field(p("address2"), t.apartment, ac("address-line2"), { optional: true })}
        <div className={styles.row}>
          {field(p("zip"), t.zip, ac("postal-code"), {
            inputMode: "numeric",
            maxLength: 4,
          })}
          {field(p("city"), t.city, ac("address-level2"))}
        </div>
      </div>
    );
  };

  const selected = paymentOption(paymentMethod);

  return (
    <form action={formAction} onInput={handleInput} noValidate className={styles.form}>
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.heading}>{t.contact}</h2>
          {!isLoggedIn && (
            <Link href="/account/login" className={styles.link}>
              {t.login}
            </Link>
          )}
        </div>
        <div className={styles.stack}>
          {field("email", t.email, "email", {
            type: "email",
            adornment: (
              <span title={t.emailHelp}>
                <HelpIcon />
              </span>
            ),
          })}
          <Checkbox
            name="acceptsMarketing"
            label={t.newsletter}
            defaultChecked={values.acceptsMarketing === "on"}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>{t.delivery}</h2>
        {addressFields("", "shipping")}
        <div className={styles.stackTop}>
          {field("phone", t.phone, "section-shipping tel", {
            type: "tel",
            optional: true,
            adornment: (
              <span title={t.phoneHelp}>
                <HelpIcon />
              </span>
            ),
          })}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.subheading}>{t.shipping}</h3>
        <ShippingMethods addressComplete={addressComplete} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>{t.payment}</h2>
        <p className={styles.muted}>{t.paymentSecure}</p>
        <div
          className={`${styles.payments} ${fieldErrors.paymentMethod ? styles.paymentsInvalid : ""}`}
          role="radiogroup"
          aria-label={t.paymentMethod}
        >
          {PAYMENT_OPTIONS.map((baseOption) => {
            const option = localizePaymentOption(baseOption, t);
            const isSelected = option.value === paymentMethod;
            return (
              <div key={option.value} className={styles.payment}>
                <label className={`${styles.paymentOption} ${isSelected ? styles.selected : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.value}
                    checked={isSelected}
                    onChange={() => setPaymentMethod(option.value)}
                  />
                  <span className={styles.paymentTitle}>{option.title}</span>
                  <span className={styles.badges}>
                    {option.badges.map((badge) => (
                      <span key={badge} className={styles.badge} data-brand={badge}>
                        {badge}
                      </span>
                    ))}
                  </span>
                </label>
                {isSelected && (
                  <div className={styles.paymentDetails}>
                    {option.requiresProvider ? (
                      <p className={styles.providerNote}>
                        <LockIcon />
                        <span>{format(t.providerNote, { method: option.title })}</span>
                      </p>
                    ) : (
                      <>
                        {option.description && <p className={styles.muted}>{option.description}</p>}
                        <Checkbox
                          name="billingSameAsShipping"
                          label={t.billingSame}
                          checked={billingSame}
                          onChange={(event) => setBillingSame(event.target.checked)}
                        />
                        {!billingSame && (
                          <div className={styles.billing}>
                            <h3 className={styles.subheading}>{t.billingAddress}</h3>
                            {addressFields("billing_", "billing")}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {fieldErrors.paymentMethod && <p className={styles.error}>{fieldErrors.paymentMethod}</p>}
      </section>

      {state.message && (
        <p role="alert" className={styles.alert}>
          {state.message}
        </p>
      )}
      {Object.keys(fieldErrors).length > 0 && (
        <p role="alert" className="visually-hidden">
          {t.checkFields}
        </p>
      )}

      <button
        type="submit"
        className={styles.submit}
        disabled={isPending || selected?.requiresProvider}
      >
        {isPending ? t.processing : t.buyNow}
      </button>

      <footer className={styles.footer}>
        <button type="button" className={styles.link} onClick={onShowTerms}>
          {t.terms}
        </button>
      </footer>
    </form>
  );
}

function ShippingMethods({ addressComplete }: { addressComplete: boolean }) {
  const { checkout: t } = useDictionary();
  return addressComplete ? (
    <label className={`${styles.shippingOption} ${styles.selected}`}>
      <input type="radio" name="shippingMethod" value="standard" defaultChecked />
      <span className={styles.paymentTitle}>{t.standardShipping}</span>
      <strong>{t.free}</strong>
    </label>
  ) : (
    <p className={styles.placeholder}>{t.shippingPlaceholder}</p>
  );
}
