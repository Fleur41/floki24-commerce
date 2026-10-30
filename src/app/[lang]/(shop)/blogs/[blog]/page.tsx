import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getBlog } from "@/lib/shopify/content";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { PageHeader } from "@/components/ui/PageHeader";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/blogs/[blog]">): Promise<Metadata> {
  const blog = await getBlog((await params).blog);
  return blog ? { title: blog.title } : {};
}

export default function BlogPage({ params }: PageProps<"/[lang]/blogs/[blog]">) {
  return (
    <div className="container">
      <Suspense>
        <BlogContent params={params} />
      </Suspense>
    </div>
  );
}

async function BlogContent({ params }: Pick<PageProps<"/[lang]/blogs/[blog]">, "params">) {
  const blog = await getBlog((await params).blog);
  if (!blog) notFound();

  return (
    <>
      <PageHeader title={blog.title} />
      <ul className={styles.list}>
        {blog.articles.map((article) => (
          <li key={article.id}>
            <ArticleCard article={article} />
          </li>
        ))}
      </ul>
    </>
  );
}
