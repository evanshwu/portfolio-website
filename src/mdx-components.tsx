import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

// Presentational overrides for MDX body content. Styling lives here (the
// mdx-components file convention) so it inherits the design system without
// leaking global CSS, and every color comes from a semantic token.

function isExternal(href: string) {
  return /^https?:\/\//.test(href) || href.startsWith("mailto:");
}

const linkClass =
  "text-accent underline decoration-1 underline-offset-4 transition-opacity hover:opacity-80";

const components = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className="mt-10 scroll-mt-24 text-2xl font-semibold tracking-tight sm:text-3xl"
      {...props}
    />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mt-10 scroll-mt-24 text-xl font-semibold tracking-tight sm:text-2xl"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mt-8 scroll-mt-24 text-lg font-semibold tracking-tight"
      {...props}
    />
  ),
  h4: (props: ComponentPropsWithoutRef<"h4">) => (
    <h4 className="mt-6 scroll-mt-24 text-base font-semibold" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="text-foreground/90 mt-5 leading-relaxed" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="text-foreground/90 marker:text-muted-foreground mt-5 list-disc space-y-2 pl-6 leading-relaxed"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="text-foreground/90 marker:text-muted-foreground mt-5 list-decimal space-y-2 pl-6 leading-relaxed"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="pl-1.5" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="border-accent text-muted-foreground mt-6 border-l-2 pl-4 italic"
      {...props}
    />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="border-border mt-10" {...props} />
  ),
  img: ({ alt = "", ...props }: ComponentPropsWithoutRef<"img">) => (
    // Migrated body screenshots are pre-sized static assets in /public.
    // next/image adds nothing here (images are unoptimized and served as-is)
    // and markdown can only emit a plain <img>, so render one directly with
    // the design-system framing.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      className="border-border mt-6 w-full rounded-lg border"
      {...props}
    />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="text-foreground font-semibold" {...props} />
  ),
  a: ({ href = "", ...props }: ComponentPropsWithoutRef<"a">) => {
    const url = String(href);
    if (isExternal(url)) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          {...props}
        />
      );
    }
    return <Link href={url} className={linkClass} {...props} />;
  },
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="bg-surface border-border mt-6 overflow-x-auto rounded-lg border p-4 text-sm leading-relaxed"
      {...props}
    />
  ),
  code: ({ className, ...props }: ComponentPropsWithoutRef<"code">) => {
    // Fenced blocks arrive as `language-*`; leave those to the <pre> wrapper.
    // Everything else is inline code and gets a subtle pill.
    const isBlock =
      typeof className === "string" && className.startsWith("language-");
    if (isBlock) {
      return <code className={`${className} font-mono`} {...props} />;
    }
    return (
      <code
        className="bg-surface border-border rounded border px-1.5 py-0.5 font-mono text-[0.85em]"
        {...props}
      />
    );
  },
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
