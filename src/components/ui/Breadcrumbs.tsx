import Link from "next/link";
import styles from "./Breadcrumbs.module.css";

type BreadcrumbsProps = {
  /** Trail after "Home"; the last entry is the current page. */
  items: { title: string; href?: string }[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const trail = [{ title: "Home", href: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      <ol className={styles.list}>
        {trail.map((item, index) => {
          const isCurrent = index === trail.length - 1;
          return (
            <li key={`${item.title}-${index}`}>
              {item.href && !isCurrent ? (
                <Link href={item.href}>{item.title}</Link>
              ) : (
                <span aria-current={isCurrent ? "page" : undefined}>{item.title}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
