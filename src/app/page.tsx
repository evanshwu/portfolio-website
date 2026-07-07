import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ProjectCard } from "@/components/project-card";
import { siteConfig } from "@/config/site";
import { getAllProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  titleOverride: `${siteConfig.fullName} — Software Engineer`,
  description:
    "Software engineer with a master's from Carnegie Mellon, building reliable software across the stack — from Raspberry Pi and IoT hardware to web and cloud back-ends.",
  path: "/",
});

const experience = [
  {
    period: "2019 – 2020",
    role: "Master's, Software Management",
    org: "Carnegie Mellon University",
    location: "Mountain View, CA",
  },
  {
    period: "2019",
    role: "Research Assistant",
    org: "Academia Sinica",
    location: "Taipei, Taiwan",
  },
  {
    period: "2018",
    role: "Software Developer Intern",
    org: "DHL Express",
    location: "Taipei, Taiwan",
  },
  {
    period: "2014 – 2018",
    role: "Bachelor's, Information Science",
    org: "National Chung Cheng University",
    location: "Chiayi, Taiwan",
  },
];

const skillGroups = [
  {
    title: "Languages",
    items: [
      "Java",
      "Python",
      "C / C++",
      "JavaScript",
      "PHP",
      "Scala",
      "Kotlin",
    ],
  },
  {
    title: "Databases",
    items: ["MySQL", "Oracle", "MariaDB", "MongoDB", "HBase", "Neo4j"],
  },
  {
    title: "Cloud & Frameworks",
    items: [
      "AWS",
      "GCP",
      "Azure",
      "Spring",
      "Vert.x",
      "Struts 2",
      "Pandas",
      "GeoPandas",
      "Matplotlib",
    ],
  },
  {
    title: "Practices",
    items: ["Agile", "Scrumban", "Kanban", "Git", "SVN"],
  },
];

export default function Home() {
  const projects = getAllProjects();
  const teaser = [
    ...projects.filter((project) => project.featured),
    ...projects.filter((project) => !project.featured),
  ].slice(0, 2);

  return (
    <>
      {/* Hero */}
      <section className="container-page pt-20 pb-16 sm:pt-28 sm:pb-20">
        <p className="text-accent font-mono text-xs tracking-[0.2em] uppercase">
          Software Engineer
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          {siteConfig.fullName}
        </h1>
        <p className="text-muted-foreground mt-5 max-w-2xl text-lg leading-relaxed">
          Innovation-driven software engineer with a master&apos;s in Software
          Management from Carnegie Mellon. I build reliable software across the
          stack — from Raspberry Pi and IoT hardware to web and cloud back-ends.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={siteConfig.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-accent-foreground inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
          >
            View resume
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
          <Link
            href="/projects"
            className="border-border hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors"
          >
            View projects
          </Link>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-border border-t">
        <div className="container-page py-16 sm:py-20">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
            <Image
              src="/me.jpg"
              alt="Portrait of Hsin-Han (Evan) Wu"
              width={600}
              height={599}
              className="border-border size-32 shrink-0 rounded-full border object-cover sm:size-40"
            />
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                About
              </h2>
              <p className="text-muted-foreground mt-5 leading-relaxed">
                I&apos;m a software engineer who cares about getting the details
                right. I hold a master&apos;s in Software Management from
                Carnegie Mellon University. Before CMU, I worked as a research
                assistant at Academia Sinica, where I built a Bluetooth tracking
                bracelet from scratch for an indoor-navigation system — deployed
                at major sites including NTU Hospital and Taipei City Hall,
                serving over 1 million patients and visitors each year.
              </p>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                As a Software Developer Intern at DHL Taipei, I shipped a web
                application a month ahead of schedule that cut the cost of
                handling over 1,000 support calls, and re-engineered an invoice
                service with multi-threading to eliminate more than 80% of its
                execution time. I especially enjoy building innovation projects
                with emerging technology — my smart-home research has been cited
                by scholars worldwide and deployed across organizations, with
                both industrial and academic impact on the Internet of Things.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-muted-foreground font-mono text-xs tracking-[0.2em] uppercase">
              Experience &amp; Education
            </h3>
            <ul className="mt-6 space-y-5">
              {experience.map((item) => (
                <li
                  key={`${item.period}-${item.org}`}
                  className="flex flex-col gap-1 sm:flex-row sm:gap-6"
                >
                  <span className="text-muted-foreground w-28 shrink-0 font-mono text-xs">
                    {item.period}
                  </span>
                  <div>
                    <p className="text-foreground font-medium">{item.role}</p>
                    <p className="text-muted-foreground text-sm">
                      {item.org} · {item.location}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="border-border bg-surface/40 border-t">
        <div className="container-page py-16 sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Skills
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {skillGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-muted-foreground font-mono text-xs tracking-[0.2em] uppercase">
                  {group.title}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="border-border bg-background text-muted-foreground rounded-md border px-2.5 py-1 font-mono text-xs"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects teaser */}
      {teaser.length > 0 ? (
        <section className="border-border border-t">
          <div className="container-page py-16 sm:py-20">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Projects
              </h2>
              <Link
                href="/projects"
                className="text-accent inline-flex items-center gap-1 text-sm font-medium"
              >
                View all
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
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {teaser.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
