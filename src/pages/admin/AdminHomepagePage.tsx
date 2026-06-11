import { useCallback, useEffect, useMemo, useState } from "react";
import { ImageIcon, Loader2, Upload } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  arrayToLines,
  fetchHomepageContentRow,
  getDefaultHomepageCms,
  linesToArray,
  publishHomepageContent,
  requestHomepageReview,
  saveHomepageDraft,
  uploadHomepageImage,
} from "@/lib/homepageCms";
import { homepageStorageUrl } from "@/lib/homepageMedia";
import privateTrainerFitness from "@/assets/private-trainer-fitness.webp";
import coachAbout from "@/assets/coach-about.webp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { HomepageCmsPayload, HomepageContentRow, HomepageLocale, HomepageReviewStatus } from "@/types/homepageCms";

const statusLabels: Record<HomepageReviewStatus, string> = {
  draft: "Draft",
  pending_review: "Pending review",
  published: "Published",
};

function statusVariant(status: HomepageReviewStatus): "default" | "secondary" | "outline" {
  if (status === "pending_review") return "default";
  if (status === "published") return "secondary";
  return "outline";
}

export default function AdminHomepagePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [locale, setLocale] = useState<HomepageLocale>("en");
  const [row, setRow] = useState<HomepageContentRow | null>(null);
  const [draft, setDraft] = useState<HomepageCmsPayload>(() => getDefaultHomepageCms("en"));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingCoach, setUploadingCoach] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const next = await fetchHomepageContentRow(locale);
      setRow(next);
      setDraft(next.draft);
    } catch (error) {
      toast({
        title: "Load failed",
        description: error instanceof Error ? error.message : "Could not load homepage content.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [locale, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const heroPreview = useMemo(
    () => homepageStorageUrl(draft.hero.imagePath) ?? privateTrainerFitness,
    [draft.hero.imagePath]
  );
  const coachPreview = useMemo(
    () => homepageStorageUrl(draft.coach.imagePath) ?? coachAbout,
    [draft.coach.imagePath]
  );

  async function handleSaveDraft() {
    setSaving(true);
    try {
      await saveHomepageDraft(locale, draft, user?.id);
      toast({ title: "Draft saved", description: "Changes are saved but not live yet." });
      await load();
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Could not save draft.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleRequestReview() {
    setSaving(true);
    try {
      await requestHomepageReview(locale, draft, user?.id);
      toast({
        title: "Sent for review",
        description: "Notify your developer to publish when ready.",
      });
      await load();
    } catch (error) {
      toast({
        title: "Request failed",
        description: error instanceof Error ? error.message : "Could not request review.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    setSaving(true);
    try {
      await publishHomepageContent(locale, draft, user?.id);
      toast({ title: "Published", description: "Homepage is live — no deploy needed." });
      await load();
    } catch (error) {
      toast({
        title: "Publish failed",
        description: error instanceof Error ? error.message : "Could not publish.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  function resetDraftFromDefaults() {
    setDraft(getDefaultHomepageCms(locale));
    toast({ title: "Form reset", description: "Loaded default text from the app bundle. Save draft to store it." });
  }

  function resetDraftFromPublished() {
    if (!row) return;
    setDraft(row.published);
    toast({ title: "Draft restored", description: "Loaded the currently published version into the form." });
  }

  async function handleImageUpload(slot: "hero" | "coach", file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please choose a JPG, PNG, or WebP image.", variant: "destructive" });
      return;
    }
    const setUploading = slot === "hero" ? setUploadingHero : setUploadingCoach;
    setUploading(true);
    try {
      const path = await uploadHomepageImage(file, locale, slot);
      setDraft((current) => ({
        ...current,
        [slot]: {
          ...current[slot],
          imagePath: path,
        },
      }));
      toast({ title: "Image uploaded", description: "Save draft or publish to apply." });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Could not upload image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading homepage editor…
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Homepage editor</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Edit hero and coach text and images in plain forms — no code. Save a draft, request review, then publish when ready.
          </p>
        </div>
        {row && (
          <Badge variant={statusVariant(row.review_status)} className="text-xs uppercase tracking-wide">
            {statusLabels[row.review_status]}
          </Badge>
        )}
      </div>

      <Tabs value={locale} onValueChange={(value) => setLocale(value as HomepageLocale)}>
        <TabsList>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="ar">Arabic</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="glass-card border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-lg">Hero section</CardTitle>
          <CardDescription>Top of the homepage — headline, pills, trust line, and main image.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="hero-eyebrow">Eyebrow (small line above headline)</Label>
              <Textarea
                id="hero-eyebrow"
                rows={2}
                value={draft.hero.eyebrow}
                onChange={(e) => setDraft((c) => ({ ...c, hero: { ...c.hero, eyebrow: e.target.value } }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-headline">Headline (before highlight)</Label>
              <Input
                id="hero-headline"
                value={draft.hero.headline}
                onChange={(e) => setDraft((c) => ({ ...c, hero: { ...c.hero, headline: e.target.value } }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-energy">Highlighted word</Label>
              <Input
                id="hero-energy"
                value={draft.hero.headlineEnergy}
                onChange={(e) => setDraft((c) => ({ ...c, hero: { ...c.hero, headlineEnergy: e.target.value } }))}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="hero-suffix">Headline suffix</Label>
              <Input
                id="hero-suffix"
                value={draft.hero.headlineSuffix}
                onChange={(e) => setDraft((c) => ({ ...c, hero: { ...c.hero, headlineSuffix: e.target.value } }))}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="hero-subhead">Subhead</Label>
              <Textarea
                id="hero-subhead"
                rows={3}
                value={draft.hero.subhead}
                onChange={(e) => setDraft((c) => ({ ...c, hero: { ...c.hero, subhead: e.target.value } }))}
              />
              <p className="text-xs text-muted-foreground">
                Pricing still comes from the pricing config — use {"{{coachingPrice}}"} if you want the monthly coaching price inserted on the live site.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-pills">Pills (one per line)</Label>
              <Textarea
                id="hero-pills"
                rows={4}
                value={arrayToLines(draft.hero.pills)}
                onChange={(e) =>
                  setDraft((c) => ({
                    ...c,
                    hero: { ...c.hero, pills: linesToArray(e.target.value) },
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-trust">Trust bullets (one per line)</Label>
              <Textarea
                id="hero-trust"
                rows={4}
                value={arrayToLines(draft.hero.trust)}
                onChange={(e) =>
                  setDraft((c) => ({
                    ...c,
                    hero: { ...c.hero, trust: linesToArray(e.target.value) },
                  }))
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="hero-alt">Image alt text</Label>
              <Input
                id="hero-alt"
                value={draft.hero.imageAlt}
                onChange={(e) => setDraft((c) => ({ ...c, hero: { ...c.hero, imageAlt: e.target.value } }))}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative aspect-[4/5] w-full max-w-[200px] overflow-hidden rounded-xl border border-border bg-secondary/20">
              <img src={heroPreview} alt={draft.hero.imageAlt} className="h-full w-full object-cover object-center" />
            </div>
            <div className="space-y-2">
              <Label>Hero image</Label>
              <p className="text-sm text-muted-foreground">JPG, PNG, or WebP. Leave unchanged to keep the default bundled photo.</p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" disabled={uploadingHero} asChild>
                  <label className="cursor-pointer">
                    {uploadingHero ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    <span className="ms-2">{uploadingHero ? "Uploading…" : "Upload image"}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      disabled={uploadingHero}
                      onChange={(e) => {
                        void handleImageUpload("hero", e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </Button>
                {draft.hero.imagePath && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setDraft((c) => ({ ...c, hero: { ...c.hero, imagePath: null } }))}
                  >
                    Use default image
                  </Button>
                )}
              </div>
              {draft.hero.imagePath && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  {draft.hero.imagePath}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-lg">Coach section</CardTitle>
          <CardDescription>Meet your coach — bio text, highlight line, stats, and photo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="coach-eyebrow">Eyebrow</Label>
              <Input
                id="coach-eyebrow"
                value={draft.coach.eyebrow}
                onChange={(e) => setDraft((c) => ({ ...c, coach: { ...c.coach, eyebrow: e.target.value } }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coach-headline">Headline</Label>
              <Input
                id="coach-headline"
                value={draft.coach.headline}
                onChange={(e) => setDraft((c) => ({ ...c, coach: { ...c.coach, headline: e.target.value } }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coach-highlight-word">Highlighted words</Label>
              <Input
                id="coach-highlight-word"
                value={draft.coach.headlineHighlight}
                onChange={(e) => setDraft((c) => ({ ...c, coach: { ...c.coach, headlineHighlight: e.target.value } }))}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="coach-paragraphs">Paragraphs (one per line)</Label>
              <Textarea
                id="coach-paragraphs"
                rows={6}
                value={arrayToLines(draft.coach.paragraphs)}
                onChange={(e) =>
                  setDraft((c) => ({
                    ...c,
                    coach: { ...c.coach, paragraphs: linesToArray(e.target.value) },
                  }))
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="coach-highlight">Highlight sentence</Label>
              <Textarea
                id="coach-highlight"
                rows={2}
                value={draft.coach.highlight}
                onChange={(e) => setDraft((c) => ({ ...c, coach: { ...c.coach, highlight: e.target.value } }))}
              />
            </div>
            {draft.coach.stats.map((stat, index) => (
              <div key={`coach-stat-${index}`} className="grid grid-cols-2 gap-2 sm:col-span-2">
                <div className="space-y-2">
                  <Label htmlFor={`coach-stat-value-${index}`}>Stat {index + 1} value</Label>
                  <Input
                    id={`coach-stat-value-${index}`}
                    value={stat.value}
                    onChange={(e) =>
                      setDraft((c) => {
                        const stats = [...c.coach.stats];
                        stats[index] = { ...stats[index], value: e.target.value };
                        return { ...c, coach: { ...c.coach, stats } };
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`coach-stat-label-${index}`}>Stat {index + 1} label</Label>
                  <Input
                    id={`coach-stat-label-${index}`}
                    value={stat.label}
                    onChange={(e) =>
                      setDraft((c) => {
                        const stats = [...c.coach.stats];
                        stats[index] = { ...stats[index], label: e.target.value };
                        return { ...c, coach: { ...c.coach, stats } };
                      })
                    }
                  />
                </div>
              </div>
            ))}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="coach-alt">Image alt text</Label>
              <Input
                id="coach-alt"
                value={draft.coach.imageAlt}
                onChange={(e) => setDraft((c) => ({ ...c, coach: { ...c.coach, imageAlt: e.target.value } }))}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="aspect-[4/5] w-full max-w-[200px] overflow-hidden rounded-xl border border-border bg-secondary/20">
              <img src={coachPreview} alt={draft.coach.imageAlt} className="h-full w-full object-cover object-top" />
            </div>
            <div className="space-y-2">
              <Label>Coach photo</Label>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" disabled={uploadingCoach} asChild>
                  <label className="cursor-pointer">
                    {uploadingCoach ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    <span className="ms-2">{uploadingCoach ? "Uploading…" : "Upload image"}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      disabled={uploadingCoach}
                      onChange={(e) => {
                        void handleImageUpload("coach", e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </Button>
                {draft.coach.imagePath && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setDraft((c) => ({ ...c, coach: { ...c.coach, imagePath: null } }))}
                  >
                    Use default image
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Publish workflow</CardTitle>
          <CardDescription>
            Save draft while editing. Request review when ready — then publish to go live instantly (no deploy for text or images).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => {
              void handleSaveDraft();
            }}
          >
            Save draft
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={saving}
            onClick={() => {
              void handleRequestReview();
            }}
          >
            Ready — notify for review
          </Button>
          <Button
            type="button"
            className="bg-amber-500 text-black font-bold hover:bg-amber-400"
            disabled={saving}
            onClick={() => {
              void handlePublish();
            }}
          >
            Publish now
          </Button>
          <Button type="button" variant="ghost" disabled={saving} onClick={resetDraftFromPublished}>
            Reset form to published
          </Button>
          <Button type="button" variant="ghost" disabled={saving} onClick={resetDraftFromDefaults}>
            Reset form to defaults
          </Button>
        </CardContent>
      </Card>

      {row?.published_at && (
        <p className="text-xs text-muted-foreground">
          Last published: {new Date(row.published_at).toLocaleString()}
          {row.review_requested_at && row.review_status === "pending_review"
            ? ` · Review requested: ${new Date(row.review_requested_at).toLocaleString()}`
            : ""}
        </p>
      )}
    </div>
  );
}
