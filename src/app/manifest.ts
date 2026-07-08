import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

// Emitted as a static file under `output: export` (no request-time data).
export const dynamic = "force-static";

// Web app manifest (served at /manifest.webmanifest; the file convention also
// injects <link rel="manifest">). Icons are real PNGs copied from the legacy
// favicon set into /public/icons — no fabricated sizes. favicon.ico / icon.png
// / apple-icon.png remain wired via their own file conventions (Phase 4).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.fullName} — Software Engineer`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icons/icon-96.png", sizes: "96x96", type: "image/png" },
      { src: "/icons/icon-144.png", sizes: "144x144", type: "image/png" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-310.png", sizes: "310x310", type: "image/png" },
    ],
  };
}
