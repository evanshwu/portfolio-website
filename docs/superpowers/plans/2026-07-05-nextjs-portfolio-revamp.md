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

- [x] Create branch `nextjs-revamp` from `master`.
- [x] Scaffold Next.js (App Router) + TypeScript + Tailwind CSS at the repo root; move the legacy site files into `legacy/` (kept for content reference until cutover, then deleted).
- [x] Add ESLint + Prettier, `npm run dev/build/lint` scripts, and a `README.md` that documents: how to run locally, how to add a project page, how deployment works.
- [x] Configure static generation (use `output: 'export'` if the AWS/S3 path is likely; plain static prerendering is fine for Vercel). _Chose default static prerendering (both routes prerender static); `output: "export"` is a one-line switch if AWS is picked in Phase 6 — noted in README._
- [x] Verify: `npm run dev` serves a placeholder homepage; `npm run build` succeeds cleanly. _Verified 2026-07-06: build clean, homepage 200 + screenshot, no console errors. Note: dev server used port 3001 locally (3000 occupied by another app)._

**Deliverable:** An empty but building Next.js app on its own branch, with the legacy site preserved.

### Phase 2: Design System & Site Shell

- [x] Define a small design system with Tailwind: type scale, spacing, a restrained professional palette, dark/light mode. Aim for a clean, modern engineer-portfolio look (generous whitespace, strong typography, subtle motion) — not a heavy template. Consult a design skill (e.g. `frontend-design`) when expanding this phase. _Done: zinc base + legacy brand teal accent (AA contrast both modes), Geist Sans/Mono, tokens in `globals.css` `@theme`, dark via `prefers-color-scheme` (no toggle — deliberate)._
- [x] Build the shared shell: responsive header nav, footer (GitHub / LinkedIn / email links), and root layout with global metadata. _Done: `site-header.tsx` (sticky, accessible disclosure menu, active-link underline), `site-footer.tsx`, layout metadata from siteConfig; `/projects` stub so nav isn't a 404._
- [x] Nav links must be driven by a single site config (one array of `{title, href}`), so adding a page to the nav is a one-line change. _Done: `src/config/site.ts` `nav` array; header (desktop+mobile) iterates it._
- [x] Verify: shell renders correctly on mobile and desktop widths; dark/light both legible. _Verified 2026-07-06 via screenshots (desktop/mobile × light/dark + open menu); reviewed by subagent, 1 Important fix (drawer state on history nav) applied and re-approved._

**Deliverable:** A consistent, professional-looking frame every page inherits.

### Phase 3: Content Engine (the "easy to add pages" requirement)

- [x] Set up MDX content collections: `content/projects/*.mdx` with typed frontmatter (`title`, `summary`, `date`, `tech[]`, `coverImage`, `links{github?, demo?}`, `featured?`). _Done: `@next/mdx` + dynamic import per bundled Next 16 docs; typed layer in `src/lib/content.ts` with build-time validation (missing field fails build naming file+field); `coverImage` optional since template renders it if present._
- [x] Dynamic route `/projects/[slug]` renders any MDX file with a shared, well-designed project-page template (hero image, tech badges, body, links). _Done: `generateStaticParams` + `dynamicParams=false`, all routes ○/● static; MDX body styled via `src/mdx-components.tsx`._
- [x] `/projects` index page lists all projects from the collection automatically, sorted by date, with cards. _Done: newest-first, clickable cards with featured tag + tech badges._
- [x] Support the same pattern for standalone pages (`content/pages/*.mdx` → top-level routes) so future pages (blog post, talk, publication) are also just files. _Done: `src/app/[slug]/page.tsx`; static routes take precedence so nothing is shadowed._
- [x] Verify: creating a dummy `content/projects/test.mdx` makes it appear on the index and at its own URL with zero code edits; deleting it removes it. _Verified 2026-07-07 twice (implementer + controller re-run); visual QA desktop/mobile × light/dark passed._

**Deliverable:** Adding a page = adding one MDX file. This is the acceptance test for requirement #3.

### Phase 4: Content Migration

- [x] Port homepage content from `legacy/index.html`: hero (name, title line), about section, skills section (restructure into scannable groups rather than a wall of badges). _Done: hero + about (portrait, bio, experience/education timeline from the legacy tabs) + skills in 4 pill groups + projects teaser reusing ProjectCard._
- [x] Rewrite the four project pages (`watchdogpi`, `kourse`, `fridgepi`, `chatbot`) as MDX files, improving the copy into short case-study form: problem → what I built → tech → outcome. _Done at exact slugs. Note: legacy chatbot.html was an empty template clone; page reconstructed truthfully from the Botpress embed in legacy index.html — Evan to confirm keep-vs-drop. Dates: kourse/fridgepi content-derived; chatbot/watchdogpi estimated._
- [x] Migrate images into the app with `next/image` (optimized, properly sized); migrate the publications PDF and link it from an appropriate section; keep the favicon set. _Done: 8 images pre-sized ≤300KB/≤1600px (required since images.unoptimized; fridgepi3.png 3.1MB→279KB); PDF → /publications/low-cost-smart-refrigerator.pdf linked from FridgePi; favicon/icon/apple-icon via app-icons conventions (full manifest wiring = Phase 5)._
- [x] Add a resume/CV link (reuse the existing resume link from the legacy site). _Done: legacy Drive URL in siteConfig.resumeUrl → global nav + hero CTA._
- [x] **Drop the `#signup` newsletter section** unless there is a real working backend behind it (flag to Evan if in doubt — a dead signup form looks unprofessional). _Dropped without doubt: it was already commented out in the legacy HTML (dead form, no backend)._
- [x] Verify: every piece of legacy content is either migrated or explicitly listed as intentionally dropped. _Verified 2026-07-07: full audit table in phase4-report.md; reviewer independently spot-checked copy fidelity against legacy source; visual QA desktop/mobile × light/dark passed._

**Deliverable:** Feature-complete new site with all real content.

### Phase 5: SEO, Performance & Polish

- [x] Per-page metadata via the Metadata API: titles, descriptions, Open Graph + Twitter cards (project pages use their frontmatter), canonical URLs. _Done: `src/lib/seo.ts` pageMetadata() composes complete OG/Twitter/canonical per page (shallow-merge-safe); project pages derive from frontmatter via generateMetadata; every absolute URL resolves via metadataBase from siteConfig.url (placeholder — swap at Phase 6 is one line)._
- [x] Generate `sitemap.xml` and `robots.txt`; add favicon/manifest wiring. _Done: sitemap.ts/robots.ts/manifest.ts file conventions, all static, sitemap derived from the content collections (drop-in preserved); manifest icons are byte-identical legacy copies (96/144/192/310, md5-verified); dropped browserconfig.xml + stale legacy manifest.json._
- [x] Accessibility pass: semantic landmarks, alt text, focus states, color contrast. _Done: verification pass found no defects (Phase 2–4 baseline already satisfied the checklist); Lighthouse Accessibility 100 on all audited pages._
- [x] Run Lighthouse; fix until all four categories ≥ 95. _Done (localhost proxy): home 97, /projects 98, fridgepi 95 median Performance; A11y/BP/SEO 100 everywhere. Fixes: priority→preload, preload/fetchPriority doc conflict resolved (review loop), fridgepi cover right-sized 200KB→72KB, body images lazy. fridgepi Perf is boundary-sensitive under local Lantern simulation (91–100 on identical builds = host-load noise) — re-validate on production hosting at Phase 6._
- [x] Verify on real mobile viewport sizes and in both color schemes. _Verified 2026-07-07: prod-build QA, desktop (1440) + mobile (390) × light/dark screenshots clean; rendered-head checks (og:url/canonical/manifest/sitemap/robots) all correct._

**Deliverable:** A site that looks professional to humans and to crawlers/link previews.

### Phase 6: CI/CD & Cutover (retires the SSH + nginx workflow)

- [x] Make the hosting decision (see Key Decision above). _Decided (Evan, 2026-07-08): **keep EC2 but replace nginx with Caddy**, serving a static export; deploy via a manual `./deploy/deploy.sh` (build + rsync). GitHub Actions intentionally skipped — the site updates ~quarterly, so CI's per-deploy savings don't justify maintaining a workflow + SSH deploy key (repo is public, so Actions would have been free, but the cadence makes a one-command script the proportionate tool). Domain: **www.evanshwu.com** (apex → www)._
- [x] ~~**If Vercel:** connect repo…~~ _N/A — Vercel not chosen._
- [x] **EC2 variant (chosen):** static export (`output: "export"` in `next.config.ts`) served by Caddy; `deploy/deploy.sh` does build + `rsync --delete out/` to the box; `deploy/Caddyfile` handles serving + auto-HTTPS (Let's Encrypt) + redirects; `deploy/SETUP.md` is the one-time cutover runbook. Export-mode fixes: sitemap/robots/manifest `force-static`; removed the empty standalone-pages `[slug]` route (incompatible with export; preserved in git, restore path in README). Build clean, all 14 routes static.
- [x] Add redirects from all legacy URLs (`/projects/*.html`, `/projects.html`, `/index.html`) to the new routes. _Done in `deploy/Caddyfile` (301s), plus trailing-slash normalization and apex→www. **Validated locally with Caddy 2.11.4 against the real `out/`:** clean URLs + assets 200, every legacy `.html` and trailing-slash path 301→clean canonical, unknown routes→404.html._
- [ ] Merge `nextjs-revamp` → `master`; confirm HTTPS. _Pending — awaiting Evan. Repo work committed on `nextjs-revamp` (03dd28c, 878ac07 + docs), not pushed. Same-box cutover: DNS already points at this EC2 instance, so no DNS change is needed — just nginx→Caddy (see `deploy/SETUP.md`). Merge/push held for Evan's go._
- [ ] Verify production: all pages load, all legacy URLs redirect, OG previews render (paste a link into a chat app to check). _Pending — requires the site live on the box (Evan runs the SETUP.md steps). Also re-run the FridgePi Lighthouse Performance check here (Phase 5 flagged local-simulation noise; production/quiet host expected ≥95 comfortably)._

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
