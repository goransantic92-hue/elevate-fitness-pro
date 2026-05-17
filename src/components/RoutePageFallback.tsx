/** Shown while a lazy-loaded route chunk is downloading. */
export function RoutePageFallback() {
  return (
    <div className="flex min-h-[12rem] items-center justify-center" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading page</span>
      <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" aria-hidden />
    </div>
  );
}
