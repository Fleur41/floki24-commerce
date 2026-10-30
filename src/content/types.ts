/**
 * Content that a Shopify theme keeps in its section settings (menus, banners,
 * homepage blocks). It lives in typed modules so it is reviewable in code and
 * easy to move to a CMS or metaobjects later.
 */

export type MenuItem = {
  title: string;
  /** Omitted for column headings that only group child links. */
  href?: string;
  items?: MenuItem[];
};

export type ContentLink = {
  title: string;
  href: string;
};

export type ImageLink = ContentLink & {
  image: string;
};
