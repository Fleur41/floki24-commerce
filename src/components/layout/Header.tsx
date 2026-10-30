import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { mainMenu } from "@/content/navigation";
import { site } from "@/content/site";
import { getProductTypes } from "@/lib/shopify/products";
import { CartLink, CartLinkFallback } from "@/components/cart/CartLink";
import { UserIcon } from "@/components/ui/icons";
import { MainNav } from "./MainNav";
import { MobileMenu } from "./MobileMenu";
import { SearchForm } from "./search/SearchForm";
import styles from "./Header.module.css";

export async function Header() {
  const productTypes = await getProductTypes();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <MobileMenu menu={mainMenu} className={styles.menuToggle} />

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
            <span className={styles.accountLabel}>Anmelden</span>
          </Link>
          <Suspense fallback={<CartLinkFallback />}>
            <CartLink />
          </Suspense>
        </div>
      </div>

      <MainNav menu={mainMenu} />
    </header>
  );
}
