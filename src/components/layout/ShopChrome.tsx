import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { TopBar } from "./TopBar";

/** Top bar, header and footer around the storefront pages (everything except checkout). */
export function ShopChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <TopBar />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
