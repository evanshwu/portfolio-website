import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { getPageBySlug, getPageSlugs } from "@/lib/content";
import { loadMdxBody } from "@/lib/mdx";
import { pageMetadata } from "@/lib/seo";

// Top-level routes backed by content/pages/*.mdx (e.g. /about, /uses). Static
// routes such as `/`, `/projects`, and `/projects/[slug]` take precedence over
// this dynamic segment, so it never shadows them; unknown slugs 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPageSlugs().map((slug) => ({ slug }));
}

type StandalonePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: StandalonePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  return pageMetadata({
    title: page.title,
    description: page.summary ?? siteConfig.description,
    path: `/${page.slug}`,
  });
}

export default async function StandalonePage({ params }: StandalonePageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  const Body = await loadMdxBody("pages", slug);

  return (
    <article className="container-page py-16 sm:py-20">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {page.title}
      </h1>
      {page.summary ? (
        <p className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed">
          {page.summary}
        </p>
      ) : null}
      <div className="border-border mt-10 border-t pt-2">
        <Body />
      </div>
    </article>
  );
}
