import Link from "next/link";

import { formatDate, type Project } from "@/lib/content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group border-border bg-surface/40 hover:border-accent/60 hover:bg-surface relative flex h-full w-full flex-col rounded-xl border p-6 transition-colors"
    >
      {project.featured ? (
        <span className="border-accent/40 text-accent bg-accent/10 absolute top-5 right-5 rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] tracking-wide uppercase">
          Featured
        </span>
      ) : null}

      <time
        dateTime={project.date}
        className="text-muted-foreground font-mono text-xs"
      >
        {formatDate(project.date)}
      </time>

      <h2 className="group-hover:text-accent mt-3 pr-20 text-lg font-semibold tracking-tight transition-colors">
        {project.title}
      </h2>

      <p className="text-muted-foreground mt-2 leading-relaxed">
        {project.summary}
      </p>

      {project.tech.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <li
              key={tech}
              className="border-border bg-background text-muted-foreground rounded-md border px-2 py-0.5 font-mono text-xs"
            >
              {tech}
            </li>
          ))}
        </ul>
      ) : null}

      <span className="text-accent mt-5 inline-flex items-center gap-1 text-sm font-medium">
        View project
        <svg
          viewBox="0 0 24 24"
          className="size-4 transition-transform group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
