"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { MenuItem } from "@/content/types";
import { useDictionary } from "@/i18n/client";
import { ChevronDownIcon } from "@/components/ui/icons";
import styles from "./MainNav.module.css";

type MainNavProps = {
  menu: MenuItem[];
};

/** Desktop navigation with full-width mega menu panels that open on click. */
export function MainNav({ menu }: MainNavProps) {
  const { header } = useDictionary();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const close = () => setOpenIndex(null);

  useEffect(() => {
    if (openIndex === null) return;

    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && close();
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [openIndex]);

  return (
    <nav ref={navRef} className={styles.nav} aria-label={header.mainMenu}>
      <div className="container">
        <ul className={styles.list}>
          {menu.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `mega-menu-${index}`;

            return (
              <li key={item.title}>
                <button
                  type="button"
                  className={styles.trigger}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  {item.title}
                  <ChevronDownIcon className={styles.chevron} />
                </button>

                <div id={panelId} className={styles.panel} hidden={!isOpen}>
                  <ul className={`container ${styles.columns}`}>
                    {item.items?.map((column) => (
                      <li key={column.title} className={styles.column}>
                        <MenuLink item={column} className={styles.columnTitle} onNavigate={close} />
                        {column.items && (
                          <ul className={styles.links}>
                            {column.items.map((link) => (
                              <li key={link.title}>
                                <MenuLink item={link} className={styles.link} onNavigate={close} />
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

type MenuLinkProps = {
  item: MenuItem;
  className: string;
  onNavigate: () => void;
};

function MenuLink({ item, className, onNavigate }: MenuLinkProps) {
  if (!item.href) return <span className={className}>{item.title}</span>;

  return (
    <Link href={item.href} className={className} onClick={onNavigate}>
      {item.title}
    </Link>
  );
}
