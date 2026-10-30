import type { ReactNode } from "react";
import type { ContentLink } from "@/content/types";
import { Breadcrumbs } from "./Breadcrumbs";
import styles from "./PageHeader.module.css";

type PageHeaderProps = {
  /** Current page in the breadcrumb trail; also the heading unless `heading` is set. */
  title: string;
  heading?: ReactNode;
  /** Pages between "Home" and the current page. */
  parents?: ContentLink[];
};

export function PageHeader({ title, heading, parents = [] }: PageHeaderProps) {
  return (
    <>
      <Breadcrumbs items={[...parents, { title }]} />
      <h1 className={styles.heading}>{heading ?? title}</h1>
    </>
  );
}
