"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { useDictionary } from "@/i18n/client";
import styles from "./ProductListing.module.css";

type View = "grid" | "list";

const STORAGE_KEY = "listing-view";
const VIEW_CHANGE_EVENT = "listing-view-change";

/** The choice is remembered across listings, like the reference theme. */
function subscribe(onChange: () => void) {
  window.addEventListener(VIEW_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(VIEW_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

const readView = (): View => (localStorage.getItem(STORAGE_KEY) === "list" ? "list" : "grid");

function setView(view: View) {
  localStorage.setItem(STORAGE_KEY, view);
  window.dispatchEvent(new Event(VIEW_CHANGE_EVENT));
}

type ListingLayoutProps = {
  /** Sort select, on the left of the toolbar. */
  sort: ReactNode;
  children: ReactNode;
};

/** Listing toolbar with the "View as" grid/list switch, and the product list it controls. */
export function ListingLayout({ sort, children }: ListingLayoutProps) {
  const { listing } = useDictionary();
  const view = useSyncExternalStore(subscribe, readView, () => "grid" as const);

  return (
    <>
      <div className={styles.toolbar}>
        {sort}
        <div className={styles.viewAs} role="group" aria-label={listing.viewAs}>
          <span aria-hidden>{listing.viewAs}</span>
          <button
            type="button"
            className={styles.viewButton}
            aria-label={listing.gridView}
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
          >
            <GridIcon />
          </button>
          <button
            type="button"
            className={styles.viewButton}
            aria-label={listing.listView}
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            <ListIcon />
          </button>
        </div>
      </div>
      <div data-view={view}>{children}</div>
    </>
  );
}

function GridIcon() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M1 1h7v7H1zM12 1h7v7h-7zM1 12h7v7H1zM12 12h7v7h-7z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M1 2.5h3M1 10h3M1 17.5h3M7 2.5h12M7 10h12M7 17.5h12"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
