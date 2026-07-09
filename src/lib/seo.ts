import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

// A single place that composes per-page metadata (Open Graph + Twitter card +
// canonical) so every route emits a consistent, complete set of tags. All
// URL-based fields stay RELATIVE — the root layout's `metadataBase`
// (siteConfig.url) resolves them to absolute URLs — so the production domain is
// never hardcoded here and can change at cutover in one place.

export type OgImage = {
  /** Relative path (e.g. "/me.jpg"); resolved against metadataBase. */
  url: string;
  width?: number;
  height?: number;
  alt: string;
};

// Site-wide default share image: the portrait. Square, so it pairs with a
// `summary` Twitter card; project pages override with their 16:9 cover.
export const DEFAULT_OG_IMAGE: OgImage = {
  url: "/me.jpg",
  width: 600,
  height: 599,
  alt: `${siteConfig.fullName}, software engineer`,
};

type PageMetadataInput = {
  /** Short title fed through the "%s — Evan Wu" template in the root layout. */
  title?: string;
  /** Full title that ignores the template (used for the homepage). */
  titleOverride?: string;
  description: string;
  /** Absolute path from the site root, e.g. "/projects/fridgepi". */
  path: string;
  image?: OgImage;
  type?: "website" | "article";
  /** `summary_large_image` for wide covers; `summary` for the square portrait. */
  twitterCard?: "summary" | "summary_large_image";
};

export function pageMetadata({
  title,
  titleOverride,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  twitterCard = "summary",
}: PageMetadataInput): Metadata {
  // og:title / twitter:title carry the full title (they are not run through
  // the document <title> template), so mirror what the template would produce.
  const fullTitle = titleOverride ?? `${title} — ${siteConfig.name}`;

  return {
    title: titleOverride ? { absolute: titleOverride } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: siteConfig.fullName,
      locale: "en_US",
      type,
      images: [image],
    },
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}
