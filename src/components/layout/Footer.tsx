import Link from "next/link";
import { cacheLife } from "next/cache";
import { footerMenu, legalLinks, site } from "@/content/site";
import { NewsletterForm } from "./newsletter/NewsletterForm";
import { PaymentIcons } from "./PaymentIcons";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.columns}`}>
        <section>
          <h2 className={styles.title}>Floki24.ch</h2>
          <address className={styles.address}>
            {site.company.name}
            <br />
            {site.company.street}
            <br />
            {site.company.city}
            <br />
            Mail: <a href={`mailto:${site.email}`}>{site.email}</a>
          </address>
        </section>

        <nav aria-labelledby="footer-menu-title">
          <h2 id="footer-menu-title" className={styles.title}>
            Hauptmenü
          </h2>
          <ul className={styles.menu}>
            {footerMenu.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <section>
          <h2 className={styles.title}>Newsletter</h2>
          <p>Abonnieren Sie unseren Newsletter und verpassen Sie keine wichtigen Updates mehr!</p>
          <NewsletterForm />
        </section>

        <section>
          <h2 className={styles.title}>Fragen?</h2>
          <div className={styles.text}>
            <p>
              Gerne schreiben Sie uns ihr Anliegen über das Kontaktformular. Hinterlassen Sie uns
              ihre Telefonnummer, und wir rufen Sie schnellstmöglich zurück. In dringenden Fällen
              sind wir auch telefonisch erreichbar:
            </p>
            <p>Montag-Freitag: 10:00 Uhr bis 12:00 Uhr und 13:00 Uhr bis 17:00 Uhr.</p>
            <p>
              Hotline: 📞<a href={site.phone.href}>+41 (0) 71 511 98 64</a>
            </p>
          </div>
        </section>
      </div>

      <div className={`container ${styles.bottom}`}>
        <div>
          <ul className={styles.legal}>
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.title}</Link>
              </li>
            ))}
          </ul>
          <p className={styles.credits}>
            Copyright © <CopyrightYear /> {site.name}.
            <br />
            Powered by Shopify
          </p>
        </div>
        <PaymentIcons className={styles.payments} />
      </div>
    </footer>
  );
}

/** Cached so the footer can be prerendered: reading the clock is request-time work otherwise. */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
