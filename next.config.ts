import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let `.md`/`.mdx` files act as pages/imports alongside the usual extensions.
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  // The site is fully statically prerendered, so skip the on-demand image
  // optimizer (a server runtime): serve images as-is from the static output.
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
