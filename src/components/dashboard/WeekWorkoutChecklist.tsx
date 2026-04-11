import { useMemo } from "react";
import { Check, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/database";

type Slot = Database["public"]["Tables"]["workout_session_logs"]["Row"]["slot"];

const SLOTS: { slot: Slot; label: string; short: string }[] = [
  { slot: "mon", label: "Monday — Training A", short: "Mon · A" },
  { slot: "wed", label: "Wednesday — Training B", short: "Wed · B" },
  { slot: "fri", label: "Friday — Training C", short: "Fri · C" },
  { slot: "sat_bonus", label: "Saturday — 10 min bonus", short: "Sat · Bonus" },
];

type Props = {
  weekNumber: number;
  variant: "gym" | "home";
  onVariantChange: (v: "gym" | "home") => void;
  logs: Database["public"]["Tables"]["workout_session_logs"]["Row"][];
  busy: boolean;
  onToggle: (slot: Slot, done: boolean) => void;
};

export function WeekWorkoutChecklist({ weekNumber, variant, onVariantChange, logs, busy, onToggle }: Props) {
  const doneMap = useMemo(() => {
    const m: Record<string, boolean> = {};
    for (const s of SLOTS) {
      const row = logs.find((l) => l.week_number === weekNumber && l.slot === s.slot && l.variant === variant);
      m[s.slot] = row?.completed ?? false;
    }
    return m;
  }, [logs, weekNumber, variant]);

  const doneCount = SLOTS.filter((s) => doneMap[s.slot]).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">This week&apos;s sessions</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Week {weekNumber} · {doneCount}/{SLOTS.length} checked
          </p>
        </div>
        <div className="flex rounded-xl border border-border/60 p-0.5 bg-background/50">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn("rounded-lg h-8 px-3 text-xs", variant === "gym" && "bg-primary/15 text-primary")}
            onClick={() => onVariantChange("gym")}
          >
            Gym
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn("rounded-lg h-8 px-3 text-xs", variant === "home" && "bg-primary/15 text-primary")}
            onClick={() => onVariantChange("home")}
          >
            Home
          </Button>
        </div>
      </div>
      <ul className="space-y-2">
        {SLOTS.map((s) => {
          const done = doneMap[s.slot] ?? false;
          return (
            <li key={s.slot}>
              <button
                type="button"
                disabled={busy}
                onClick={() => onToggle(s.slot, !done)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                  done
                    ? "border-primary/40 bg-primary/10 shadow-[0_0_20px_hsl(110_100%_55%/0.08)]"
                    : "border-border/60 bg-card/40 hover:border-primary/25 hover:bg-card/60"
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 transition-colors",
                    done ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"
                  )}
                >
                  {done ? <Check className="h-5 w-5" /> : <Dumbbell className="h-4 w-4" />}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold text-sm md:text-base">{s.short}</span>
                  <span className="block text-xs text-muted-foreground truncate">{s.label}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
