import { ShopChrome } from "@/components/layout/ShopChrome";
import { ButtonLink } from "@/components/ui/Button";
import styles from "./not-found.module.css";

export default function NotFound() {
  // Unmatched URLs render outside the (shop) group, so add its chrome here.
  return (
    <ShopChrome>
      <div className={`container ${styles.notFound}`}>
        <h1>Seite nicht gefunden</h1>
        <p>Die gesuchte Seite existiert leider nicht.</p>
        <ButtonLink href="/">Weiter einkaufen</ButtonLink>
      </div>
    </ShopChrome>
  );
}
