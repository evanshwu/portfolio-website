import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <section className="container-page py-24">
      <p className="text-accent font-mono text-xs tracking-[0.2em] uppercase">
        Projects
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        Selected work
      </h1>
      <p className="text-muted-foreground mt-5 max-w-xl text-lg leading-relaxed">
        Coming soon. The projects index is being rebuilt and will land here
        shortly.
      </p>
    </section>
  );
}
