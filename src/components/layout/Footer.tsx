import Link from "next/link";
import { cacheLife } from "next/cache";
import { footerMenu, legalLinks, site } from "@/content/site";
import { localizeContent } from "@/content/translations";
import { format } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/server";
import { FooterLocalization } from "./FooterLocalization";
import { NewsletterForm } from "./newsletter/NewsletterForm";
import { PaymentIcons } from "./PaymentIcons";
import styles from "./Footer.module.css";

export async function Footer() {
  const [{ footer }, locale, year] = await Promise.all([
    getDictionary(),
    getLocale(),
    copyrightYear(),
  ]);

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
            {footer.email} <a href={`mailto:${site.email}`}>{site.email}</a>
          </address>
        </section>

        <nav aria-label={footer.menuLabel}>
          <h2 className={styles.title}>{footer.mainMenu}</h2>
          <ul className={styles.menu}>
            {localizeContent(footerMenu, locale).map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <section>
          <h2 className={styles.title}>{footer.newsletterTitle}</h2>
          <p className={styles.text}>{footer.newsletterText}</p>
          <NewsletterForm />
        </section>

        <section>
          <h2 className={styles.title}>{footer.questionsTitle}</h2>
          <div className={styles.contact}>
            <p className={styles.preLine}>{footer.questionsText}</p>
            <p>{footer.hours}</p>
            <p>
              {footer.whatsapp} 📞
              <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer">
                {site.whatsapp.display}
              </a>
            </p>
          </div>
        </section>
      </div>

      <div className={`container ${styles.toolbar}`}>
        <a
          href="https://shop.app"
          className={styles.follow}
          target="_blank"
          rel="noopener noreferrer"
        >
          <HeartIcon />
          {footer.followOn} <ShopWordmark />
        </a>
        <FooterLocalization />
      </div>

      <div className={`container ${styles.bottom}`}>
        <div>
          <ul className={styles.legal}>
            {localizeContent(legalLinks, locale).map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.title}</Link>
              </li>
            ))}
          </ul>
          <p className={styles.credits}>{format(footer.copyright, { year })}</p>
        </div>
        <PaymentIcons className={styles.payments} />
      </div>
    </footer>
  );
}

/** Cached so the footer can be prerendered: reading the clock is request-time work otherwise. */
async function copyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

function HeartIcon() {
  return (
    <svg aria-hidden width="20" height="18" viewBox="0 0 20 18" fill="none">
      <path
        d="M10 16.5S1.5 11.4 1.5 5.6A4.1 4.1 0 0 1 5.6 1.5c1.8 0 3.4 1 4.4 2.6 1-1.6 2.6-2.6 4.4-2.6a4.1 4.1 0 0 1 4.1 4.1c0 5.8-8.5 10.9-8.5 10.9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The "shop" wordmark of Shopify's Shop app. */
function ShopWordmark() {
  return <span className={styles.shopWordmark}>shop</span>;
}
