import Link from "next/link";
import { getBlog } from "@/lib/shopify/content";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { ChevronRightIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./BlogPosts.module.css";

type BlogPostsProps = {
  title: string;
  blogHandle: string;
  articleCount: number;
};

/** Latest articles of a blog. Renders nothing if the blog is missing or empty. */
export async function BlogPosts({ title, blogHandle, articleCount }: BlogPostsProps) {
  const blog = await getBlog(blogHandle, articleCount);
  if (!blog?.articles.length) return null;

  return (
    <section className={`container ${styles.section}`} aria-labelledby="blog-posts-title">
      <SectionHeading id="blog-posts-title">{title}</SectionHeading>
      <ul className={styles.list}>
        {blog.articles.map((article) => (
          <li key={article.id}>
            <ArticleCard article={article} />
          </li>
        ))}
      </ul>
      <Link href={`/blogs/${blog.handle}`} className={styles.more}>
        Mehr anzeigen
        <ChevronRightIcon />
      </Link>
    </section>
  );
}
