import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getDictionary } from "@/i18n/server";
import { formatDate } from "@/lib/format";
import { getArticle } from "@/lib/shopify/content";
import { PageHeader } from "@/components/ui/PageHeader";
import styles from "./page.module.css";

type ArticlePageProps = PageProps<"/[lang]/blogs/[blog]/[article]">;

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { blog, article: handle } = await params;
  const article = await getArticle(blog, handle);
  if (!article) return {};

  return {
    title: article.seo.title || article.title,
    description: article.seo.description || article.excerpt || undefined,
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  return (
    <div className="container">
      <Suspense>
        <ArticleContent params={params} />
      </Suspense>
    </div>
  );
}

async function ArticleContent({ params }: Pick<ArticlePageProps, "params">) {
  const { blog, article: handle } = await params;
  const [article, dictionary] = await Promise.all([getArticle(blog, handle), getDictionary()]);
  if (!article) notFound();

  return (
    <article className={styles.article}>
      <PageHeader
        title={article.title}
        parents={[{ title: dictionary.blog.news, href: `/blogs/${blog}` }]}
      />
      <p className={styles.meta}>
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        {article.authorName && ` · ${article.authorName}`}
      </p>
      {article.image && (
        <Image
          src={article.image.url}
          alt={article.image.altText ?? ""}
          width={article.image.width}
          height={article.image.height}
          sizes="(min-width: 860px) 800px, 100vw"
          className={styles.image}
          preload
        />
      )}
      <div className="rte" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
    </article>
  );
}
