import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a fully static site into `out/` (an HTML file per route) so it can be
  // served by any static web server (Caddy on EC2 here) — no Node runtime.
  // Redirects/rewrites/headers are NOT available under `export`; the legacy
  // `.html` → clean-URL redirects live in the Caddyfile (deploy/Caddyfile).
  output: "export",
  // Let `.md`/`.mdx` files act as pages/imports alongside the usual extensions.
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  // Static export has no on-demand image optimizer (a server runtime), so serve
  // images as-is. All images were pre-sized in Phase 4 to keep this viable.
  images: { unoptimized: true },
};

const withMDX = createMDX({
  options: {
    // Strip the YAML frontmatter block so it is not rendered into the body.
    // The frontmatter DATA is read separately (see src/lib/content.ts).
    // Plugins are given as strings so they stay serializable for Turbopack,
    // the default build engine in Next 16.
    remarkPlugins: ["remark-frontmatter"],
  },
});

export default withMDX(nextConfig);
