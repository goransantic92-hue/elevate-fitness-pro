import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Database } from "@/types/database";
import { useMemberWorkoutsCms } from "@/hooks/useMemberWorkoutsCms";
import { getSessionLinkMeta, type PlanTab, type SessionSlot } from "@/lib/dashboardSessionLinks";
import { PROGRAM_TOTAL_DAYS } from "@/lib/programProgress";

type Slot = Database["public"]["Tables"]["workout_session_logs"]["Row"]["slot"];
type LogVariant = Database["public"]["Tables"]["workout_session_logs"]["Row"]["variant"];

const SLOTS: SessionSlot[] = ["mon", "wed", "fri", "sat_bonus"];

type Props = {
  weekNumber: number;
  planTab: PlanTab;
  onPlanTabChange: (t: PlanTab) => void;
  logs: Database["public"]["Tables"]["workout_session_logs"]["Row"][];
  busy: boolean;
  onToggle: (slot: Slot, done: boolean) => void;
  onSetWholeWeek: (complete: boolean) => void;
  currentDay: number;
  daysRemaining: number;
  programArcComplete: boolean;
};

function variantForTab(tab: PlanTab): LogVariant {
  return tab;
}

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
  const { t } = useTranslation("dashboard");
  const { gymWorkouts, homeWorkouts, emergencyWorkouts } = useMemberWorkoutsCms();
  const v = variantForTab(planTab);

  const doneMap = useMemo(() => {
    const m: Record<string, boolean> = {};
    for (const s of SLOTS) {
      const row = logs.find((l) => l.week_number === weekNumber && l.slot === s && l.variant === v);
      m[s] = row?.completed ?? false;
    }
    return m;
  }, [logs, weekNumber, v]);

  const doneCount = SLOTS.filter((s) => doneMap[s]).length;
  const weekAllDone = SLOTS.every((s) => doneMap[s]);

  const variantLabel =
    planTab === "emergency" ? t("training.tabs.emergency") : planTab === "gym" ? t("training.tabs.gym") : t("training.tabs.home");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">{t("checklist.thisWeekSessions")}</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("checklist.weekChecked", { week: weekNumber, done: doneCount, total: SLOTS.length })}
            {planTab === "emergency" && <span className="text-primary/90">{t("checklist.minTrack")}</span>}
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
              {tab === "emergency" ? t("training.tabs.emergency") : tab === "gym" ? t("training.tabs.gym") : t("training.tabs.home")}
            </Button>
          ))}
        </div>
      </div>

      <ul className="space-y-2">
        {SLOTS.map((slot) => {
          const done = doneMap[slot] ?? false;
          const meta = getSessionLinkMeta(slot, planTab, {
            gym: gymWorkouts,
            home: homeWorkouts,
            emergency: emergencyWorkouts,
          });
          const checkId = `session-${weekNumber}-${planTab}-${slot}`;

          return (
            <li key={slot} className="flex gap-3 items-center">
              <div className="shrink-0 pt-0.5">
                <Checkbox
                  id={checkId}
                  checked={done}
                  disabled={busy}
                  className="h-5 w-5 rounded-md border-2 border-border data-[state=checked]:border-primary"
                  onCheckedChange={(checked) => onToggle(slot, checked === true)}
                />
              </div>
              <Link
                to={meta.to}
                className={cn(
                  "flex-1 min-w-0 flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all group",
                  done ? "border-primary/30 bg-primary/5" : "border-border/60 bg-card/40 hover:border-primary/35 hover:bg-card/70"
                )}
              >
                <span className="flex-1 min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-sm md:text-base">{t(`checklist.slots.${slot}`)}</span>
                    {meta.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        {meta.badge}
                      </span>
                    )}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-1 leading-snug line-clamp-3">{meta.description}</span>
                  <span className="sr-only">{meta.title}</span>
                </span>
                <ChevronRight className="icon-directional h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="flex items-start gap-3 pt-4 mt-2 border-t border-border/50">
        <Checkbox
          id={`whole-week-${weekNumber}-${planTab}`}
          checked={weekAllDone}
          disabled={busy}
          className="h-5 w-5 mt-0.5 rounded-md border-2 border-border data-[state=checked]:border-primary"
          onCheckedChange={(checked) => onSetWholeWeek(checked === true)}
        />
        <label htmlFor={`whole-week-${weekNumber}-${planTab}`} className="text-sm leading-snug cursor-pointer select-none">
          <span className="font-semibold text-foreground">{t("checklist.markWholeWeek")}</span>
          <span className="block text-xs text-muted-foreground mt-1">
            {t("checklist.markWholeWeekDesc", {
              variant: variantLabel,
              week: weekNumber,
              days: PROGRAM_TOTAL_DAYS,
            })}
          </span>
        </label>
      </div>

      <div className="rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("checklist.programArc")}</p>
        {programArcComplete ? (
          <p className="text-sm font-semibold text-primary">{t("checklist.arcComplete")}</p>
        ) : (
          <>
            <p className="text-sm text-foreground">
              <span className="font-black tabular-nums text-2xl text-primary">{daysRemaining}</span>
              <span className="text-muted-foreground font-medium"> {t("checklist.daysLeft")}</span>
              <span className="text-muted-foreground"> · </span>
              <span className="text-sm text-muted-foreground">
                {t("checklist.dayOf", { current: currentDay, total: PROGRAM_TOTAL_DAYS })}
              </span>
            </p>
            <p className="text-xs text-muted-foreground leading-snug">
              {t("checklist.finishSlotsDesc", { week: weekNumber })}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
