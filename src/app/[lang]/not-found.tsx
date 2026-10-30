import { getDictionary } from "@/i18n/server";
import { ShopChrome } from "@/components/layout/ShopChrome";
import { ButtonLink } from "@/components/ui/Button";
import styles from "./not-found.module.css";

export default async function NotFound() {
  const { common, errors } = await getDictionary();
  // Unmatched URLs render outside the (shop) group, so add its chrome here.
  return (
    <ShopChrome>
      <div className={`container ${styles.notFound}`}>
        <h1>{errors.notFoundTitle}</h1>
        <p>{errors.notFoundText}</p>
        <ButtonLink href="/">{common.continueShopping}</ButtonLink>
      </div>
    </ShopChrome>
  );
}
