import { PageHeader } from "./PageHeader";
import styles from "./RichTextPage.module.css";
import { demoteHeadings } from "@/lib/html";

type RichTextPageProps = {
  title: string;
  /** Merchant-authored HTML from the Shopify admin. */
  html: string;
};

/** Layout for CMS pages and shop policies. */
export function RichTextPage({ title, html }: RichTextPageProps) {
  return (
    <div className={styles.page}>
      <PageHeader title={title} />
      <div className="rte" dangerouslySetInnerHTML={{ __html: demoteHeadings(html) }} />
    </div>
  );
}
