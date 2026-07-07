import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { formatDate, getProjectBySlug, getProjectSlugs } from "@/lib/content";
import { loadMdxBody } from "@/lib/mdx";

// Only the slugs backed by a real MDX file are rendered; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      images: project.coverImage ? [project.coverImage] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const Body = await loadMdxBody("projects", slug);

  return (
    <article className="container-page py-16 sm:py-20">
      <Link
        href="/projects"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        Projects
      </Link>

      <header className="mt-8">
        {project.coverImage ? (
          <div className="border-border relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-xl border">
            <Image
              src={project.coverImage}
              alt={`${project.title} cover image`}
              fill
              preload
              sizes="(min-width: 56rem) 56rem, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {project.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          <time
            dateTime={project.date}
            className="text-muted-foreground font-mono text-xs"
          >
            {formatDate(project.date)}
          </time>
          {project.tech.length > 0 ? (
            <>
              <span aria-hidden className="text-border">
                •
              </span>
              <ul className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <li
                    key={tech}
                    className="border-border bg-surface text-muted-foreground rounded-md border px-2 py-0.5 font-mono text-xs"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        <p className="text-muted-foreground mt-5 max-w-2xl text-lg leading-relaxed">
          {project.summary}
        </p>
      </header>

      <div className="border-border mt-10 border-t pt-2">
        <Body />
      </div>

      {project.links && (project.links.github || project.links.demo) ? (
        <footer className="border-border mt-12 flex flex-wrap gap-3 border-t pt-8">
          {project.links.github ? (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors"
            >
              <svg
                viewBox="0 0 16 16"
                className="size-4"
                fill="currentColor"
                aria-hidden
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 012-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              View source
            </a>
          ) : null}
          {project.links.demo ? (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-accent-foreground inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
            >
              Live demo
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M7 17L17 7M8 7h9v9" />
              </svg>
            </a>
          ) : null}
        </footer>
      ) : null}
    </article>
  );
}
