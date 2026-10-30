import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/i18n/server";
import type { CategoryList as CategoryListContent } from "@/content/home";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./CategoryList.module.css";

type CategoryListProps = {
  list: CategoryListContent;
};

/** Round category images with gold captions and a "Jetzt Entdecken" button. */
export async function CategoryList({ list }: CategoryListProps) {
  const { home } = await getDictionary();
  return (
    <section className={`container ${styles.section}`} aria-label={list.title ?? home.categories}>
      {list.title && <SectionHeading>{list.title}</SectionHeading>}

      <ul className={styles.list}>
        {list.items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={styles.item}>
              <span className={styles.imageWrapper}>
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 720px) 20vw, 50vw"
                  className={styles.image}
                />
              </span>
              <span className={styles.title}>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.cta}>
        <ButtonLink href={list.cta.href}>{list.cta.title}</ButtonLink>
      </div>
    </section>
  );
}
