import { useCallback, useEffect, useState } from "react";
import { Download, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "bs90-pwa-install-dismissed-at";
const DISMISS_MS = 1000 * 60 * 60 * 24 * 14;

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  if (window.matchMedia("(display-mode: fullscreen)").matches) return true;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true;
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return true;
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

function isMobileLike(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 900 || ("ontouchstart" in window && navigator.maxTouchPoints > 0);
}

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallAppPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_MS) return;
    if (!isMobileLike()) return;

    if (isIos()) {
      setVisible(true);
      return;
    }

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBip);
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
    setDeferred(null);
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    dismiss();
  };

  if (!visible || isStandalone()) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pointer-events-none print:hidden">
      <div className="max-w-lg mx-auto pointer-events-auto rounded-2xl border border-primary/30 bg-card/95 backdrop-blur-xl shadow-lg p-4 flex gap-3 items-start">
        <div className="rounded-xl bg-primary/15 p-2 shrink-0">
          <Download className="h-6 w-6 text-primary" aria-hidden />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <p className="font-bold text-sm text-foreground">Install BUSY STRONG 90</p>
          {isIos() ? (
            <p className="text-xs text-muted-foreground leading-relaxed">
              In <strong className="text-foreground">Safari</strong>, tap{" "}
              <Share2 className="inline h-3.5 w-3.5 align-text-bottom text-primary" aria-hidden /> <strong className="text-foreground">Share</strong>, then{" "}
              <strong className="text-foreground">Add to Home Screen</strong>. Opens like a full-screen app.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground leading-relaxed">
              Add this site to your home screen for quick access and a full-screen experience (Chrome / Edge on Android).
            </p>
          )}
          {!isIos() && deferred && (
            <Button type="button" size="sm" className="mt-1 font-semibold bg-primary text-primary-foreground" onClick={() => void install()}>
              Install app
            </Button>
          )}
        </div>
        <Button type="button" variant="ghost" size="icon" className="shrink-0 h-8 w-8 rounded-lg" onClick={dismiss} aria-label="Dismiss">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
