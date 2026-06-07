import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MemberGate } from "@/components/MemberGate";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  type Exercise,
  type WorkoutDemoClip,
  exerciseHasDemo,
  getExerciseDemoClips,
  gymWorkouts,
  homeWorkouts,
} from "@/data/busyStrong90";
import { getWorkoutDemoSignedUrl } from "@/lib/workoutDemoMedia";
import { ArrowLeft, Loader2, PlayCircle } from "lucide-react";
import NotFound from "@/pages/NotFound";
import { cn } from "@/lib/utils";

type DemoState = {
  open: boolean;
  title: string;
  clips: WorkoutDemoClip[];
  activeIndex: number;
  src: string;
  startSec: number;
  loading: boolean;
  error: string | null;
};

const emptyDemo: DemoState = {
  open: false,
  title: "",
  clips: [],
  activeIndex: 0,
  src: "",
  startSec: 0,
  loading: false,
  error: null,
};

export default function DashboardWorkoutDetailPage() {
  const { variant, code } = useParams<{ variant: string; code: string }>();
  const { t } = useTranslation("dashboard");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [demo, setDemo] = useState<DemoState>(emptyDemo);

  if (variant !== "gym" && variant !== "home") return <NotFound />;
  if (code !== "a" && code !== "b" && code !== "c") return <NotFound />;

  const w = variant === "gym" ? gymWorkouts[code] : homeWorkouts[code];

  const loadClip = async (clips: WorkoutDemoClip[], index: number) => {
    const startSec = clips[index].startSec ?? 0;
    setDemo((d) => ({ ...d, activeIndex: index, startSec, loading: true, error: null, src: "" }));
    try {
      const signed = await getWorkoutDemoSignedUrl(clips[index].path);
      setDemo((d) => ({ ...d, src: signed, loading: false, error: null }));
    } catch (err) {
      const message = err instanceof Error ? err.message : t("training.couldNotLoadVideo");
      setDemo((d) => ({ ...d, loading: false, error: message.slice(0, 180) }));
    }
  };

  const openDemo = async (ex: Exercise) => {
    const clips = getExerciseDemoClips(ex);
    if (clips.length > 0) {
      setDemo({ ...emptyDemo, open: true, title: ex.name, clips, activeIndex: 0, loading: true });
      await loadClip(clips, 0);
      return;
    }

    if (ex.demoVideoSrc) {
      setDemo({
        ...emptyDemo,
        open: true,
        title: ex.name,
        src: ex.demoVideoSrc,
        loading: false,
      });
      return;
    }

    setDemo({ ...emptyDemo, open: true, title: ex.name, error: t("training.noDemoAvailable") });
  };

  const switchClip = async (index: number) => {
    if (index === demo.activeIndex || demo.clips.length === 0) return;
    videoRef.current?.pause();
    await loadClip(demo.clips, index);
  };

  return (
    <MemberGate>
      <div className="max-w-3xl mx-auto space-y-8">
        <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground" asChild>
          <Link to="/dashboard/training">
            <ArrowLeft className="icon-directional h-4 w-4" />
            {t("training.allTraining")}
          </Link>
        </Button>

        <div className="glass-card overflow-hidden border-primary/20">
          <div className="bg-gradient-to-r from-primary/15 to-transparent p-6 border-b border-border/50">
            <p className="text-xs font-bold text-primary tracking-widest mb-1">
              {variant === "gym" ? t("training.variantGym") : t("training.variantHome")}
            </p>
            <h1 className="text-2xl md:text-3xl font-black">{w.title}</h1>
            <p className="text-sm text-primary mt-1">{w.focus}</p>
            <p className="text-xs text-muted-foreground mt-3">{t("training.warmup", { text: w.warmup })}</p>
          </div>
          <div className="divide-y divide-border/50">
            {w.exercises.map((ex) => {
              const clips = getExerciseDemoClips(ex);
              const hasDemo = exerciseHasDemo(ex);
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
                        {clips.length > 1
                          ? t("training.playVideoCount", { count: clips.length })
                          : t("training.playVideo")}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-xs bg-secondary px-2 py-1 rounded">{t("training.setsCount", { count: ex.sets })}</span>
                    <span className="text-xs bg-secondary px-2 py-1 rounded">{t("training.repsCount", { count: ex.reps })}</span>
                    <span className="text-xs bg-secondary px-2 py-1 rounded">{t("training.restTime", { time: ex.rest })}</span>
                  </div>
                  <p className="text-xs text-muted-foreground italic">{t("training.coachTip", { tip: ex.tip })}</p>
                  {hasDemo && (
                    <p className="text-[11px] text-primary/90 mt-2 font-medium">
                      {clips.length > 1 ? t("training.tapMultiple") : t("training.tapSingle")}
                    </p>
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
                        "hover:bg-primary/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                      )}
                      onClick={() => void openDemo(ex)}
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
              <span className="text-primary font-bold">{t("training.finisher")}</span> {w.finisher}
            </p>
          </div>
        </div>

        <Dialog
          modal={false}
          open={demo.open}
          onOpenChange={(open) => {
            if (!open) videoRef.current?.pause();
            setDemo(open ? demo : emptyDemo);
          }}
        >
          <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="max-w-[min(100vw-1.5rem,22rem)] gap-0 border-border p-0 overflow-hidden sm:max-w-sm"
          >
            <DialogHeader className="p-4 pb-2 border-b border-border/60 text-left">
              <DialogTitle className="text-base pr-8">{demo.title}</DialogTitle>
              <DialogDescription className="text-xs">
                {demo.clips.length > 1 ? t("training.demoMulti") : t("training.demoSingle")}
              </DialogDescription>
            </DialogHeader>
            {demo.clips.length > 1 && (
              <div className="flex flex-wrap gap-2 px-4 py-2 border-b border-border/60">
                {demo.clips.map((clip, index) => (
                  <Button
                    key={clip.path}
                    type="button"
                    size="sm"
                    variant={demo.activeIndex === index ? "default" : "outline"}
                    className="h-8 text-xs"
                    disabled={demo.loading}
                    onClick={() => void switchClip(index)}
                  >
                    {clip.label}
                  </Button>
                ))}
              </div>
            )}
            <div className="bg-black px-1 pb-2 min-h-[12rem] flex items-center justify-center">
              {demo.loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label={t("training.loadingVideo")} />
              ) : demo.error ? (
                <p className="text-sm text-muted-foreground text-center px-4 py-8">{demo.error}</p>
              ) : demo.src ? (
                <video
                  ref={videoRef}
                  key={demo.src}
                  className="mx-auto block w-full max-w-full max-h-[min(52vh,420px)] object-contain"
                  src={demo.src}
                  controls
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={(e) => {
                    if (demo.startSec > 0) {
                      e.currentTarget.currentTime = demo.startSec;
                    }
                  }}
                />
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MemberGate>
  );
}
