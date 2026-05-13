import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MemberGate } from "@/components/MemberGate";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { gymWorkouts, homeWorkouts } from "@/data/busyStrong90";
import { ArrowLeft, PlayCircle } from "lucide-react";
import NotFound from "@/pages/NotFound";
import { cn } from "@/lib/utils";

export default function DashboardWorkoutDetailPage() {
  const { variant, code } = useParams<{ variant: string; code: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [demo, setDemo] = useState<{ open: boolean; src: string; title: string }>({ open: false, src: "", title: "" });

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

        <Dialog
          open={demo.open}
          onOpenChange={(open) => {
            if (!open) videoRef.current?.pause();
            setDemo((d) => ({ ...d, open }));
          }}
        >
          <DialogContent className="max-w-lg w-[calc(100vw-1.5rem)] sm:max-w-md border-border p-0 gap-0 overflow-hidden">
            <DialogHeader className="p-4 pb-2 border-b border-border/60 text-left">
              <DialogTitle className="text-base pr-8">{demo.title}</DialogTitle>
              <DialogDescription className="text-xs">Short demo clip — use sound if helpful.</DialogDescription>
            </DialogHeader>
            <div className="bg-black">
              {demo.open && demo.src ? (
                <video
                  ref={videoRef}
                  key={demo.src}
                  className="w-full max-h-[min(70vh,520px)] object-contain"
                  src={demo.src}
                  controls
                  playsInline
                  preload="metadata"
                />
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MemberGate>
  );
}
