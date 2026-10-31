"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type StickyHeaderProps = {
  className: string;
  /** Logo, search and actions: the row that stays visible while scrolling. */
  bar: ReactNode;
  /** Category navigation: scrolls away with the page. */
  nav: ReactNode;
};

/**
 * Like the reference shop, only the logo/search row sticks to the top. Once the
 * category navigation has scrolled out of view the header switches to its
 * compact state (`data-compact`), which shows a menu button in its place.
 * Letting the navigation scroll away, instead of hiding it, avoids any jump.
 */
export function StickyHeader({ className, bar, nav }: StickyHeaderProps) {
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [isCompact, setCompact] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const header = headerRef.current?.getBoundingClientRect();
        const navigation = navRef.current?.getBoundingClientRect();
        if (header && navigation) setCompact(navigation.bottom <= header.bottom);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      <header ref={headerRef} className={className} data-compact={isCompact}>
        {bar}
      </header>
      <div ref={navRef}>{nav}</div>
    </>
  );
}
