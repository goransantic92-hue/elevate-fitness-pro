/** Only allow same-origin relative paths (avoid open redirects). */
export function safeInternalPath(queryRedirect: string | null, stateFrom: string | undefined, fallback: string): string {
  const candidates = [queryRedirect, stateFrom];
  for (const c of candidates) {
    if (c && c.startsWith("/") && !c.startsWith("//")) return c;
  }
  return fallback;
}
