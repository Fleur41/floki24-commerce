import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPage } from "@/lib/shopify/content";
import { RichTextPage } from "@/components/ui/RichTextPage";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/pages/[handle]">): Promise<Metadata> {
  const page = await getPage((await params).handle);
  if (!page) return {};

  return { title: page.seo.title || page.title, description: page.seo.description || undefined };
}

export default function ContentPage({ params }: PageProps<"/[lang]/pages/[handle]">) {
  return (
    <div className="container">
      <Suspense>
        <PageContent params={params} />
      </Suspense>
    </div>
  );
}

async function PageContent({ params }: Pick<PageProps<"/[lang]/pages/[handle]">, "params">) {
  const page = await getPage((await params).handle);
  if (!page) notFound();

  return <RichTextPage title={page.title} html={page.body} />;
}
