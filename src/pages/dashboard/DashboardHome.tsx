import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { MemberGate } from "@/components/MemberGate";
import { Button } from "@/components/ui/button";
import { ProgramProgressRing } from "@/components/dashboard/ProgramProgressRing";
import { WeightLineChart } from "@/components/dashboard/WeightLineChart";
import { WeekWorkoutChecklist } from "@/components/dashboard/WeekWorkoutChecklist";
import { DashboardWeeklyCheckinCard } from "@/components/dashboard/DashboardWeeklyCheckinCard";
import { programMeta } from "@/data/busyStrong90";
import { getProgramProgressFromSessionLogs } from "@/lib/programProgress";
import type { PlanTab } from "@/lib/dashboardSessionLinks";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/types/database";
import { isWeekFullyCompleteUnion } from "@/lib/weekCompletionStats";

type Checkin = Database["public"]["Tables"]["progress_checkins"]["Row"];
type WLog = Database["public"]["Tables"]["workout_session_logs"]["Row"];
type Slot = WLog["slot"];
type ScheduleDay = { day: string; session: string; duration: string; focus: string; note: string };

export default function DashboardHome() {
  const { t } = useTranslation("dashboard");
  const { t: tProgram } = useTranslation("program");
  const { hasProgramAccess, profile, user } = useAuth();
  const { toast } = useToast();
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [logs, setLogs] = useState<WLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggleBusy, setToggleBusy] = useState(false);
  const [savingCheckin, setSavingCheckin] = useState(false);
  const [planTab, setPlanTab] = useState<PlanTab>("gym");
  const [checkinWeek, setCheckinWeek] = useState<number | null>(null);

  const weeklySchedule = tProgram("schedule.items", { returnObjects: true }) as ScheduleDay[];
  const progress = useMemo(() => getProgramProgressFromSessionLogs(logs), [logs]);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [c, w] = await Promise.all([
      supabase.from("progress_checkins").select("*").eq("user_id", user.id).order("week_number"),
      supabase.from("workout_session_logs").select("*").eq("user_id", user.id),
    ]);
    if (c.error) toast({ title: t("home.toastLoadCheckins"), description: c.error.message, variant: "destructive" });
    else setCheckins(c.data ?? []);
    if (w.error) toast({ title: t("home.toastLoadWorkouts"), description: w.error.message, variant: "destructive" });
    else setLogs(w.data ?? []);
    setLoading(false);
  }, [user, toast, t]);

  useEffect(() => {
    if (hasProgramAccess && user) load();
    else setLoading(false);
  }, [hasProgramAccess, user, load]);

  useEffect(() => {
    if (hasProgramAccess && checkinWeek === null) {
      setCheckinWeek(progress.weekNumber);
    }
  }, [hasProgramAccess, checkinWeek, progress.weekNumber]);

  const weightChartData = useMemo(
    () =>
      checkins
        .filter((x) => x.weight_kg != null)
        .map((x) => ({ week: x.week_number, kg: x.weight_kg as number })),
    [checkins]
  );

  const trainingWeeksRemaining = Math.max(0, 12 - progress.completedContiguousWeeks);

  async function onToggleSlot(slot: Slot, done: boolean) {
    if (!user) return;
    setToggleBusy(true);
    const { error } = await supabase.from("workout_session_logs").upsert(
      {
        user_id: user.id,
        week_number: progress.weekNumber,
        slot,
        variant: planTab,
        completed: done,
      },
      { onConflict: "user_id,week_number,slot,variant" }
    );
    setToggleBusy(false);
    if (error) {
      toast({ title: t("home.toastUpdateFailed"), description: error.message, variant: "destructive" });
      return;
    }
    const { data: fresh } = await supabase.from("workout_session_logs").select("*").eq("user_id", user.id);
    if (fresh?.length && isWeekFullyCompleteUnion(fresh, progress.weekNumber)) {
      setCheckinWeek(Math.min(12, progress.weekNumber + 1));
    }
    load();
  }

  async function onSetWholeWeek(complete: boolean) {
    if (!user) return;
    setToggleBusy(true);
    const slots: Slot[] = ["mon", "wed", "fri", "sat_bonus"];
    const rows = slots.map((slot) => ({
      user_id: user.id,
      week_number: progress.weekNumber,
      slot,
      variant: planTab,
      completed: complete,
    }));
    const { error } = await supabase.from("workout_session_logs").upsert(rows, {
      onConflict: "user_id,week_number,slot,variant",
    });
    setToggleBusy(false);
    if (error) {
      toast({ title: t("home.toastUpdateFailed"), description: error.message, variant: "destructive" });
      return;
    }
    if (complete) {
      setCheckinWeek(Math.min(12, progress.weekNumber + 1));
    }
    load();
  }

  async function onSaveCheckin(payload: { week: number; weightKg: string; notes: string }) {
    if (!user) return;
    setSavingCheckin(true);
    const upsertPayload = {
      user_id: user.id,
      week_number: payload.week,
      weight_kg: payload.weightKg ? Number(payload.weightKg) : null,
      notes: payload.notes.trim() || null,
    };
    const { error } = await supabase.from("progress_checkins").upsert(upsertPayload, { onConflict: "user_id,week_number" });
    setSavingCheckin(false);
    if (error) {
      toast({ title: t("home.toastSaveFailed"), description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: t("home.toastSaved"), description: t("home.toastSavedDesc", { week: payload.week }) });
    load();
  }

  const firstName = profile?.full_name?.split(" ")[0];

  return (
    <div className="max-w-5xl mx-auto space-y-10 md:space-y-12">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wider mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          {t("home.memberHub")}
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
          {t("home.greeting")}
          {firstName ? `, ${firstName}` : ""}
          <br />
          <span className="text-gradient">{t("home.headline")}</span>
        </h1>
        <p className="text-muted-foreground mt-3 md:text-lg max-w-2xl leading-relaxed">
          {t("home.subhead", { programName: programMeta.name })}
        </p>
      </div>

      {!hasProgramAccess ? (
        <MemberGate>
          <span />
        </MemberGate>
      ) : (
        <>
          {/* Hero: progress + ring */}
          <section className="glass-card glow-green border-primary/15 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 md:gap-10 p-6 md:p-10 items-center">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">{t("home.blockLabel")}</p>
                  <p className="text-2xl md:text-3xl font-black leading-tight">
                    {progress.isComplete ? t("home.closed90") : t("home.dayOf", { day: progress.currentDay, total: 90 })}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {progress.isComplete
                      ? t("home.completeSub")
                      : t("home.weekProgress", { week: progress.weekNumber, percent: progress.percentComplete })}
                  </p>
                  <p className="text-xs text-primary/90 mt-2 font-medium">
                    {t("home.weeksDone", { done: progress.completedContiguousWeeks })}{" "}
                    {trainingWeeksRemaining > 0
                      ? t("home.weeksRemaining", { count: trainingWeeksRemaining })
                      : t("home.allWeeksDone")}
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl bg-background/50 border border-border/60 p-3 text-center">
                    <p className="text-2xl font-black text-primary tabular-nums">{progress.percentComplete}%</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">{t("home.daysArc")}</p>
                  </div>
                  <div className="rounded-xl bg-background/50 border border-border/60 p-3 text-center">
                    <p className="text-2xl font-black tabular-nums">{progress.isComplete ? 0 : progress.daysRemaining}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">{t("home.daysLeft")}</p>
                  </div>
                  <div className="rounded-xl bg-background/50 border border-border/60 p-3 text-center">
                    <p className="text-2xl font-black tabular-nums">{progress.weekNumber}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">{t("home.trainWk")}</p>
                  </div>
                  <div className="rounded-xl bg-background/50 border border-border/60 p-3 text-center">
                    <p className="text-2xl font-black text-primary tabular-nums">
                      {progress.completedContiguousWeeks}
                      <span className="text-muted-foreground text-lg font-bold">/12</span>
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">{t("home.weeksLogged")}</p>
                  </div>
                </div>
                <Button asChild variant="secondary" className="font-semibold">
                  <Link to="/dashboard/progress">
                    {t("home.fullProgress")} <ArrowRight className="icon-directional ms-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="flex justify-center md:justify-end">
                <ProgramProgressRing
                  percent={progress.percentComplete}
                  currentDay={progress.currentDay}
                  daysRemaining={progress.daysRemaining}
                  weekNumber={progress.weekNumber}
                  isComplete={progress.isComplete}
                />
              </div>
            </div>
          </section>

          {/* Weight + schedule snapshot */}
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            <section className="glass-card p-6 md:p-8 border-border/60">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg md:text-xl font-black">{t("home.weightTrend")}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{t("home.weightTrendSub")}</p>
                </div>
              </div>
              {loading ? (
                <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">{t("home.loadingChart")}</div>
              ) : (
                <WeightLineChart data={weightChartData} />
              )}
            </section>

            <section className="glass-card p-6 md:p-8 border-border/60">
              <h2 className="text-lg md:text-xl font-black mb-1">{t("home.weeklyRhythm")}</h2>
              <p className="text-sm text-muted-foreground mb-4">{t("home.weeklyRhythmSub")}</p>
              <ul className="space-y-2">
                {weeklySchedule.slice(0, 5).map((d) => {
                  const isTraining = d.session.startsWith("Training") || d.session === "10-Min Bonus";
                  return (
                    <li
                      key={d.day}
                      className="flex justify-between gap-3 text-sm py-2 border-b border-border/40 last:border-0"
                    >
                      <span className={isTraining ? "font-semibold text-primary" : "text-muted-foreground"}>{d.day}</span>
                      <span className="text-muted-foreground text-right">{d.session}</span>
                    </li>
                  );
                })}
              </ul>
              <Button variant="link" className="px-0 text-primary mt-2 h-auto font-semibold" asChild>
                <Link to="/dashboard/roadmap">
                  {t("home.openRoadmap")} <ArrowRight className="icon-directional h-4 w-4 ms-1" />
                </Link>
              </Button>
            </section>
          </div>

          {/* Session checklist */}
          <section className="glass-card p-6 md:p-8 border-primary/10">
            <WeekWorkoutChecklist
              weekNumber={progress.weekNumber}
              planTab={planTab}
              onPlanTabChange={setPlanTab}
              logs={logs}
              busy={toggleBusy || loading}
              onToggle={onToggleSlot}
              onSetWholeWeek={onSetWholeWeek}
              currentDay={progress.currentDay}
              daysRemaining={progress.daysRemaining}
              programArcComplete={progress.isComplete}
            />
          </section>

          <DashboardWeeklyCheckinCard
            checkins={checkins}
            week={checkinWeek ?? progress.weekNumber}
            onWeekChange={setCheckinWeek}
            saving={savingCheckin}
            onSave={onSaveCheckin}
          />

          <section className="grid sm:grid-cols-2 gap-4 max-w-3xl">
            {[
              { to: "/dashboard/nutrition", title: t("home.nutritionCard"), sub: t("home.nutritionCardSub") },
            ].map((x) => (
              <Link
                key={x.to}
                to={x.to}
                className="glass-card p-5 border-border/60 hover:border-primary/30 hover:bg-card/80 transition-all group flex flex-col"
              >
                <span className="font-black text-lg">{x.title}</span>
                <span className="text-xs text-muted-foreground mt-1">{x.sub}</span>
                <span className="text-primary text-sm font-semibold mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  {t("home.open")} <ArrowRight className="icon-directional h-4 w-4" />
                </span>
              </Link>
            ))}
          </section>

          <section className="glass-card p-6 md:p-8 border-border/60">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">{t("home.mindset")}</p>
            <p className="text-sm md:text-base text-muted-foreground italic leading-relaxed">
              &ldquo;{programMeta.quote}&rdquo; — {programMeta.coach.name}
            </p>
          </section>
        </>
      )}
    </div>
  );
}
