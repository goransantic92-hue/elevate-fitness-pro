import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MemberGate } from "@/components/MemberGate";
import { Button } from "@/components/ui/button";
import { gymWorkouts, homeWorkouts } from "@/data/busyStrong90";
import { ArrowLeft, PlayCircle, X } from "lucide-react";
import NotFound from "@/pages/NotFound";
import { cn } from "@/lib/utils";

export default function DashboardWorkoutDetailPage() {
  const { variant, code } = useParams<{ variant: string; code: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [demo, setDemo] = useState<{ open: boolean; src: string; title: string }>({ open: false, src: "", title: "" });

  const closeDemo = useCallback(() => {
    videoRef.current?.pause();
    setDemo((d) => ({ ...d, open: false }));
  }, []);

  useEffect(() => {
    if (!demo.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDemo();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [demo.open, closeDemo]);

  if (variant !== "gym" && variant !== "home") return <NotFound />;
  if (code !== "a" && code !== "b" && code !== "c") return <NotFound />;

  const w = variant === "gym" ? gymWorkouts[code] : homeWorkouts[code];

  return (
    <MemberGate>
      <div className="max-w-3xl mx-auto space-y-8">
        <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground" asChild>
          <Link to="/dashboard/training">
            <ArrowLeft className="h-4 w-4" />
            All training
          </Link>
        </Button>

        <div className="glass-card overflow-hidden border-primary/20">
          <div className="bg-gradient-to-r from-primary/15 to-transparent p-6 border-b border-border/50">
            <p className="text-xs font-bold text-primary tracking-widest mb-1">{variant === "gym" ? "GYM" : "HOME"}</p>
            <h1 className="text-2xl md:text-3xl font-black">{w.title}</h1>
            <p className="text-sm text-primary mt-1">{w.focus}</p>
            <p className="text-xs text-muted-foreground mt-3">Warm-up: {w.warmup}</p>
          </div>
          <div className="divide-y divide-border/50">
            {w.exercises.map((ex) => {
              const hasDemo = Boolean(ex.demoVideoSrc);
              const inner = (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-baseline gap-2 min-w-0">
                      <span className="text-xs font-black text-primary shrink-0">{String(ex.order).padStart(2, "0")}</span>
                      <h2 className="font-bold text-sm md:text-base">{ex.name}</h2>
                      <span className="text-xs text-muted-foreground">— {ex.target}</span>
                    </div>
                    {hasDemo && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary/35 bg-primary/10 px-2.5 py-1 text-xs font-semibold tracking-tight text-primary">
                        <PlayCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        Play video
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-xs bg-secondary px-2 py-1 rounded">{ex.sets} sets</span>
                    <span className="text-xs bg-secondary px-2 py-1 rounded">{ex.reps} reps</span>
                    <span className="text-xs bg-secondary px-2 py-1 rounded">{ex.rest} rest</span>
                  </div>
                  <p className="text-xs text-muted-foreground italic">Coach tip: {ex.tip}</p>
                  {hasDemo && (
                    <p className="text-[11px] text-primary/90 mt-2 font-medium">Tap this block to watch a short form demo.</p>
                  )}
                </>
              );

              return (
                <div key={ex.order} className="p-5">
                  {hasDemo ? (
                    <button
                      type="button"
                      className={cn(
                        "w-full text-left rounded-xl -m-2 p-2 transition-colors",
                        "hover:bg-primary/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      )}
                      onClick={() => setDemo({ open: true, src: ex.demoVideoSrc!, title: ex.name })}
                    >
                      {inner}
                    </button>
                  ) : (
                    inner
                  )}
                </div>
              );
            })}
          </div>
          <div className="bg-primary/5 p-4 border-t border-border/50">
            <p className="text-xs font-medium">
              <span className="text-primary font-bold">FINISHER:</span> {w.finisher}
            </p>
          </div>
        </div>

        {/* Full-screen layer without CSS transform (Radix Dialog uses transform — breaks video controls on many mobile browsers / PWA). */}
        {demo.open && demo.src ? (
          <div
            className="fixed inset-0 z-[100] flex flex-col bg-background touch-manipulation"
            role="dialog"
            aria-modal="true"
            aria-labelledby="workout-demo-title"
          >
            <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3 shrink-0">
              <div className="min-w-0">
                <h2 id="workout-demo-title" className="text-base font-bold leading-tight pr-2">
                  {demo.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Use the player controls — tap play on the video.</p>
              </div>
              <Button type="button" variant="ghost" size="icon" className="shrink-0 rounded-full" onClick={closeDemo} aria-label="Close video">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center bg-black p-2">
              <video
                ref={videoRef}
                key={demo.src}
                className="max-h-[min(78dvh,720px)] w-full max-w-full object-contain [touch-action:manipulation]"
                src={demo.src}
                controls
                playsInline
                preload="auto"
              />
            </div>
            <div className="shrink-0 border-t border-border bg-background/95 px-4 py-3">
              <a
                href={demo.src}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-primary underline-offset-2 hover:underline"
              >
                Open video in browser tab
              </a>
              <span className="text-muted-foreground"> · if the player does not respond on your device</span>
            </div>
          </div>
        ) : null}
      </div>
    </MemberGate>
  );
}
