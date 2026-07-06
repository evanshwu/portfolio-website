# Portfolio Website

Personal portfolio of Hsin-Han (Evan) Wu, rebuilt with [Next.js](https://nextjs.org) (App Router), TypeScript, and Tailwind CSS.

> **Migration in progress.** The previous static site lives in `legacy/` for reference and is deleted at cutover. The full migration plan is in `docs/superpowers/plans/2026-07-05-nextjs-portfolio-revamp.md`.

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

_Coming in Phase 3 of the plan._ The target workflow: drop one `.mdx` file into `content/projects/` with frontmatter (`title`, `summary`, `date`, `tech`, `coverImage`, `links`) — the page, its URL, and its card on `/projects` are generated automatically. No code changes needed.

## Deployment

_Coming in Phase 6 of the plan._ The target workflow: push to `master` and CI deploys automatically (Vercel recommended; AWS S3 + CloudFront as the keep-AWS alternative). Until cutover, the live site is still served from EC2 + nginx off `master` — this branch (`nextjs-revamp`) does not affect production.

## Static export note

The app currently uses Next.js's default static prerendering, which is what Vercel wants. If the AWS/S3 hosting path is chosen in Phase 6, set `output: "export"` in `next.config.ts` to emit a fully static `out/` directory (and configure an image loader, since `next/image` optimization needs one under static export).
