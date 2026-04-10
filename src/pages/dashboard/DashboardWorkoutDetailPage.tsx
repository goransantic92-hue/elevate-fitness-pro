import { Link, useParams } from "react-router-dom";
import { MemberGate } from "@/components/MemberGate";
import { Button } from "@/components/ui/button";
import { gymWorkouts, homeWorkouts } from "@/data/busyStrong90";
import { ArrowLeft } from "lucide-react";
import NotFound from "@/pages/NotFound";

export default function DashboardWorkoutDetailPage() {
  const { variant, code } = useParams<{ variant: string; code: string }>();

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
            {w.exercises.map((ex) => (
              <div key={ex.order} className="p-5">
                <div className="flex flex-wrap items-baseline gap-2 mb-2">
                  <span className="text-xs font-black text-primary">{String(ex.order).padStart(2, "0")}</span>
                  <h2 className="font-bold text-sm md:text-base">{ex.name}</h2>
                  <span className="text-xs text-muted-foreground">— {ex.target}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs bg-secondary px-2 py-1 rounded">{ex.sets} sets</span>
                  <span className="text-xs bg-secondary px-2 py-1 rounded">{ex.reps} reps</span>
                  <span className="text-xs bg-secondary px-2 py-1 rounded">{ex.rest} rest</span>
                </div>
                <p className="text-xs text-muted-foreground italic">Coach tip: {ex.tip}</p>
              </div>
            ))}
          </div>
          <div className="bg-primary/5 p-4 border-t border-border/50">
            <p className="text-xs font-medium">
              <span className="text-primary font-bold">FINISHER:</span> {w.finisher}
            </p>
          </div>
        </div>
      </div>
    </MemberGate>
  );
}
