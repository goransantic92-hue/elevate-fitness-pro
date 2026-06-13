import { useCallback, useEffect, useState } from "react";
import { Loader2, Upload, Video } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CmsWorkflowBar } from "@/components/admin/CmsWorkflowBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  fetchSiteContentRow,
  getDefaultSiteCms,
  publishSiteContent,
  requestSiteReview,
  saveSiteDraft,
} from "@/lib/siteCms";
import { PLAN_IDS, uploadWorkoutDemoFile } from "@/lib/workoutCms";
import type { HomepageLocale, HomepageReviewStatus } from "@/types/homepageCms";
import type {
  ExerciseCms,
  MemberWorkoutsCmsPayload,
  SiteContentRow,
  WorkoutPlanCms,
} from "@/types/siteCms";

const statusLabels: Record<HomepageReviewStatus, string> = {
  draft: "Draft",
  pending_review: "Pending review",
  published: "Published",
};

type Variant = "gym" | "home" | "emergency";
type PlanCode = (typeof PLAN_IDS)[number];

export default function AdminWorkoutsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [locale, setLocale] = useState<HomepageLocale>("en");
  const [variant, setVariant] = useState<Variant>("gym");
  const [code, setCode] = useState<PlanCode>("a");
  const [row, setRow] = useState<SiteContentRow<"member_workouts"> | null>(null);
  const [draft, setDraft] = useState<MemberWorkoutsCmsPayload>(() => getDefaultSiteCms("member_workouts", "en"));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    const loc = locale;
    setLoading(true);
    try {
      const next = await fetchSiteContentRow("member_workouts", loc);
      if (loc !== locale) return;
      setRow(next);
      setDraft(next.draft);
    } catch (error) {
      if (loc !== locale) return;
      toast({
        title: "Load failed",
        description: error instanceof Error ? error.message : "Could not load workouts.",
        variant: "destructive",
      });
    } finally {
      if (loc === locale) setLoading(false);
    }
  }, [locale, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  function changeLocale(loc: HomepageLocale) {
    setLocale(loc);
    setDraft(getDefaultSiteCms("member_workouts", loc));
    setRow(null);
    setLoading(true);
  }

  function changeVariant(v: Variant) {
    setVariant(v);
    if (v === "emergency") return;
    setCode("a");
  }

  async function persist(action: "draft" | "review" | "publish") {
    setSaving(true);
    try {
      if (action === "draft") await saveSiteDraft("member_workouts", locale, draft, user?.id);
      if (action === "review") await requestSiteReview("member_workouts", locale, draft, user?.id);
      if (action === "publish") await publishSiteContent("member_workouts", locale, draft, user?.id);
      toast({
        title: action === "publish" ? "Published" : action === "review" ? "Sent for review" : "Draft saved",
      });
      await load();
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Could not save.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  function updatePlan(updater: (plan: WorkoutPlanCms) => WorkoutPlanCms) {
    if (variant === "emergency") return;
    setDraft((current) => ({
      ...current,
      [variant]: {
        ...current[variant],
        [code]: updater(current[variant][code]),
      },
    }));
  }

  function updateExercise(index: number, patch: Partial<ExerciseCms>) {
    updatePlan((plan) => {
      const exercises = [...plan.exercises];
      exercises[index] = { ...exercises[index], ...patch };
      return { ...plan, exercises };
    });
  }

  async function handleVideoUpload(index: number, file: File | undefined) {
    if (!file || variant === "emergency") return;
    const ex = draft[variant][code].exercises[index];
    const path =
      ex.demoVideoPath?.trim() ||
      `${variant}/${code}/${String(ex.order).padStart(2, "0")}-${ex.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}.mp4`;
    const key = `${variant}-${code}-${index}`;
    setUploadingKey(key);
    try {
      const uploaded = await uploadWorkoutDemoFile(file, path);
      updateExercise(index, { demoVideoPath: uploaded, demoVideoPaths: undefined });
      toast({ title: "Video uploaded", description: uploaded });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Could not upload video.",
        variant: "destructive",
      });
    } finally {
      setUploadingKey(null);
    }
  }

  const plan = variant !== "emergency" ? draft[variant][code] : null;

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading workout editor…
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Workouts</h1>
          <p className="text-muted-foreground mt-2">
            Edit gym A/B/C, home A/B/C, 10-minute emergency sessions, exercise copy, and demo video paths — publish without deploy.
          </p>
        </div>
        {row && <Badge variant="outline" className="uppercase text-xs">{statusLabels[row.review_status]}</Badge>}
      </div>

      <Tabs value={locale} onValueChange={(v) => changeLocale(v as HomepageLocale)}>
        <Label className="mb-2 block">Language</Label>
        <TabsList>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="ar">Arabic</TabsTrigger>
        </TabsList>
      </Tabs>

      <Tabs value={variant} onValueChange={(v) => changeVariant(v as Variant)}>
        <TabsList>
          <TabsTrigger value="gym">Gym</TabsTrigger>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="emergency">10-min emergency</TabsTrigger>
        </TabsList>
      </Tabs>

      {variant !== "emergency" && (
        <Tabs value={code} onValueChange={(v) => setCode(v as PlanCode)}>
          <TabsList>
            {PLAN_IDS.map((id) => (
              <TabsTrigger key={id} value={id}>Workout {id.toUpperCase()}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {plan && (
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-lg">Session header</CardTitle></CardHeader>
            <CardContent className="grid gap-3">
              <Input value={plan.title} onChange={(e) => updatePlan((p) => ({ ...p, title: e.target.value }))} placeholder="Title" />
              <Input value={plan.focus} onChange={(e) => updatePlan((p) => ({ ...p, focus: e.target.value }))} placeholder="Focus line" />
              <Textarea rows={2} value={plan.warmup} onChange={(e) => updatePlan((p) => ({ ...p, warmup: e.target.value }))} placeholder="Warm-up" />
              <Textarea rows={2} value={plan.finisher} onChange={(e) => updatePlan((p) => ({ ...p, finisher: e.target.value }))} placeholder="Finisher" />
            </CardContent>
          </Card>

          {plan.exercises.map((ex, i) => (
            <Card key={`${ex.order}-${i}`} className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">Exercise {ex.order}</CardTitle>
                <CardDescription>{ex.name || "Unnamed exercise"}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <Input className="sm:col-span-2" value={ex.name} onChange={(e) => updateExercise(i, { name: e.target.value })} placeholder="Name" />
                <Input value={ex.target} onChange={(e) => updateExercise(i, { target: e.target.value })} placeholder="Target muscles" />
                <Input value={ex.sets} onChange={(e) => updateExercise(i, { sets: e.target.value })} placeholder="Sets" />
                <Input value={ex.reps} onChange={(e) => updateExercise(i, { reps: e.target.value })} placeholder="Reps" />
                <Input value={ex.rest} onChange={(e) => updateExercise(i, { rest: e.target.value })} placeholder="Rest" />
                <Textarea className="sm:col-span-2" rows={2} value={ex.tip} onChange={(e) => updateExercise(i, { tip: e.target.value })} placeholder="Coach tip" />
                <div className="sm:col-span-2 space-y-2">
                  <Label>Demo video path (workout-demos bucket)</Label>
                  <Input
                    value={ex.demoVideoPath ?? ""}
                    onChange={(e) => updateExercise(i, { demoVideoPath: e.target.value || undefined })}
                    placeholder="gym/a/01-bench-press.mp4"
                  />
                  <div className="flex flex-wrap gap-2 items-center">
                    <Label className="cursor-pointer">
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        className="sr-only"
                        onChange={(e) => void handleVideoUpload(i, e.target.files?.[0])}
                      />
                      <Button type="button" variant="outline" size="sm" asChild disabled={uploadingKey === `${variant}-${code}-${i}`}>
                        <span>
                          {uploadingKey === `${variant}-${code}-${i}` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Video className="h-4 w-4" />
                          )}
                          <span className="ms-2">Upload video</span>
                        </span>
                      </Button>
                    </Label>
                    {ex.demoVideoPaths && ex.demoVideoPaths.length > 0 && (
                      <span className="text-xs text-muted-foreground">{ex.demoVideoPaths.length} clip variants in CMS</span>
                    )}
                  </div>
                  <Input
                    type="number"
                    min={0}
                    step={1}
                    value={ex.demoVideoStartSec ?? ""}
                    onChange={(e) =>
                      updateExercise(i, {
                        demoVideoStartSec: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="Start offset (seconds, optional)"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {variant === "emergency" && (
        <div className="space-y-6">
          {draft.emergency.map((w, wi) => (
            <Card key={w.id} className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">{w.name}</CardTitle>
                <CardDescription>{w.id} · {w.time}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    value={w.name}
                    onChange={(e) => {
                      const emergency = [...draft.emergency];
                      emergency[wi] = { ...emergency[wi], name: e.target.value };
                      setDraft({ ...draft, emergency });
                    }}
                  />
                  <Input
                    value={w.time}
                    onChange={(e) => {
                      const emergency = [...draft.emergency];
                      emergency[wi] = { ...emergency[wi], time: e.target.value };
                      setDraft({ ...draft, emergency });
                    }}
                  />
                </div>
                {w.rows.map((row, ri) => (
                  <div key={ri} className="grid gap-2 sm:grid-cols-4 border-t border-border/40 pt-3">
                    <Input
                      className="sm:col-span-2"
                      value={row.exercise}
                      onChange={(e) => {
                        const emergency = [...draft.emergency];
                        const rows = [...emergency[wi].rows];
                        rows[ri] = { ...rows[ri], exercise: e.target.value };
                        emergency[wi] = { ...emergency[wi], rows };
                        setDraft({ ...draft, emergency });
                      }}
                      placeholder="Exercise"
                    />
                    <Input
                      value={row.sets}
                      onChange={(e) => {
                        const emergency = [...draft.emergency];
                        const rows = [...emergency[wi].rows];
                        rows[ri] = { ...rows[ri], sets: e.target.value };
                        emergency[wi] = { ...emergency[wi], rows };
                        setDraft({ ...draft, emergency });
                      }}
                      placeholder="Sets"
                    />
                    <Input
                      value={row.reps}
                      onChange={(e) => {
                        const emergency = [...draft.emergency];
                        const rows = [...emergency[wi].rows];
                        rows[ri] = { ...rows[ri], reps: e.target.value };
                        emergency[wi] = { ...emergency[wi], rows };
                        setDraft({ ...draft, emergency });
                      }}
                      placeholder="Reps"
                    />
                    <Input
                      className="sm:col-span-4"
                      value={row.rest}
                      onChange={(e) => {
                        const emergency = [...draft.emergency];
                        const rows = [...emergency[wi].rows];
                        rows[ri] = { ...rows[ri], rest: e.target.value };
                        emergency[wi] = { ...emergency[wi], rows };
                        setDraft({ ...draft, emergency });
                      }}
                      placeholder="Rest"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Publish workflow</CardTitle>
          <CardDescription>Members see changes in the training app after publish — no code deploy.</CardDescription>
        </CardHeader>
        <CardContent>
          <CmsWorkflowBar
            saving={saving}
            onSaveDraft={() => void persist("draft")}
            onRequestReview={() => void persist("review")}
            onPublish={() => void persist("publish")}
            onResetPublished={() => row && setDraft(row.published)}
            onResetDefaults={() => setDraft(getDefaultSiteCms("member_workouts", locale))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
