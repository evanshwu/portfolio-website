declare module "*.mdx" {
  import type { ComponentType } from "react";

  /** Compiled MDX renders to a React component as its default export. */
  const MDXComponent: ComponentType;
  export default MDXComponent;
}
