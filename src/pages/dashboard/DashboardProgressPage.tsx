import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MemberGate } from "@/components/MemberGate";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useMemberDashboardCms } from "@/hooks/useMemberAppCms";
import type { Database } from "@/types/database";

type Checkin = Database["public"]["Tables"]["progress_checkins"]["Row"];
type WLog = Database["public"]["Tables"]["workout_session_logs"]["Row"];

type ExpectationRow = { metric: string; w1: string; w2: string; w3: string };

const SLOT_KEYS = ["mon", "wed", "fri", "sat_bonus"] as const;

export default function DashboardProgressPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation("dashboard");
  const { content: dashboardCms } = useMemberDashboardCms();
  const [week, setWeek] = useState(1);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [logs, setLogs] = useState<WLog[]>([]);
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [logWeek, setLogWeek] = useState(1);
  const [variant, setVariant] = useState<WLog["variant"]>("gym");
  const [slotStates, setSlotStates] = useState<Record<string, boolean>>({});

  const progressExpectations = t("progress.expectations", { returnObjects: true }) as ExpectationRow[];

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [c, w] = await Promise.all([
      supabase.from("progress_checkins").select("*").eq("user_id", user.id).order("week_number"),
      supabase.from("workout_session_logs").select("*").eq("user_id", user.id),
    ]);
    if (c.error) toast({ title: t("home.toastLoadCheckins"), description: c.error.message, variant: "destructive" });
    else setCheckins(c.data ?? []);
    if (w.error) toast({ title: t("progress.toastLoadSessionLog"), description: w.error.message, variant: "destructive" });
    else setLogs(w.data ?? []);
    setLoading(false);
  }, [user, toast, t]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const next: Record<string, boolean> = {};
    for (const s of SLOT_KEYS) {
      const row = logs.find((l) => l.week_number === logWeek && l.slot === s && l.variant === variant);
      next[s] = row?.completed ?? false;
    }
    setSlotStates(next);
  }, [logs, logWeek, variant]);

  async function saveCheckin(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const payload = {
      user_id: user.id,
      week_number: week,
      weight_kg: weight ? Number(weight) : null,
      notes: notes || null,
    };
    const { error } = await supabase.from("progress_checkins").upsert(payload, { onConflict: "user_id,week_number" });
    setSaving(false);
    if (error) {
      toast({ title: t("home.toastSaveFailed"), description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: t("home.toastSaved"), description: t("home.toastSavedDesc", { week }) });
    setNotes("");
    load();
  }

  async function toggleSlot(slot: WLog["slot"], done: boolean) {
    if (!user) return;
    const { error } = await supabase.from("workout_session_logs").upsert(
      {
        user_id: user.id,
        week_number: logWeek,
        slot,
        variant,
        completed: done,
      },
      { onConflict: "user_id,week_number,slot,variant" }
    );
    if (error) {
      toast({ title: t("home.toastUpdateFailed"), description: error.message, variant: "destructive" });
      return;
    }
    setSlotStates((prev) => ({ ...prev, [slot]: done }));
    load();
  }

  return (
    <MemberGate>
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-black">{dashboardCms.progress.title}</h1>
          <p className="text-muted-foreground mt-2">{dashboardCms.progress.headline}</p>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{dashboardCms.progress.body}</p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">{dashboardCms.progress.expectationsTitle}</CardTitle>
            <CardDescription>{dashboardCms.progress.expectationsSubhead}</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="pb-2 pr-4">{t("progress.table.metric")}</th>
                  <th className="pb-2 pr-4">{t("progress.table.weeks1to4")}</th>
                  <th className="pb-2 pr-4">{t("progress.table.weeks5to8")}</th>
                  <th className="pb-2">{t("progress.table.weeks9to12")}</th>
                </tr>
              </thead>
              <tbody>
                {progressExpectations.map((row) => (
                  <tr key={row.metric} className="border-b border-border/40">
                    <td className="py-3 pr-4 font-medium">{row.metric}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{row.w1}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{row.w2}</td>
                    <td className="py-3 text-muted-foreground">{row.w3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">{t("progress.weeklyCheckin")}</CardTitle>
              <CardDescription>{t("progress.weeklyCheckinSub")}</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">{t("progress.loading")}</p>
              ) : (
                <form onSubmit={saveCheckin} className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t("progress.weekLabel")}</Label>
                    <Select value={String(week)} onValueChange={(v) => setWeek(Number(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {t("progress.weekOption", { n })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">{t("progress.weightKg")}</Label>
                    <Input id="weight" type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={t("progress.weightPlaceholder")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wnotes">{t("progress.notes")}</Label>
                    <Textarea id="wnotes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder={t("progress.notesPlaceholder")} />
                  </div>
                  <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground font-semibold">
                    {saving ? t("progress.saving") : t("progress.saveCheckin")}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">{t("progress.sessionCompletion")}</CardTitle>
              <CardDescription>{t("progress.sessionCompletionSub")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 flex-wrap">
                <div className="space-y-2">
                  <Label>{t("progress.week")}</Label>
                  <Select value={String(logWeek)} onValueChange={(v) => setLogWeek(Number(v))}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("progress.version")}</Label>
                  <Select value={variant} onValueChange={(v) => setVariant(v as WLog["variant"])}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gym">{t("training.tabs.gym")}</SelectItem>
                      <SelectItem value="home">{t("training.tabs.home")}</SelectItem>
                      <SelectItem value="emergency">{t("training.tabs.emergency")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-3">
                {SLOT_KEYS.map((s) => (
                  <div key={s} className="flex items-center justify-between gap-4 py-2 border-b border-border/40">
                    <span className="text-sm">{t(`progress.slots.${s}`)}</span>
                    <Switch checked={slotStates[s] ?? false} onCheckedChange={(v) => toggleSlot(s, v)} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {checkins.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">{t("progress.history")}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              {checkins.map((c) => (
                <div key={c.id} className="flex flex-wrap gap-4 border-b border-border/30 py-2">
                  <span className="font-medium">{t("progress.weekOption", { n: c.week_number })}</span>
                  {c.weight_kg != null && <span className="text-muted-foreground">{c.weight_kg} kg</span>}
                  {c.notes && <span className="text-muted-foreground">{c.notes}</span>}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </MemberGate>
  );
}
