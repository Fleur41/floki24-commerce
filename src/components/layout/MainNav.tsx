"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { MenuItem } from "@/content/types";
import { ChevronDownIcon } from "@/components/ui/icons";
import styles from "./MainNav.module.css";

/** Delay before a hovered menu closes, so moving the pointer diagonally into the panel works. */
const CLOSE_DELAY_MS = 150;

type MainNavProps = {
  menu: MenuItem[];
};

/** Desktop navigation with full-width mega menu panels. */
export function MainNav({ menu }: MainNavProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const navRef = useRef<HTMLElement>(null);

  const open = (index: number) => {
    clearTimeout(closeTimer.current);
    setOpenIndex(index);
  };
  const close = () => setOpenIndex(null);
  const scheduleClose = () => {
    closeTimer.current = setTimeout(close, CLOSE_DELAY_MS);
  };

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

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  return (
    <nav ref={navRef} className={styles.nav} aria-label="Hauptmenü" onMouseLeave={scheduleClose}>
      <div className="container">
        <ul className={styles.list}>
          {menu.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `mega-menu-${index}`;

            return (
              <li key={item.title} onMouseEnter={() => open(index)}>
                <button
                  type="button"
                  className={styles.trigger}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => (isOpen ? close() : open(index))}
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
