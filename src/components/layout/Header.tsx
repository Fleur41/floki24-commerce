import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { mainMenu } from "@/content/navigation";
import { localizeContent } from "@/content/translations";
import { getDictionary, getLocale } from "@/i18n/server";
import { site } from "@/content/site";
import { getProductTypes } from "@/lib/shopify/products";
import { CartLink, CartLinkFallback } from "@/components/cart/CartLink";
import { UserIcon } from "@/components/ui/icons";
import { MainNav } from "./MainNav";
import { MobileMenu } from "./MobileMenu";
import { SearchForm } from "./search/SearchForm";
import { StickyHeader } from "./StickyHeader";
import styles from "./Header.module.css";

export async function Header() {
  const [productTypes, { header }, locale] = await Promise.all([
    getProductTypes(),
    getDictionary(),
    getLocale(),
  ]);
  const menu = localizeContent(mainMenu, locale);

  return (
    <StickyHeader
      className={styles.header}
      bar={
        <div className={`container ${styles.bar}`}>
          <MobileMenu menu={menu} className={styles.menuToggle} />

          <Link href="/" className={styles.logo}>
            <Image src={site.logo} alt={site.name} width={150} height={60} loading="eager" />
          </Link>

          <SearchForm
            productTypes={productTypes}
            className={styles.search}
            toggleClassName={styles.searchToggle}
          />

          <div className={styles.actions}>
            <Link href="/account" className={styles.account}>
              <UserIcon />
              <span className={styles.accountLabel}>{header.login}</span>
            </Link>
            <Suspense fallback={<CartLinkFallback />}>
              <CartLink />
            </Suspense>
          </div>
        </div>
      }
      nav={<MainNav menu={menu} />}
    />
  );
}
