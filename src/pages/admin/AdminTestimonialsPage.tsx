import { useCallback, useEffect, useMemo, useState } from "react";
import { ImageIcon, Loader2, Upload, Video } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CmsWorkflowBar } from "@/components/admin/CmsWorkflowBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { uploadTestimonialFile } from "@/lib/memberAppCms";
import { testimonialStorageUrl } from "@/lib/testimonialMedia";
import {
  fetchSiteContentRow,
  getDefaultSiteCms,
  publishSiteContent,
  requestSiteReview,
  saveSiteDraft,
} from "@/lib/siteCms";
import type { HomepageReviewStatus } from "@/types/homepageCms";
import type { SiteContentRow, TestimonialsCmsPayload } from "@/types/siteCms";

const statusLabels: Record<HomepageReviewStatus, string> = {
  draft: "Draft",
  pending_review: "Pending review",
  published: "Published",
};

const LOCALE = "en" as const;

export default function AdminTestimonialsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [row, setRow] = useState<SiteContentRow<"testimonials"> | null>(null);
  const [draft, setDraft] = useState<TestimonialsCmsPayload>(() => getDefaultSiteCms("testimonials", LOCALE));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const next = await fetchSiteContentRow("testimonials", LOCALE);
      setRow(next);
      setDraft(next.draft);
    } catch (error) {
      toast({
        title: "Load failed",
        description: error instanceof Error ? error.message : "Could not load testimonials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function persist(action: "draft" | "review" | "publish") {
    setSaving(true);
    try {
      if (action === "draft") await saveSiteDraft("testimonials", LOCALE, draft, user?.id);
      if (action === "review") await requestSiteReview("testimonials", LOCALE, draft, user?.id);
      if (action === "publish") await publishSiteContent("testimonials", LOCALE, draft, user?.id);
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

  async function handleUpload(itemId: string, kind: "videos" | "posters", file: File | undefined) {
    if (!file) return;
    setUploading(`${itemId}-${kind}`);
    try {
      const path = await uploadTestimonialFile(file, kind, itemId);
      setDraft((current) => ({
        ...current,
        items: current.items.map((item) =>
          item.id === itemId
            ? { ...item, [kind === "videos" ? "videoPath" : "posterPath"]: path }
            : item
        ),
      }));
      toast({ title: kind === "videos" ? "Video uploaded" : "Poster uploaded" });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Could not upload.",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  }

  function addItem() {
    const id = `testimonial-${Date.now()}`;
    setDraft((current) => ({
      ...current,
      items: [...current.items, { id, name: "New testimonial", videoPath: null, posterPath: null, enabled: true }],
    }));
  }

  const itemCount = useMemo(() => draft.items.filter((i) => i.enabled).length, [draft.items]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading testimonials editor…
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Testimonial videos</h1>
          <p className="text-muted-foreground mt-2">
            Upload videos and posters for the homepage testimonials section. {itemCount} enabled.
          </p>
        </div>
        {row && <Badge variant="outline" className="uppercase text-xs">{statusLabels[row.review_status]}</Badge>}
      </div>

      <div className="space-y-6">
        {draft.items.map((item, i) => {
          const posterPreview = item.posterPath ? testimonialStorageUrl(item.posterPath) : null;
          const videoLabel = item.videoPath ?? "No video uploaded";
          return (
            <Card key={item.id} className="glass-card">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">{item.name || item.id}</CardTitle>
                  <CardDescription className="font-mono text-xs mt-1">{videoLabel}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`enabled-${item.id}`} className="text-xs text-muted-foreground">Show on homepage</Label>
                  <Switch
                    id={`enabled-${item.id}`}
                    checked={item.enabled}
                    onCheckedChange={(enabled) => {
                      const items = [...draft.items];
                      items[i] = { ...items[i], enabled };
                      setDraft({ ...draft, items });
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Display name</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => {
                        const items = [...draft.items];
                        items[i] = { ...items[i], name: e.target.value };
                        setDraft({ ...draft, items });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ID (do not change after publish)</Label>
                    <Input
                      value={item.id}
                      onChange={(e) => {
                        const items = [...draft.items];
                        items[i] = { ...items[i], id: e.target.value };
                        setDraft({ ...draft, items });
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Label className="cursor-pointer">
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      className="sr-only"
                      onChange={(e) => void handleUpload(item.id, "videos", e.target.files?.[0])}
                    />
                    <Button type="button" variant="outline" size="sm" asChild disabled={uploading === `${item.id}-videos`}>
                      <span>
                        {uploading === `${item.id}-videos` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
                        <span className="ms-2">Upload video</span>
                      </span>
                    </Button>
                  </Label>
                  <Label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(e) => void handleUpload(item.id, "posters", e.target.files?.[0])}
                    />
                    <Button type="button" variant="outline" size="sm" asChild disabled={uploading === `${item.id}-posters`}>
                      <span>
                        {uploading === `${item.id}-posters` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        <span className="ms-2">Upload poster</span>
                      </span>
                    </Button>
                  </Label>
                </div>
                {posterPreview && (
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <img src={posterPreview} alt="" className="h-24 w-auto rounded border border-border object-cover" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button type="button" variant="secondary" onClick={addItem}>
        Add testimonial
      </Button>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Publish workflow</CardTitle>
          <CardDescription>Videos go live on the homepage after publish — no deploy needed.</CardDescription>
        </CardHeader>
        <CardContent>
          <CmsWorkflowBar
            saving={saving}
            onSaveDraft={() => void persist("draft")}
            onRequestReview={() => void persist("review")}
            onPublish={() => void persist("publish")}
            onResetPublished={() => row && setDraft(row.published)}
            onResetDefaults={() => setDraft(getDefaultSiteCms("testimonials", LOCALE))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
