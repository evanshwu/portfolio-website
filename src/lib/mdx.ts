import type { ComponentType } from "react";

export type MdxCollection = "projects" | "pages";

// Dynamically import a compiled MDX file's default (body) component.
//
// Both collections resolve through this single `import()` site on purpose: the
// template literal spans the whole `content/` tree, so Turbopack builds one
// dynamic-import context across every `content/**/*.mdx` file. That context is
// always non-empty (there is always at least one project), which keeps the
// build green even when `content/pages/` has no files yet — an empty
// per-directory context is a hard Turbopack build error.
export async function loadMdxBody(
  collection: MdxCollection,
  slug: string,
): Promise<ComponentType> {
  const mod = await import(`@content/${collection}/${slug}.mdx`);
  return mod.default as ComponentType;
}
