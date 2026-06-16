import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CmsWorkflowBar } from "@/components/admin/CmsWorkflowBar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { arrayToLines, linesToArray } from "@/lib/cmsUtils";
import {
  fetchSiteContentRow,
  getDefaultSiteCms,
  publishSiteContent,
  requestSiteReview,
  saveSiteDraft,
} from "@/lib/siteCms";
import type { HomepageLocale, HomepageReviewStatus } from "@/types/homepageCms";
import type {
  MemberDashboardCmsPayload,
  MemberNutritionCmsPayload,
  MemberRoadmapCmsPayload,
  SiteContentRow,
  SiteCmsPayloadMap,
} from "@/types/siteCms";
import { MEMBER_APP_PAGE_KEYS } from "@/types/siteCms";

const statusLabels: Record<HomepageReviewStatus, string> = {
  draft: "Draft",
  pending_review: "Pending review",
  published: "Published",
};

const TAB_LABELS: Record<(typeof MEMBER_APP_PAGE_KEYS)[number], string> = {
  member_dashboard: "Dashboard copy",
  member_nutrition: "Nutrition",
  member_roadmap: "Roadmap",
};

export default function AdminMemberAppPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [pageKey, setPageKey] = useState<(typeof MEMBER_APP_PAGE_KEYS)[number]>("member_dashboard");
  const [locale, setLocale] = useState<HomepageLocale>("en");
  const [row, setRow] = useState<SiteContentRow | null>(null);
  const [draft, setDraft] = useState<SiteCmsPayloadMap[(typeof MEMBER_APP_PAGE_KEYS)[number]]>(() =>
    getDefaultSiteCms("member_dashboard", "en")
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const key = pageKey;
    const loc = locale;
    setLoading(true);
    try {
      const next = await fetchSiteContentRow(key, loc);
      if (key !== pageKey || loc !== locale) return;
      setRow(next);
      setDraft(next.draft);
    } catch (error) {
      if (key !== pageKey || loc !== locale) return;
      toast({
        title: "Load failed",
        description: error instanceof Error ? error.message : "Could not load member app content.",
        variant: "destructive",
      });
    } finally {
      if (key === pageKey && loc === locale) setLoading(false);
    }
  }, [locale, pageKey, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  function changePageKey(key: (typeof MEMBER_APP_PAGE_KEYS)[number]) {
    setPageKey(key);
    setDraft(getDefaultSiteCms(key, locale));
    setRow(null);
    setLoading(true);
  }

  function changeLocale(loc: HomepageLocale) {
    setLocale(loc);
    setDraft(getDefaultSiteCms(pageKey, loc));
    setRow(null);
    setLoading(true);
  }

  async function persist(action: "draft" | "review" | "publish") {
    setSaving(true);
    try {
      if (action === "draft") await saveSiteDraft(pageKey, locale, draft, user?.id);
      if (action === "review") await requestSiteReview(pageKey, locale, draft, user?.id);
      if (action === "publish") await publishSiteContent(pageKey, locale, draft, user?.id);
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

  function renderDashboardForm() {
    const d = draft as MemberDashboardCmsPayload;
    const section = (title: string, children: React.ReactNode) => (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">{children}</CardContent>
      </Card>
    );
    return (
      <div className="space-y-6">
        {section("Access gate (non-members)", (
          <>
            <Input value={d.gate.title} onChange={(e) => setDraft({ ...d, gate: { ...d.gate, title: e.target.value } })} placeholder="Gate title" />
            <Textarea rows={2} value={d.gate.description} onChange={(e) => setDraft({ ...d, gate: { ...d.gate, description: e.target.value } })} />
          </>
        ))}
        {section("Home headline", (
          <>
            <Input value={d.home.headline} onChange={(e) => setDraft({ ...d, home: { ...d.home, headline: e.target.value } })} />
            <Textarea rows={2} value={d.home.subhead} onChange={(e) => setDraft({ ...d, home: { ...d.home, subhead: e.target.value } })} />
          </>
        ))}
        {section("Training page", (
          <>
            <Input value={d.training.title} onChange={(e) => setDraft({ ...d, training: { ...d.training, title: e.target.value } })} />
            <Textarea rows={2} value={d.training.subhead} onChange={(e) => setDraft({ ...d, training: { ...d.training, subhead: e.target.value } })} />
          </>
        ))}
        {section("Progress page", (
          <>
            <Input value={d.progress.title} onChange={(e) => setDraft({ ...d, progress: { ...d.progress, title: e.target.value } })} />
            <Input value={d.progress.headline} onChange={(e) => setDraft({ ...d, progress: { ...d.progress, headline: e.target.value } })} />
            <Textarea rows={3} value={d.progress.body} onChange={(e) => setDraft({ ...d, progress: { ...d.progress, body: e.target.value } })} />
            <Input value={d.progress.expectationsTitle} onChange={(e) => setDraft({ ...d, progress: { ...d.progress, expectationsTitle: e.target.value } })} />
            <Textarea rows={2} value={d.progress.expectationsSubhead} onChange={(e) => setDraft({ ...d, progress: { ...d.progress, expectationsSubhead: e.target.value } })} />
          </>
        ))}
      </div>
    );
  }

  function renderNutritionForm() {
    const d = draft as MemberNutritionCmsPayload;
    return (
      <div className="space-y-6">
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-lg">Page header</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            <Input value={d.title} onChange={(e) => setDraft({ ...d, title: e.target.value })} />
            <Textarea rows={2} value={d.subhead} onChange={(e) => setDraft({ ...d, subhead: e.target.value })} />
          </CardContent>
        </Card>
        {d.rules.map((rule, i) => (
          <Card key={rule.number} className="glass-card">
            <CardHeader><CardTitle className="text-base">Rule {rule.number}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Input value={rule.title} onChange={(e) => { const rules = [...d.rules]; rules[i] = { ...rules[i], title: e.target.value }; setDraft({ ...d, rules }); }} />
              <Textarea rows={4} value={rule.body} onChange={(e) => { const rules = [...d.rules]; rules[i] = { ...rules[i], body: e.target.value }; setDraft({ ...d, rules }); }} />
            </CardContent>
          </Card>
        ))}
        {d.meals.map((meal, i) => (
          <Card key={meal.name} className="glass-card">
            <CardHeader><CardTitle className="text-base">{meal.name}</CardTitle></CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              <Input value={meal.time} onChange={(e) => { const meals = [...d.meals]; meals[i] = { ...meals[i], time: e.target.value }; setDraft({ ...d, meals }); }} placeholder="Time" />
              <Input value={meal.meal} onChange={(e) => { const meals = [...d.meals]; meals[i] = { ...meals[i], meal: e.target.value }; setDraft({ ...d, meals }); }} placeholder="Meal" />
              <Input className="sm:col-span-2" value={meal.macros} onChange={(e) => { const meals = [...d.meals]; meals[i] = { ...meals[i], macros: e.target.value }; setDraft({ ...d, meals }); }} />
              <Textarea className="sm:col-span-2" rows={2} value={meal.tip} onChange={(e) => { const meals = [...d.meals]; meals[i] = { ...meals[i], tip: e.target.value }; setDraft({ ...d, meals }); }} />
            </CardContent>
          </Card>
        ))}
        {d.eatAnywhere.map((block, i) => (
          <Card key={block.place} className="glass-card">
            <CardHeader><CardTitle className="text-base">{block.place}</CardTitle></CardHeader>
            <CardContent>
              <Textarea rows={4} value={arrayToLines(block.tips)} onChange={(e) => {
                const eatAnywhere = [...d.eatAnywhere];
                eatAnywhere[i] = { ...eatAnywhere[i], tips: linesToArray(e.target.value) };
                setDraft({ ...d, eatAnywhere });
              }} placeholder="Tips (one per line)" />
            </CardContent>
          </Card>
        ))}
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">90/10 rule</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Input value={d.rule9010.title} onChange={(e) => setDraft({ ...d, rule9010: { ...d.rule9010, title: e.target.value } })} />
            <Textarea rows={3} value={d.rule9010.body} onChange={(e) => setDraft({ ...d, rule9010: { ...d.rule9010, body: e.target.value } })} />
            <Textarea rows={2} value={d.rule9010.quote} onChange={(e) => setDraft({ ...d, rule9010: { ...d.rule9010, quote: e.target.value } })} />
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderRoadmapForm() {
    const d = draft as MemberRoadmapCmsPayload;
    return (
      <div className="space-y-6">
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-lg">Page header</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            <Input value={d.title} onChange={(e) => setDraft({ ...d, title: e.target.value })} />
            <Textarea rows={2} value={d.subhead} onChange={(e) => setDraft({ ...d, subhead: e.target.value })} />
            <Input value={d.scheduleTitle} onChange={(e) => setDraft({ ...d, scheduleTitle: e.target.value })} placeholder="Schedule title" />
            <Textarea rows={2} value={d.scheduleSubhead} onChange={(e) => setDraft({ ...d, scheduleSubhead: e.target.value })} />
          </CardContent>
        </Card>
        {d.phases.map((phase, i) => (
          <Card key={phase.number} className="glass-card">
            <CardHeader><CardTitle className="text-base">Phase {phase.number}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Input value={phase.name} onChange={(e) => { const phases = [...d.phases]; phases[i] = { ...phases[i], name: e.target.value }; setDraft({ ...d, phases }); }} />
              <Input value={phase.weeks} onChange={(e) => { const phases = [...d.phases]; phases[i] = { ...phases[i], weeks: e.target.value }; setDraft({ ...d, phases }); }} />
              <Textarea rows={3} value={phase.description} onChange={(e) => { const phases = [...d.phases]; phases[i] = { ...phases[i], description: e.target.value }; setDraft({ ...d, phases }); }} />
              <Textarea rows={2} value={arrayToLines(phase.focus)} onChange={(e) => { const phases = [...d.phases]; phases[i] = { ...phases[i], focus: linesToArray(e.target.value) }; setDraft({ ...d, phases }); }} placeholder="Focus tags (one per line)" />
            </CardContent>
          </Card>
        ))}
        {d.schedule.map((day, i) => (
          <Card key={day.day} className="glass-card">
            <CardHeader><CardTitle className="text-base">{day.day}</CardTitle></CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              <Input value={day.session} onChange={(e) => { const schedule = [...d.schedule]; schedule[i] = { ...schedule[i], session: e.target.value }; setDraft({ ...d, schedule }); }} />
              <Input value={day.duration} onChange={(e) => { const schedule = [...d.schedule]; schedule[i] = { ...schedule[i], duration: e.target.value }; setDraft({ ...d, schedule }); }} />
              <Input value={day.focus} onChange={(e) => { const schedule = [...d.schedule]; schedule[i] = { ...schedule[i], focus: e.target.value }; setDraft({ ...d, schedule }); }} />
              <Input value={day.note} onChange={(e) => { const schedule = [...d.schedule]; schedule[i] = { ...schedule[i], note: e.target.value }; setDraft({ ...d, schedule }); }} />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading member app editor…
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Member app content</h1>
          <p className="text-muted-foreground mt-2">
            Edit dashboard copy, member nutrition, and roadmap — live without a deploy.
          </p>
        </div>
        {row && <Badge variant="outline" className="uppercase text-xs">{statusLabels[row.review_status]}</Badge>}
      </div>

      <Tabs value={pageKey} onValueChange={(v) => changePageKey(v as (typeof MEMBER_APP_PAGE_KEYS)[number])}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          {MEMBER_APP_PAGE_KEYS.map((key) => (
            <TabsTrigger key={key} value={key}>{TAB_LABELS[key]}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Tabs value={locale} onValueChange={(v) => changeLocale(v as HomepageLocale)}>
        <Label className="mb-2 block">Language</Label>
        <TabsList>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="ar">Arabic</TabsTrigger>
          <TabsTrigger value="sr">Serbian</TabsTrigger>
        </TabsList>
      </Tabs>

      {pageKey === "member_dashboard" && renderDashboardForm()}
      {pageKey === "member_nutrition" && renderNutritionForm()}
      {pageKey === "member_roadmap" && renderRoadmapForm()}

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Publish workflow</CardTitle>
          <CardDescription>Save draft, request review, or publish to the member app immediately.</CardDescription>
        </CardHeader>
        <CardContent>
          <CmsWorkflowBar
            saving={saving}
            onSaveDraft={() => void persist("draft")}
            onRequestReview={() => void persist("review")}
            onPublish={() => void persist("publish")}
            onResetPublished={() => row && setDraft(row.published)}
            onResetDefaults={() => setDraft(getDefaultSiteCms(pageKey, locale))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
