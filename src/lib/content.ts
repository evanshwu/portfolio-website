import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

// Server-only content layer. Reads MDX collections from the repo-root
// `content/` directory, validates frontmatter at build time, and exposes a
// small typed API. Rendering the MDX *body* is handled by the route via a
// dynamic import of the same file; here we only read the frontmatter DATA.

const CONTENT_DIR = path.join(process.cwd(), "content");
const PROJECTS_DIR = path.join(CONTENT_DIR, "projects");
const PAGES_DIR = path.join(CONTENT_DIR, "pages");

export type ProjectLinks = {
  github?: string;
  demo?: string;
};

export type ProjectFrontmatter = {
  title: string;
  summary: string;
  /** ISO date string, e.g. "2024-05-01". */
  date: string;
  tech: string[];
  coverImage?: string;
  links?: ProjectLinks;
  featured?: boolean;
};

export type Project = ProjectFrontmatter & { slug: string };

export type PageFrontmatter = {
  title: string;
  summary?: string;
};

export type PageDoc = PageFrontmatter & { slug: string };

const MDX_EXTENSION = ".mdx";

function fail(file: string, message: string): never {
  throw new Error(`Invalid frontmatter in ${file}: ${message}`);
}

/** Turn a repo-absolute path into a repo-relative one for readable errors. */
function relative(file: string) {
  return path.relative(process.cwd(), file);
}

function readSlugs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(MDX_EXTENSION))
    .map((name) => name.slice(0, -MDX_EXTENSION.length))
    .sort();
}

function readFrontmatter(file: string): Record<string, unknown> {
  const raw = fs.readFileSync(file, "utf8");
  const { data } = matter(raw);
  return data as Record<string, unknown>;
}

function requireString(
  file: string,
  data: Record<string, unknown>,
  field: string,
): string {
  const value = data[field];
  if (typeof value !== "string" || value.trim() === "") {
    fail(file, `missing or empty required field "${field}" (expected string)`);
  }
  return value;
}

function optionalString(
  file: string,
  data: Record<string, unknown>,
  field: string,
): string | undefined {
  const value = data[field];
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") {
    fail(file, `field "${field}" must be a string`);
  }
  return value;
}

function requireStringArray(
  file: string,
  data: Record<string, unknown>,
  field: string,
): string[] {
  const value = data[field];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    fail(file, `field "${field}" must be an array of strings`);
  }
  return value as string[];
}

function requireIsoDate(
  file: string,
  data: Record<string, unknown>,
  field: string,
): string {
  // gray-matter parses unquoted YAML dates into Date objects; accept both a
  // Date and an ISO string, and reject anything that is not a real date.
  const value = data[field];
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  // A quoted YAML date stays a string. Require the exact ISO `YYYY-MM-DD`
  // shape (not just anything Date.parse tolerates): the value is sorted with
  // localeCompare and rendered into `<time dateTime>`, both of which break on
  // a free-form string like "May 1, 2024". The Date.parse guard additionally
  // rejects well-shaped but impossible dates (e.g. 2024-13-45).
  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value))
  ) {
    return value;
  }
  fail(
    file,
    `missing or invalid required field "${field}" (expected a date like 2024-05-01)`,
  );
}

function parseLinks(
  file: string,
  data: Record<string, unknown>,
): ProjectLinks | undefined {
  const value = data.links;
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "object" || Array.isArray(value)) {
    fail(file, `field "links" must be an object with optional github/demo`);
  }
  const record = value as Record<string, unknown>;
  const links: ProjectLinks = {};
  for (const key of ["github", "demo"] as const) {
    const url = record[key];
    if (url === undefined || url === null) continue;
    if (typeof url !== "string") {
      fail(file, `field "links.${key}" must be a string`);
    }
    links[key] = url;
  }
  return Object.keys(links).length > 0 ? links : undefined;
}

function parseProject(slug: string, file: string): Project {
  const data = readFrontmatter(file);
  const featured = data.featured;
  if (featured !== undefined && typeof featured !== "boolean") {
    fail(file, `field "featured" must be a boolean`);
  }
  return {
    slug,
    title: requireString(file, data, "title"),
    summary: requireString(file, data, "summary"),
    date: requireIsoDate(file, data, "date"),
    tech: requireStringArray(file, data, "tech"),
    coverImage: optionalString(file, data, "coverImage"),
    links: parseLinks(file, data),
    featured: featured === true,
  };
}

function parsePage(slug: string, file: string): PageDoc {
  const data = readFrontmatter(file);
  return {
    slug,
    title: requireString(file, data, "title"),
    summary: optionalString(file, data, "summary"),
  };
}

export function getProjectSlugs(): string[] {
  return readSlugs(PROJECTS_DIR);
}

export function getProjectBySlug(slug: string): Project {
  const file = path.join(PROJECTS_DIR, `${slug}${MDX_EXTENSION}`);
  if (!fs.existsSync(file)) {
    throw new Error(`No project found for slug "${slug}" (${relative(file)})`);
  }
  return parseProject(slug, file);
}

export function getAllProjects(): Project[] {
  return getProjectSlugs()
    .map((slug) =>
      parseProject(slug, path.join(PROJECTS_DIR, `${slug}${MDX_EXTENSION}`)),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPageSlugs(): string[] {
  return readSlugs(PAGES_DIR);
}

export function getPageBySlug(slug: string): PageDoc {
  const file = path.join(PAGES_DIR, `${slug}${MDX_EXTENSION}`);
  if (!fs.existsSync(file)) {
    throw new Error(`No page found for slug "${slug}" (${relative(file)})`);
  }
  return parsePage(slug, file);
}

/** Human-readable date for display, rendered in UTC to avoid timezone drift. */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}
