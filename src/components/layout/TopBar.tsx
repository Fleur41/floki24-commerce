import Image from "next/image";
import { announcement, site } from "@/content/site";
import { translateContent } from "@/content/translations";
import { getDictionary, getLocale } from "@/i18n/server";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import styles from "./TopBar.module.css";

/** Support line, language switcher, "Swiss company" badge and the gold shipping announcement. */
export async function TopBar() {
  const [{ topBar }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <>
      <div className={`container ${styles.topBar}`}>
        <p>
          {topBar.questions}{" "}
          <a href={site.phone.href} className={styles.phone}>
            {site.phone.display}
          </a>{" "}
          📞
        </p>
        <div className={styles.end}>
          <LanguageSwitcher />
          <p className={styles.badge}>
            <Image src={site.swissFlag} alt="" width={20} height={20} />
            {topBar.swissCompany}
          </p>
        </div>
      </div>
      <p className={styles.announcement}>{translateContent(announcement, locale)}</p>
    </>
  );
}
