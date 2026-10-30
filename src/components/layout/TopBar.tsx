import Image from "next/image";
import { announcement, site } from "@/content/site";
import styles from "./TopBar.module.css";

/** Support line, "Swiss company" badge and the gold shipping announcement. */
export function TopBar() {
  return (
    <>
      <div className={`container ${styles.topBar}`}>
        <p>
          Fragen? 📞 Schneller Kundensupport |{" "}
          <a href={site.phone.href} className={styles.phone}>
            {site.phone.display}
          </a>{" "}
          📞
        </p>
        <p className={styles.badge}>
          <Image src={site.swissFlag} alt="" width={20} height={20} />
          Schweizer Unternehmen
        </p>
      </div>
      <p className={styles.announcement}>{announcement}</p>
    </>
  );
}
