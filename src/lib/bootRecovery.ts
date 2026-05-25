const RETRY_KEY = "bs90-chunk-retry";

/** One-time reload when a stale service worker serves missing JS chunks after deploy. */
export function setupBootRecovery() {
  if (typeof window === "undefined") return;

  window.addEventListener(
    "error",
    (event) => {
      const target = event.target;
      if (!(target instanceof HTMLScriptElement) || !target.src) return;
      if (sessionStorage.getItem(RETRY_KEY)) return;

      sessionStorage.setItem(RETRY_KEY, "1");
      void clearAppCaches().finally(() => {
        window.location.reload();
      });
    },
    true,
  );

  window.addEventListener("vite:preloadError", (event) => {
    event.preventDefault();
    if (sessionStorage.getItem(RETRY_KEY)) return;

    sessionStorage.setItem(RETRY_KEY, "1");
    void clearAppCaches().finally(() => {
      window.location.reload();
    });
  });
}

async function clearAppCaches() {
  if (!("caches" in window)) return;
  const keys = await caches.keys();
  await Promise.all(keys.map((key) => caches.delete(key)));
}
