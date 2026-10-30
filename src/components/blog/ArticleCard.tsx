import Image from "next/image";
import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/server";
import { formatDate } from "@/lib/format";
import type { Article } from "@/lib/shopify/types";
import styles from "./ArticleCard.module.css";

type ArticleCardProps = {
  article: Article;
};

export async function ArticleCard({ article }: ArticleCardProps) {
  const [{ common }, locale] = await Promise.all([getDictionary(), getLocale()]);
  const href = `/blogs/${article.blogHandle}/${article.handle}`;

  return (
    <article className={styles.card}>
      {article.image && (
        <div className={styles.media}>
          <Image
            src={article.image.url}
            alt={article.image.altText ?? ""}
            fill
            sizes="(min-width: 720px) 33vw, 100vw"
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.body}>
        <p className={styles.meta}>
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time>
          {article.authorName && <span>{article.authorName}</span>}
        </p>
        <h3 className={styles.title}>
          <Link href={href}>{article.title}</Link>
        </h3>
        {article.excerpt && <p className={styles.excerpt}>{article.excerpt}</p>}
        <span className={styles.readMore} aria-hidden>
          {common.readNow}
        </span>
      </div>
    </article>
  );
}
