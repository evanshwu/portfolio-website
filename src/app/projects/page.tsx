import type { Metadata } from "next";

import { ProjectCard } from "@/components/project-card";
import { getAllProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected projects and engineering work by Evan Wu.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <section className="container-page py-20 sm:py-24">
      <p className="text-accent font-mono text-xs tracking-[0.2em] uppercase">
        Projects
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        Selected work
      </h1>
      <p className="text-muted-foreground mt-5 max-w-xl text-lg leading-relaxed">
        Things I&apos;ve designed, built, and shipped — from Raspberry Pi
        hardware hacks to full-stack web apps.
      </p>

      {projects.length > 0 ? (
        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {projects.map((project) => (
            <li key={project.slug} className="flex">
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground border-border mt-12 rounded-xl border border-dashed p-8 text-center">
          No projects yet — check back soon.
        </p>
      )}
    </section>
  );
}
