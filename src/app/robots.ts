import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

// Static robots.txt: allow all crawling and point to the sitemap. The sitemap
// URL derives from siteConfig.url so it tracks the real domain at cutover.
const BASE = siteConfig.url.replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
