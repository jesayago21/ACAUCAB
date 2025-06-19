/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module 'astro:content' {
  interface Render {
    '.md': Promise<{
      Content: import('astro').MarkdownContent;
      headings: import('astro').MarkdownHeading[];
      remarkPluginFrontmatter: Record<string, any>;
    }>;
  }
}

declare module '*.astro' {
  const component: (props: any) => any;
  export default component;
}

declare module '@astrojs/react' {
  const react: any;
  export default react;
}

declare module 'nanostores' {
  export function atom<T>(initialValue: T): any;
}

declare module '@nanostores/react' {
  export function useStore<T>(store: any): T;
}
