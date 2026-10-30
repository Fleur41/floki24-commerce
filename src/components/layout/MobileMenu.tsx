"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { MenuItem } from "@/content/types";
import { useDictionary } from "@/i18n/client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  MenuIcon,
  UserIcon,
} from "@/components/ui/icons";
import styles from "./MobileMenu.module.css";

type MobileMenuProps = {
  menu: MenuItem[];
  className?: string;
};

/** Off-canvas drill-down menu for small screens, built on the native <dialog>. */
export function MobileMenu({ menu, className }: MobileMenuProps) {
  const { header } = useDictionary();
  const dialogRef = useRef<HTMLDialogElement>(null);
  /** Path of opened submenus, e.g. [Garten & Terrasse, Gartenmöbel]. */
  const [trail, setTrail] = useState<MenuItem[]>([]);

  const current = trail.at(-1);
  const items = current?.items ?? menu;

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  // Start from the top level every time the drawer is reopened.
  useEffect(() => {
    const dialog = dialogRef.current;
    const reset = () => setTrail([]);
    dialog?.addEventListener("close", reset);
    return () => dialog?.removeEventListener("close", reset);
  }, []);

  return (
    <>
      <button type="button" className={`${styles.toggle} ${className ?? ""}`} onClick={open}>
        <MenuIcon />
        <span className="visually-hidden">{header.menu}</span>
      </button>

      <dialog
        ref={dialogRef}
        className={styles.drawer}
        aria-label={header.menu}
        onClick={(event) => event.target === event.currentTarget && close()}
      >
        <div className={styles.panel}>
          <div className={styles.header}>
            {current ? (
              <button
                type="button"
                className={styles.back}
                onClick={() => setTrail(trail.slice(0, -1))}
              >
                <ChevronLeftIcon />
                {current.title}
              </button>
            ) : (
              <span className={styles.heading}>{header.menu}</span>
            )}
            <button
              type="button"
              className={styles.close}
              onClick={close}
              aria-label={header.closeMenu}
            >
              <CloseIcon />
            </button>
          </div>

          <ul className={styles.list}>
            {current?.href && (
              <li>
                <Link href={current.href} className={styles.item} onClick={close}>
                  {header.showAll}
                </Link>
              </li>
            )}
            {items.map((item) =>
              item.items?.length ? (
                <li key={item.title}>
                  <button
                    type="button"
                    className={styles.item}
                    onClick={() => setTrail([...trail, item])}
                  >
                    {item.title}
                    <ChevronRightIcon />
                  </button>
                </li>
              ) : (
                item.href && (
                  <li key={item.title}>
                    <Link href={item.href} className={styles.item} onClick={close}>
                      {item.title}
                    </Link>
                  </li>
                )
              ),
            )}
          </ul>

          {!current && (
            <Link href="/account" className={styles.account} onClick={close}>
              <UserIcon />
              {header.login}
            </Link>
          )}
        </div>
      </dialog>
    </>
  );
}
