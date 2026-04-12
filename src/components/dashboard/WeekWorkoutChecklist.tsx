import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Database } from "@/types/database";
import { getSessionLinkMeta, type PlanTab, type SessionSlot } from "@/lib/dashboardSessionLinks";
import { PROGRAM_TOTAL_DAYS } from "@/lib/programProgress";

type Slot = Database["public"]["Tables"]["workout_session_logs"]["Row"]["slot"];

const SLOTS: SessionSlot[] = ["mon", "wed", "fri", "sat_bonus"];

const SLOT_SHORT: Record<SessionSlot, string> = {
  mon: "Mon · A",
  wed: "Wed · B",
  fri: "Fri · C",
  sat_bonus: "Sat · Bonus",
};

type Props = {
  weekNumber: number;
  planTab: PlanTab;
  onPlanTabChange: (t: PlanTab) => void;
  logs: Database["public"]["Tables"]["workout_session_logs"]["Row"][];
  busy: boolean;
  onToggle: (slot: Slot, done: boolean) => void;
  onSetWholeWeek: (complete: boolean) => void;
  /** From session-based 90-day arc (updates after saves / whole week). */
  currentDay: number;
  daysRemaining: number;
  programArcComplete: boolean;
};

export function WeekWorkoutChecklist({
  weekNumber,
  planTab,
  onPlanTabChange,
  logs,
  busy,
  onToggle,
  onSetWholeWeek,
  currentDay,
  daysRemaining,
  programArcComplete,
}: Props) {
  const doneMap = useMemo(() => {
    const m: Record<string, boolean> = {};
    for (const s of SLOTS) {
      if (planTab === "emergency") {
        const g = logs.find((l) => l.week_number === weekNumber && l.slot === s && l.variant === "gym");
        const h = logs.find((l) => l.week_number === weekNumber && l.slot === s && l.variant === "home");
        m[s] = Boolean(g?.completed || h?.completed);
      } else {
        const row = logs.find((l) => l.week_number === weekNumber && l.slot === s && l.variant === planTab);
        m[s] = row?.completed ?? false;
      }
    }
    return m;
  }, [logs, weekNumber, planTab]);

  const doneCount = SLOTS.filter((s) => doneMap[s]).length;
  const showCheckboxes = planTab === "gym" || planTab === "home";
  const weekAllDone = SLOTS.every((s) => doneMap[s]);

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
          {(["gym", "home", "emergency"] as const).map((tab) => (
            <Button
              key={tab}
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-lg h-8 px-2.5 sm:px-3 text-xs capitalize",
                planTab === tab && "bg-primary/15 text-primary"
              )}
              onClick={() => onPlanTabChange(tab)}
            >
              {tab === "emergency" ? "10 min" : tab}
            </Button>
          ))}
        </div>
      </div>

      {planTab === "emergency" && (
        <p className="text-xs text-muted-foreground rounded-lg border border-border/50 bg-card/30 px-3 py-2">
          Quick sessions from the manual. To log a main slot as done, switch to <span className="text-foreground font-medium">Gym</span> or{" "}
          <span className="text-foreground font-medium">Home</span> and check it off.
        </p>
      )}

      <ul className="space-y-2">
        {SLOTS.map((slot) => {
          const done = doneMap[slot] ?? false;
          const meta = getSessionLinkMeta(slot, planTab);
          const checkId = `session-${weekNumber}-${planTab}-${slot}`;

          return (
            <li key={slot} className="flex gap-3 items-center">
              {showCheckboxes && (
                <div className="shrink-0 pt-0.5">
                  <Checkbox
                    id={checkId}
                    checked={done}
                    disabled={busy}
                    className="h-5 w-5 rounded-md border-2 border-border data-[state=checked]:border-primary"
                    onCheckedChange={(v) => onToggle(slot, v === true)}
                  />
                </div>
              )}
              <Link
                to={meta.to}
                className={cn(
                  "flex-1 min-w-0 flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all group",
                  done && showCheckboxes
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/60 bg-card/40 hover:border-primary/35 hover:bg-card/70"
                )}
              >
                <span className="flex-1 min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-sm md:text-base">{SLOT_SHORT[slot]}</span>
                    {meta.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        {meta.badge}
                      </span>
                    )}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-1 leading-snug line-clamp-3">{meta.description}</span>
                  <span className="sr-only">{meta.title}</span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </li>
          );
        })}
      </ul>

      {showCheckboxes && (
        <div className="flex items-start gap-3 pt-4 mt-2 border-t border-border/50">
          <Checkbox
            id={`whole-week-${weekNumber}-${planTab}`}
            checked={weekAllDone}
            disabled={busy}
            className="h-5 w-5 mt-0.5 rounded-md border-2 border-border data-[state=checked]:border-primary"
            onCheckedChange={(v) => onSetWholeWeek(v === true)}
          />
          <label htmlFor={`whole-week-${weekNumber}-${planTab}`} className="text-sm leading-snug cursor-pointer select-none">
            <span className="font-semibold text-foreground">Mark whole week complete</span>
            <span className="block text-xs text-muted-foreground mt-1">
              Checks all four {planTab} sessions for week {weekNumber}. When this week is fully done (here or slot by slot), your{" "}
              <span className="text-foreground font-medium">{PROGRAM_TOTAL_DAYS}-day</span> arc advances — same numbers as the overview ring.
            </span>
          </label>
        </div>
      )}

      <div className="rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">90-day program</p>
        {programArcComplete ? (
          <p className="text-sm font-semibold text-primary">Arc complete — all 12 weeks checked off in order. Keep training if you want.</p>
        ) : (
          <>
            <p className="text-sm text-foreground">
              <span className="font-black tabular-nums text-2xl text-primary">{daysRemaining}</span>
              <span className="text-muted-foreground font-medium"> days left</span>
              <span className="text-muted-foreground"> · </span>
              <span className="text-sm text-muted-foreground">
                Day <span className="font-bold text-foreground tabular-nums">{currentDay}</span> of {PROGRAM_TOTAL_DAYS}
              </span>
            </p>
            <p className="text-xs text-muted-foreground leading-snug">
              {showCheckboxes
                ? `Finish all four ${planTab} sessions for week ${weekNumber}, or use “Mark whole week complete”, to move the countdown forward.`
                : "Switch to Gym or Home and check off a full week to advance your 90-day arc."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
