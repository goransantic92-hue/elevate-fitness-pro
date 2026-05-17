/** Shown while a lazy-loaded route chunk is downloading. */
export function RoutePageFallback() {
  return (
    <div className="min-h-[12rem] animate-pulse" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading page</span>
      <div className="container mx-auto max-w-[1100px] px-6 py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-12 md:items-center">
          <div className="space-y-4 md:col-span-7">
            <div className="h-6 w-48 rounded-full bg-secondary" />
            <div className="h-12 w-full max-w-md rounded-lg bg-secondary" />
            <div className="h-4 w-full max-w-lg rounded bg-secondary/80" />
            <div className="h-10 w-40 rounded-lg bg-secondary" />
          </div>
          <div className="aspect-[4/5] rounded-2xl bg-secondary/60 md:col-span-5" />
        </div>
      </div>
    </div>
  );
}
