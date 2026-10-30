import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPolicy } from "@/lib/shopify/content";
import { RichTextPage } from "@/components/ui/RichTextPage";

export async function generateMetadata({
  params,
}: PageProps<"/policies/[handle]">): Promise<Metadata> {
  const policy = await getPolicy((await params).handle);
  return policy ? { title: policy.title } : {};
}

export default function PolicyPage({ params }: PageProps<"/policies/[handle]">) {
  return (
    <div className="container">
      <Suspense>
        <PolicyContent params={params} />
      </Suspense>
    </div>
  );
}

async function PolicyContent({ params }: Pick<PageProps<"/policies/[handle]">, "params">) {
  const policy = await getPolicy((await params).handle);
  if (!policy) notFound();

  return <RichTextPage title={policy.title} html={policy.body} />;
}
