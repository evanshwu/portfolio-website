import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getAllProjects, getPageSlugs } from "@/lib/content";

// Built from the same content collections the routes render, so adding a new
// MDX file surfaces it in the sitemap with zero edits here. Fully static: no
// request-time APIs, so `next build` prerenders it to sitemap.xml.

// Trim any trailing slash so the root entry is `https://host` (matching the
// canonical URLs) rather than `https://host/`.
const BASE = siteConfig.url.replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getAllProjects();
  // Newest project date stands in as the "content last changed" signal for the
  // listing routes; falls back to now when there are no projects yet.
  const latest = projects[0]?.date ?? new Date().toISOString().slice(0, 10);

  const listing: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: latest,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE}/projects`,
      lastModified: latest,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE}/projects/${project.slug}`,
    lastModified: project.date,
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  const standalonePages: MetadataRoute.Sitemap = getPageSlugs().map((slug) => ({
    url: `${BASE}/${slug}`,
    lastModified: latest,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...listing, ...projectPages, ...standalonePages];
}
