import { ButtonLink } from "@/components/ui/Button";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={`container ${styles.notFound}`}>
      <h1>Seite nicht gefunden</h1>
      <p>Die gesuchte Seite existiert leider nicht.</p>
      <ButtonLink href="/">Weiter einkaufen</ButtonLink>
    </div>
  );
}
