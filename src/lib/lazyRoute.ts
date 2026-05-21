import { lazy, type ComponentType } from "react";

/** Lazy import with retries — helps when a stale service worker serves an old HTML shell. */
export function lazyRoute<T extends ComponentType<unknown>>(importer: () => Promise<{ default: T }>) {
  return lazy(async () => {
    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await importer();
      } catch (err) {
        lastError = err;
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
        }
      }
    }
    throw lastError;
  });
}
