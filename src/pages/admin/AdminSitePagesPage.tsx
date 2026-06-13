import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CmsWorkflowBar } from "@/components/admin/CmsWorkflowBar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { arrayToLines, linesToArray } from "@/lib/cmsUtils";
import { HANDBOOK_IDS } from "@/lib/handbooks";
import {
  fetchSiteContentRow,
  getDefaultSiteCms,
  publishSiteContent,
  requestSiteReview,
  saveSiteDraft,
  uploadSiteImage,
} from "@/lib/siteCms";
import { homepageStorageUrl } from "@/lib/homepageMedia";
import type { HomepageLocale, HomepageReviewStatus } from "@/types/homepageCms";
import type {
  CoachingCmsPayload,
  FaqCmsPayload,
  HandbooksCmsPayload,
  NutritionCmsPayload,
  PricingCmsPayload,
  ProgramCmsPayload,
  SiteContentRow,
  SiteCmsPayloadMap,
  SitePageKey,
} from "@/types/siteCms";
import { SITE_PAGE_LABELS, MARKETING_SITE_PAGE_KEYS } from "@/types/siteCms";

const statusLabels: Record<HomepageReviewStatus, string> = {
  draft: "Draft",
  pending_review: "Pending review",
  published: "Published",
};

const PAGE_KEYS = MARKETING_SITE_PAGE_KEYS;

export default function AdminSitePagesPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [pageKey, setPageKey] = useState<SitePageKey>("pricing");
  const [locale, setLocale] = useState<HomepageLocale>("en");
  const [row, setRow] = useState<SiteContentRow | null>(null);
  const [draft, setDraft] = useState<SiteCmsPayloadMap[SitePageKey]>(() => getDefaultSiteCms("pricing", "en"));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const next = await fetchSiteContentRow(pageKey, locale);
      setRow(next);
      setDraft(next.draft);
    } catch (error) {
      toast({
        title: "Load failed",
        description: error instanceof Error ? error.message : "Could not load page content.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [locale, pageKey, toast]);

  useEffect(() => {
    setDraft(getDefaultSiteCms(pageKey, locale));
    load();
  }, [load, locale, pageKey]);

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

  async function uploadHandbookCover(id: string, file: File | undefined) {
    if (!file) return;
    setUploadingId(id);
    try {
      const path = await uploadSiteImage(file, locale, `handbooks/${id}`);
      setDraft((current) => {
        const h = current as HandbooksCmsPayload;
        return {
          ...h,
          items: { ...h.items, [id]: { ...h.items[id], imagePath: path } },
        };
      });
      toast({ title: "Image uploaded" });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Could not upload.",
        variant: "destructive",
      });
    } finally {
      setUploadingId(null);
    }
  }

  function renderForm() {
    if (pageKey === "pricing") {
      const d = draft as PricingCmsPayload;
      return (
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-lg">Hero</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Input value={d.hero.eyebrow} onChange={(e) => setDraft({ ...d, hero: { ...d.hero, eyebrow: e.target.value } })} placeholder="Eyebrow" />
              <Input value={d.hero.headline} onChange={(e) => setDraft({ ...d, hero: { ...d.hero, headline: e.target.value } })} placeholder="Headline" />
              <Input value={d.hero.headlineHighlight} onChange={(e) => setDraft({ ...d, hero: { ...d.hero, headlineHighlight: e.target.value } })} placeholder="Highlight" />
              <Textarea className="sm:col-span-2" rows={2} value={d.hero.subhead} onChange={(e) => setDraft({ ...d, hero: { ...d.hero, subhead: e.target.value } })} />
              <Input className="sm:col-span-2" value={d.launchBadge} onChange={(e) => setDraft({ ...d, launchBadge: e.target.value })} placeholder="Launch badge" />
              <Textarea className="sm:col-span-2" rows={8} value={arrayToLines(d.features)} onChange={(e) => setDraft({ ...d, features: linesToArray(e.target.value) })} placeholder="Features (one per line)" />
            </CardContent>
          </Card>
          {d.testimonials.map((item, i) => (
            <Card key={i} className="glass-card">
              <CardHeader><CardTitle className="text-base">Testimonial {i + 1}</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Textarea rows={3} value={item.quote} onChange={(e) => {
                  const testimonials = [...d.testimonials];
                  testimonials[i] = { ...testimonials[i], quote: e.target.value };
                  setDraft({ ...d, testimonials });
                }} />
                <Input value={item.name} onChange={(e) => {
                  const testimonials = [...d.testimonials];
                  testimonials[i] = { ...testimonials[i], name: e.target.value };
                  setDraft({ ...d, testimonials });
                }} />
                <Input value={item.sub} onChange={(e) => {
                  const testimonials = [...d.testimonials];
                  testimonials[i] = { ...testimonials[i], sub: e.target.value };
                  setDraft({ ...d, testimonials });
                }} />
              </CardContent>
            </Card>
          ))}
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base">Coach quote</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Textarea rows={3} value={d.coachQuote.text} onChange={(e) => setDraft({ ...d, coachQuote: { ...d.coachQuote, text: e.target.value } })} />
              <Input value={d.coachQuote.attribution} onChange={(e) => setDraft({ ...d, coachQuote: { ...d.coachQuote, attribution: e.target.value } })} />
            </CardContent>
          </Card>
        </div>
      );
    }

    if (pageKey === "faq") {
      const d = draft as FaqCmsPayload;
      return (
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-lg">Page header</CardTitle></CardHeader>
            <CardContent className="grid gap-3">
              <Input value={d.page.eyebrow} onChange={(e) => setDraft({ ...d, page: { ...d.page, eyebrow: e.target.value } })} />
              <Input value={d.page.headline} onChange={(e) => setDraft({ ...d, page: { ...d.page, headline: e.target.value } })} />
              <Input value={d.page.headlineHighlight} onChange={(e) => setDraft({ ...d, page: { ...d.page, headlineHighlight: e.target.value } })} />
              <Textarea rows={2} value={d.page.subhead} onChange={(e) => setDraft({ ...d, page: { ...d.page, subhead: e.target.value } })} />
            </CardContent>
          </Card>
          {d.items.map((item, i) => (
            <Card key={i} className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">FAQ {i + 1}</CardTitle>
                <Button type="button" variant="ghost" size="sm" onClick={() => setDraft({ ...d, items: d.items.filter((_, idx) => idx !== i) })}>Remove</Button>
              </CardHeader>
              <CardContent className="space-y-2">
                <Input value={item.q} onChange={(e) => {
                  const items = [...d.items];
                  items[i] = { ...items[i], q: e.target.value };
                  setDraft({ ...d, items });
                }} />
                <Textarea rows={4} value={item.a} onChange={(e) => {
                  const items = [...d.items];
                  items[i] = { ...items[i], a: e.target.value };
                  setDraft({ ...d, items });
                }} />
              </CardContent>
            </Card>
          ))}
          <Button type="button" variant="outline" onClick={() => setDraft({ ...d, items: [...d.items, { q: "New question?", a: "Answer here." }] })}>
            Add FAQ item
          </Button>
        </div>
      );
    }

    if (pageKey === "handbooks") {
      const d = draft as HandbooksCmsPayload;
      return (
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-lg">Section header</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Input value={d.eyebrow} onChange={(e) => setDraft({ ...d, eyebrow: e.target.value })} />
              <Input value={d.title} onChange={(e) => setDraft({ ...d, title: e.target.value })} />
              <Textarea rows={2} value={d.subhead} onChange={(e) => setDraft({ ...d, subhead: e.target.value })} />
            </CardContent>
          </Card>
          {HANDBOOK_IDS.map((id) => (
            <Card key={id} className="glass-card">
              <CardHeader><CardTitle className="text-base">{id}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Input value={d.items[id]?.title ?? ""} onChange={(e) => setDraft({ ...d, items: { ...d.items, [id]: { ...d.items[id], title: e.target.value } } })} />
                <Textarea rows={2} value={d.items[id]?.description ?? ""} onChange={(e) => setDraft({ ...d, items: { ...d.items, [id]: { ...d.items[id], description: e.target.value } } })} />
                <Input value={d.items[id]?.imageAlt ?? ""} onChange={(e) => setDraft({ ...d, items: { ...d.items, [id]: { ...d.items[id], imageAlt: e.target.value } } })} />
                <Button type="button" variant="outline" size="sm" disabled={uploadingId === id} asChild>
                  <label className="cursor-pointer">
                    {uploadingId === id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload cover"}
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => { void uploadHandbookCover(id, e.target.files?.[0]); e.target.value = ""; }} />
                  </label>
                </Button>
                {d.items[id]?.imagePath && (
                  <img src={homepageStorageUrl(d.items[id].imagePath) ?? ""} alt="" className="h-24 w-auto rounded border" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (pageKey === "program") {
      const d = draft as ProgramCmsPayload;
      return (
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-lg">Hero</CardTitle></CardHeader>
            <CardContent className="grid gap-3">
              <Input value={d.hero.eyebrow} onChange={(e) => setDraft({ ...d, hero: { ...d.hero, eyebrow: e.target.value } })} />
              <Input value={d.hero.headline} onChange={(e) => setDraft({ ...d, hero: { ...d.hero, headline: e.target.value } })} />
              <Input value={d.hero.headlineHighlight} onChange={(e) => setDraft({ ...d, hero: { ...d.hero, headlineHighlight: e.target.value } })} />
              <Textarea rows={2} value={d.hero.subhead} onChange={(e) => setDraft({ ...d, hero: { ...d.hero, subhead: e.target.value } })} />
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
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-lg">Included list</CardTitle></CardHeader>
            <CardContent>
              <Textarea rows={10} value={arrayToLines(d.included.items)} onChange={(e) => setDraft({ ...d, included: { ...d.included, items: linesToArray(e.target.value) } })} />
            </CardContent>
          </Card>
        </div>
      );
    }

    if (pageKey === "nutrition") {
      const d = draft as NutritionCmsPayload;
      return (
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-lg">Hero</CardTitle></CardHeader>
            <CardContent className="grid gap-3">
              <Input value={d.hero.eyebrow} onChange={(e) => setDraft({ ...d, hero: { ...d.hero, eyebrow: e.target.value } })} />
              <Input value={d.hero.headline} onChange={(e) => setDraft({ ...d, hero: { ...d.hero, headline: e.target.value } })} />
              <Input value={d.hero.headlineHighlight} onChange={(e) => setDraft({ ...d, hero: { ...d.hero, headlineHighlight: e.target.value } })} />
              <Textarea rows={2} value={d.hero.subhead} onChange={(e) => setDraft({ ...d, hero: { ...d.hero, subhead: e.target.value } })} />
            </CardContent>
          </Card>
          {d.rules.items.map((rule, i) => (
            <Card key={rule.number} className="glass-card">
              <CardHeader><CardTitle className="text-base">Rule {rule.number}</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Input value={rule.title} onChange={(e) => { const items = [...d.rules.items]; items[i] = { ...items[i], title: e.target.value }; setDraft({ ...d, rules: { ...d.rules, items } }); }} />
                <Textarea rows={4} value={rule.body} onChange={(e) => { const items = [...d.rules.items]; items[i] = { ...items[i], body: e.target.value }; setDraft({ ...d, rules: { ...d.rules, items } }); }} />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    const d = draft as CoachingCmsPayload;
    return (
      <div className="space-y-6">
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-lg">Application header</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            <Input value={d.heading.eyebrow} onChange={(e) => setDraft({ ...d, heading: { ...d.heading, eyebrow: e.target.value } })} />
            <Input value={d.heading.title} onChange={(e) => setDraft({ ...d, heading: { ...d.heading, title: e.target.value } })} />
            <Input value={d.heading.titleHighlight} onChange={(e) => setDraft({ ...d, heading: { ...d.heading, titleHighlight: e.target.value } })} />
            <Textarea rows={3} value={d.heading.body} onChange={(e) => setDraft({ ...d, heading: { ...d.heading, body: e.target.value } })} />
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">Trust badges (one per line)</CardTitle></CardHeader>
          <CardContent>
            <Textarea rows={3} value={arrayToLines(d.trust)} onChange={(e) => setDraft({ ...d, trust: linesToArray(e.target.value) })} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading page editor…
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Site pages</h1>
          <p className="text-muted-foreground mt-2">Edit Pricing, FAQ, Handbooks, Program, Nutrition, and Coaching apply pages.</p>
        </div>
        {row && <Badge variant="outline" className="uppercase text-xs">{statusLabels[row.review_status]}</Badge>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Page</Label>
          <Select value={pageKey} onValueChange={(v) => setPageKey(v as SitePageKey)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PAGE_KEYS.map((key) => (
                <SelectItem key={key} value={key}>{SITE_PAGE_LABELS[key]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Tabs value={locale} onValueChange={(v) => setLocale(v as HomepageLocale)}>
          <Label className="mb-2 block">Language</Label>
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="ar">Arabic</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {renderForm()}

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Publish workflow</CardTitle>
          <CardDescription>Same as homepage — save draft, request review, publish live.</CardDescription>
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
