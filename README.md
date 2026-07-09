# Portfolio Website

Personal portfolio of Hsin-Han (Evan) Wu, rebuilt with [Next.js](https://nextjs.org) (App Router), TypeScript, and Tailwind CSS.

> **Migration in progress.** The previous static site lives in `legacy/` for reference and is deleted at cutover. At cutover the site moves from EC2 + nginx to EC2 + Caddy serving a static export (see [Deployment](#deployment)). The full migration plan is in `docs/superpowers/plans/2026-07-05-nextjs-portfolio-revamp.md`.

## Run locally

```bash
npm install
npm run dev       # dev server at http://localhost:3000
```

Other scripts:

```bash
npm run build     # production build
npm run start     # serve the production build
npm run lint      # ESLint
npm run format    # Prettier (writes)
```

## How to add a project page

Drop one `.mdx` file into `content/projects/` with frontmatter (`title`, `summary`,
`date`, `tech`, `coverImage`, `links`). The page, its URL (`/projects/<filename>`),
its card on `/projects`, and its `sitemap.xml` entry are all generated automatically.
No code changes needed.

> **Standalone top-level pages** (e.g. an `/about` or `/uses` page from
> `content/pages/*.mdx`) were scaffolded but the route is currently disabled: an
> empty dynamic route is incompatible with `output: export`. To add the first one,
> restore the route file and drop in the MDX:
>
> ```bash
> git checkout 59ad096 -- 'src/app/[slug]'
> # then create content/pages/about.mdx
> ```
>
> After the first page exists the build is happy, and further pages are drop-in.

## Deployment

The site is a fully static export served by **Caddy on EC2**. Deploying is one command:

```bash
./deploy/deploy.sh        # builds ./out, then rsyncs it to the box
```

No SSH session, no `git pull`, no nginx. Edit the `REMOTE_*` values in
`deploy/deploy.sh` once to point at your box. Caddy serves the files and obtains +
auto-renews HTTPS certificates itself (config in `deploy/Caddyfile`), and redirects
the old `.html` URLs to the new clean routes. See `deploy/Caddyfile` for the one-time
server setup (install Caddy, drop in the Caddyfile, open ports 80/443).

DNS: `evanshwu.com` and `www.evanshwu.com` A records point at the EC2 box; the apex
redirects to `www`.

## Static export note

`next.config.ts` sets `output: "export"`, so `npm run build` emits a fully static
`out/` directory (an HTML file per route) that any static web server can host.
`images.unoptimized` is `true` because a static export has no image-optimization
runtime — all images are pre-sized in the repo to keep quality high.
