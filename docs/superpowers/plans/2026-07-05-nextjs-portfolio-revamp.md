# Portfolio Website Revamp — Next.js Migration Plan

> **For agentic workers (Opus/Sonnet):** This is a **high-level plan by design**. Expand each phase into detailed, bite-sized tasks before executing it (use `superpowers:writing-plans` to expand a phase, then `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement). Phases use checkbox (`- [ ]`) syntax for tracking. Complete and verify each phase before starting the next.

**Goal:** Replace the current static Bootstrap/jQuery portfolio (served from EC2 + nginx, deployed by SSH + `git pull`) with a modern, professional Next.js site where adding a page is dropping in one content file, and deploying is `git push`.

**Architecture:** Next.js (App Router) + TypeScript + Tailwind CSS, statically generated. Project pages and other content live as MDX files in a `content/` directory; routes, navigation, and the projects index are derived from them automatically. CI/CD builds and deploys on every push to `master` — no SSH, no nginx commands.

**Tech Stack:** Next.js 15+ (App Router, static export where possible), TypeScript, Tailwind CSS, MDX (via `@next/mdx` or Contentlayer-style content collection), GitHub Actions, Vercel (recommended) or AWS S3 + CloudFront (keep-AWS alternative).

## Current State (verified in repo)

- Static HTML from the Start Bootstrap "Grayscale" theme: Bootstrap 4, jQuery, gulpfile for minification.
- Pages: `index.html` (sections: `#home`, `#about`, `#skills`, `#projects`, `#signup`), `projects.html`, and four project detail pages: `projects/watchdogpi.html`, `projects/kourse.html`, `projects/fridgepi.html`, `projects/chatbot.html`.
- Assets: `img/` (photos, project screenshots, favicons), `publications/low-cost smart refrigerator.pdf`.
- Hosting: AWS EC2 + nginx; deploys are manual (`ssh` → `git pull` → nginx).
- Repo: `github.com/evanshwu/portfolio-website`, default branch `master`.

## Global Constraints

- All existing content (bio, skills, 4 projects, publication PDF, photos) must survive the migration — nothing dropped without an explicit decision.
- Old URLs (`/projects/watchdogpi.html` etc.) must redirect to their new routes; no dead links from search engines or old shares.
- The site must remain a static/pre-rendered site — no server-side runtime, no database, no backend to maintain.
- Adding a new project page must require exactly one new file (an `.mdx` file with frontmatter) and zero code changes.
- Deployment must be fully automatic on push to `master`; the old SSH + `git pull` + nginx workflow is retired at cutover.
- Build the new site on a branch (e.g. `nextjs-revamp`); `master` keeps serving the live site until cutover.
- Lighthouse targets on the finished site: ≥ 95 for Performance, Accessibility, Best Practices, SEO.

## Key Decision (make at Phase 6, doesn't block earlier phases)

**Hosting: Vercel (recommended) vs. stay on AWS.**
- **Vercel (recommended):** connect the GitHub repo once; every push deploys, every PR gets a preview URL. Free hobby tier is sufficient for a portfolio. Point the domain's DNS at Vercel; the EC2 instance can then be shut down (cost savings).
- **Keep AWS:** GitHub Actions builds a static export (`output: 'export'`) and syncs to S3 behind CloudFront (preferred AWS shape — no server to patch), or, as a minimal-change variant, rsyncs the export to the existing EC2/nginx box. Still push-to-deploy, but you own the pipeline and the AWS bill.

Everything through Phase 5 is identical for both options.

---

### Phase 1: Scaffold & Foundations

- [ ] Create branch `nextjs-revamp` from `master`.
- [ ] Scaffold Next.js (App Router) + TypeScript + Tailwind CSS at the repo root; move the legacy site files into `legacy/` (kept for content reference until cutover, then deleted).
- [ ] Add ESLint + Prettier, `npm run dev/build/lint` scripts, and a `README.md` that documents: how to run locally, how to add a project page, how deployment works.
- [ ] Configure static generation (use `output: 'export'` if the AWS/S3 path is likely; plain static prerendering is fine for Vercel).
- [ ] Verify: `npm run dev` serves a placeholder homepage; `npm run build` succeeds cleanly.

**Deliverable:** An empty but building Next.js app on its own branch, with the legacy site preserved.

### Phase 2: Design System & Site Shell

- [ ] Define a small design system with Tailwind: type scale, spacing, a restrained professional palette, dark/light mode. Aim for a clean, modern engineer-portfolio look (generous whitespace, strong typography, subtle motion) — not a heavy template. Consult a design skill (e.g. `frontend-design`) when expanding this phase.
- [ ] Build the shared shell: responsive header nav, footer (GitHub / LinkedIn / email links), and root layout with global metadata.
- [ ] Nav links must be driven by a single site config (one array of `{title, href}`), so adding a page to the nav is a one-line change.
- [ ] Verify: shell renders correctly on mobile and desktop widths; dark/light both legible.

**Deliverable:** A consistent, professional-looking frame every page inherits.

### Phase 3: Content Engine (the "easy to add pages" requirement)

- [ ] Set up MDX content collections: `content/projects/*.mdx` with typed frontmatter (`title`, `summary`, `date`, `tech[]`, `coverImage`, `links{github?, demo?}`, `featured?`).
- [ ] Dynamic route `/projects/[slug]` renders any MDX file with a shared, well-designed project-page template (hero image, tech badges, body, links).
- [ ] `/projects` index page lists all projects from the collection automatically, sorted by date, with cards.
- [ ] Support the same pattern for standalone pages (`content/pages/*.mdx` → top-level routes) so future pages (blog post, talk, publication) are also just files.
- [ ] Verify: creating a dummy `content/projects/test.mdx` makes it appear on the index and at its own URL with zero code edits; deleting it removes it.

**Deliverable:** Adding a page = adding one MDX file. This is the acceptance test for requirement #3.

### Phase 4: Content Migration

- [ ] Port homepage content from `legacy/index.html`: hero (name, title line), about section, skills section (restructure into scannable groups rather than a wall of badges).
- [ ] Rewrite the four project pages (`watchdogpi`, `kourse`, `fridgepi`, `chatbot`) as MDX files, improving the copy into short case-study form: problem → what I built → tech → outcome.
- [ ] Migrate images into the app with `next/image` (optimized, properly sized); migrate the publications PDF and link it from an appropriate section; keep the favicon set.
- [ ] Add a resume/CV link (reuse the existing resume link from the legacy site).
- [ ] **Drop the `#signup` newsletter section** unless there is a real working backend behind it (flag to Evan if in doubt — a dead signup form looks unprofessional).
- [ ] Verify: every piece of legacy content is either migrated or explicitly listed as intentionally dropped.

**Deliverable:** Feature-complete new site with all real content.

### Phase 5: SEO, Performance & Polish

- [ ] Per-page metadata via the Metadata API: titles, descriptions, Open Graph + Twitter cards (project pages use their frontmatter), canonical URLs.
- [ ] Generate `sitemap.xml` and `robots.txt`; add favicon/manifest wiring.
- [ ] Accessibility pass: semantic landmarks, alt text, focus states, color contrast.
- [ ] Run Lighthouse; fix until all four categories ≥ 95.
- [ ] Verify on real mobile viewport sizes and in both color schemes.

**Deliverable:** A site that looks professional to humans and to crawlers/link previews.

### Phase 6: CI/CD & Cutover (retires the SSH + nginx workflow)

- [ ] Make the hosting decision (see Key Decision above). Default to Vercel unless Evan says keep AWS.
- [ ] **If Vercel:** connect repo, set production branch to `master`, verify preview deploys on PRs.
- [ ] **If AWS:** GitHub Actions workflow — on push to `master`: install, build/export, sync to S3 + CloudFront invalidation (or rsync to EC2 as the minimal variant); store credentials as repo secrets.
- [ ] Add redirects from all legacy URLs (`/projects/*.html`, `/projects.html`, `/index.html`) to the new routes (platform redirects on Vercel/CloudFront; nginx rewrite rules only in the EC2 variant).
- [ ] Merge `nextjs-revamp` → `master`; point DNS at the new hosting; confirm HTTPS.
- [ ] Verify production: all pages load, all legacy URLs redirect, OG previews render (paste a link into a chat app to check).

**Deliverable:** `git push` is the entire deployment process. This is the acceptance test for requirement #4.

### Phase 7: Decommission & Document

- [ ] Delete `legacy/`, the gulpfile, and vendor JS/CSS from the repo.
- [ ] If Vercel was chosen: stop nginx and terminate/downsize the EC2 instance **only after Evan confirms** nothing else runs on that box.
- [ ] Update `README.md` with the final add-a-page and deployment instructions; note the hosting setup and where DNS lives.

**Deliverable:** No dead infrastructure, and a repo a future session (or Evan) can operate from the README alone.

---

## Success Criteria (map to Evan's four requirements)

1. **Modern & professional:** clean custom design (no visible Bootstrap-template look), case-study project pages, dark/light mode, Lighthouse ≥ 95 across the board.
2. **Newer technology:** Next.js App Router + TypeScript + Tailwind; Bootstrap, jQuery, and gulp fully removed.
3. **Easy to add pages:** one MDX file = one new page, auto-listed; nav is a one-line config change. Proven by the Phase 3 dummy-file test.
4. **Easy deployment:** push to `master` deploys automatically with no SSH/nginx step. Proven by the Phase 6 production verification.

## Non-Goals (do not expand scope into these without asking)

- No CMS, database, auth, or server runtime.
- No blog engine beyond the MDX page pattern (the pattern makes adding one later trivial).
- No newsletter/signup backend.
- No paid services beyond existing AWS (Vercel hobby tier is free).
