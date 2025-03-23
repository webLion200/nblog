// types/next-cache.d.ts
import "next";

declare module "next/cache" {
  export function unstable_cache<Args extends any[], T>(
    fn: (...args: Args) => Promise<T>,
    keyParts?: string[],
    options?: {
      revalidate?: number | false;
      tags?: (...args: Args) => string[];
    }
  ): (...args: Args) => Promise<T>;
}
