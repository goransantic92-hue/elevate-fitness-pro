import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CmsWorkflowBar } from "@/components/admin/CmsWorkflowBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { arrayToLines, linesToArray } from "@/lib/cmsUtils";
import {
  createEmptyBlogPost,
  emptyBlogBlock,
  uploadBlogCover,
} from "@/lib/blogCms";
import { blogCoverUrl } from "@/lib/blogMedia";
import {
  fetchSiteContentRow,
  getDefaultSiteCms,
  publishSiteContent,
  requestSiteReview,
  saveSiteDraft,
} from "@/lib/siteCms";
import type { HomepageLocale, HomepageReviewStatus } from "@/types/homepageCms";
import type { BlogBlockCms, BlogCmsPayload, BlogPostCms, SiteContentRow } from "@/types/siteCms";

const statusLabels: Record<HomepageReviewStatus, string> = {
  draft: "Draft",
  pending_review: "Pending review",
  published: "Published",
};

const BLOCK_TYPES: BlogBlockCms["type"][] = ["p", "h2", "h3", "ul", "ol", "blockquote", "table", "cta"];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export default function AdminBlogPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [locale, setLocale] = useState<HomepageLocale>("en");
  const [row, setRow] = useState<SiteContentRow<"blog"> | null>(null);
  const [draft, setDraft] = useState<BlogCmsPayload>(() => getDefaultSiteCms("blog", "en"));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const selected = useMemo(
    () => draft.posts.find((p) => p.id === selectedId) ?? draft.posts[0] ?? null,
    [draft.posts, selectedId]
  );

  const load = useCallback(async () => {
    const loc = locale;
    setLoading(true);
    try {
      const next = await fetchSiteContentRow("blog", loc);
      if (loc !== locale) return;
      setRow(next);
      setDraft(next.draft);
      setSelectedId((current) => {
        if (current && next.draft.posts.some((p) => p.id === current)) return current;
        return next.draft.posts[0]?.id ?? null;
      });
    } catch (error) {
      if (loc !== locale) return;
      toast({
        title: "Load failed",
        description: error instanceof Error ? error.message : "Could not load blog posts.",
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
    setDraft(getDefaultSiteCms("blog", loc));
    setRow(null);
    setSelectedId(null);
    setLoading(true);
  }

  async function persist(action: "draft" | "review" | "publish") {
    setSaving(true);
    try {
      if (action === "draft") await saveSiteDraft("blog", locale, draft, user?.id);
      if (action === "review") await requestSiteReview("blog", locale, draft, user?.id);
      if (action === "publish") await publishSiteContent("blog", locale, draft, user?.id);
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

  function updatePost(postId: string, patch: Partial<BlogPostCms>) {
    setDraft((current) => ({
      ...current,
      posts: current.posts.map((p) => (p.id === postId ? { ...p, ...patch } : p)),
    }));
  }

  function updateBlocks(postId: string, blocks: BlogBlockCms[]) {
    updatePost(postId, { blocks });
  }

  function addPost() {
    const post = createEmptyBlogPost();
    setDraft((current) => ({ ...current, posts: [post, ...current.posts] }));
    setSelectedId(post.id);
  }

  function deletePost(postId: string) {
    const target = draft.posts.find((p) => p.id === postId);
    if (!target) return;
    if (!window.confirm(`Delete “${target.title || target.slug}”? This removes it from the draft. Publish to apply on the live site.`)) {
      return;
    }
    setDraft((current) => {
      const posts = current.posts.filter((p) => p.id !== postId);
      return { ...current, posts };
    });
    setSelectedId((current) => {
      if (current !== postId) return current;
      const remaining = draft.posts.filter((p) => p.id !== postId);
      return remaining[0]?.id ?? null;
    });
  }

  async function handleCoverUpload(file: File | undefined) {
    if (!file || !selected) return;
    setUploading(true);
    try {
      const path = await uploadBlogCover(file, locale, selected.slug);
      updatePost(selected.id, { coverPath: path });
      toast({ title: "Cover uploaded" });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Could not upload cover.",
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
        Loading blog editor…
      </div>
    );
  }

  const coverPreview = selected ? blogCoverUrl(selected.coverPath) : null;

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Blog</h1>
          <p className="text-muted-foreground mt-2">
            Add, edit, or delete posts — title, body, cover image. Publish without deploy.
          </p>
        </div>
        {row && <Badge variant="outline" className="uppercase text-xs">{statusLabels[row.review_status]}</Badge>}
      </div>

      <Tabs value={locale} onValueChange={(v) => changeLocale(v as HomepageLocale)}>
        <Label className="mb-2 block">Language</Label>
        <TabsList>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="ar">Arabic</TabsTrigger>
          <TabsTrigger value="sr">Serbian</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={addPost}>
          <Plus className="h-4 w-4 me-2" />
          Add post
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <Card className="glass-card h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Posts ({draft.posts.length})</CardTitle>
            <CardDescription>Select a post to edit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 max-h-[70vh] overflow-y-auto">
            {draft.posts.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => setSelectedId(post.id)}
                className={`w-full rounded-lg px-3 py-2 text-start text-sm transition-colors ${
                  selected?.id === post.id
                    ? "bg-amber-500/15 text-amber-400"
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="block font-medium line-clamp-2">{post.title || post.slug}</span>
                <span className="block text-xs opacity-70 font-mono mt-0.5">{post.slug}</span>
                {!post.enabled && (
                  <Badge variant="outline" className="mt-1 text-[10px]">Hidden</Badge>
                )}
              </button>
            ))}
            {draft.posts.length === 0 && (
              <p className="text-sm text-muted-foreground px-1">No posts yet. Click Add post.</p>
            )}
          </CardContent>
        </Card>

        {selected ? (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">Post settings</CardTitle>
                  <CardDescription>Slug becomes the URL: /blog/{selected.slug}</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`enabled-${selected.id}`} className="text-xs text-muted-foreground">Published on site</Label>
                    <Switch
                      id={`enabled-${selected.id}`}
                      checked={selected.enabled}
                      onCheckedChange={(enabled) => updatePost(selected.id, { enabled })}
                    />
                  </div>
                  <Button type="button" variant="destructive" size="sm" onClick={() => deletePost(selected.id)}>
                    <Trash2 className="h-4 w-4 me-1" />
                    Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2 space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={selected.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const patch: Partial<BlogPostCms> = { title };
                      if (selected.slug.startsWith("new-post-")) {
                        const nextSlug = slugify(title);
                        if (nextSlug) patch.slug = nextSlug;
                      }
                      updatePost(selected.id, patch);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input
                    value={selected.slug}
                    onChange={(e) => updatePost(selected.id, { slug: slugify(e.target.value) || e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Published date</Label>
                  <Input
                    type="date"
                    value={selected.publishedAt.slice(0, 10)}
                    onChange={(e) => updatePost(selected.id, { publishedAt: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label>Excerpt</Label>
                  <Textarea
                    rows={2}
                    value={selected.excerpt}
                    onChange={(e) => updatePost(selected.id, { excerpt: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meta title</Label>
                  <Input
                    value={selected.metaTitle}
                    onChange={(e) => updatePost(selected.id, { metaTitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reading time (minutes)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={selected.readingTimeMinutes}
                    onChange={(e) =>
                      updatePost(selected.id, {
                        readingTimeMinutes: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label>Meta description</Label>
                  <Textarea
                    rows={2}
                    value={selected.metaDescription}
                    onChange={(e) => updatePost(selected.id, { metaDescription: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label>Keywords (comma-separated)</Label>
                  <Input
                    value={selected.keywords.join(", ")}
                    onChange={(e) =>
                      updatePost(selected.id, {
                        keywords: e.target.value
                          .split(",")
                          .map((k) => k.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <Switch
                    id={`featured-${selected.id}`}
                    checked={selected.featuredOnHomepage}
                    onCheckedChange={(featuredOnHomepage) => updatePost(selected.id, { featuredOnHomepage })}
                  />
                  <Label htmlFor={`featured-${selected.id}`}>Feature on homepage</Label>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Cover image</CardTitle>
                <CardDescription>Shown on the blog index, post page, and homepage cards.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Cover path or URL</Label>
                  <Input
                    value={selected.coverPath ?? ""}
                    onChange={(e) => updatePost(selected.id, { coverPath: e.target.value || null })}
                    placeholder="/blog/cover.jpg or storage path"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cover alt text</Label>
                  <Input
                    value={selected.coverAlt}
                    onChange={(e) => updatePost(selected.id, { coverAlt: e.target.value })}
                  />
                </div>
                <Label className="cursor-pointer inline-flex">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(e) => void handleCoverUpload(e.target.files?.[0])}
                  />
                  <Button type="button" variant="outline" size="sm" asChild disabled={uploading}>
                    <span>
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      <span className="ms-2">Upload cover</span>
                    </span>
                  </Button>
                </Label>
                {coverPreview && (
                  <div className="flex items-start gap-3">
                    <ImageIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                    <img
                      src={coverPreview}
                      alt={selected.coverAlt || ""}
                      className="h-40 w-auto max-w-full rounded border border-border object-cover"
                    />
                  </div>
                )}
                {selected.coverPath && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => updatePost(selected.id, { coverPath: null })}
                  >
                    Remove cover
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">Article body</CardTitle>
                  <CardDescription>{selected.blocks.length} blocks · use **bold**, *italic*, [links](/path)</CardDescription>
                </div>
                <Select
                  onValueChange={(type) => {
                    updateBlocks(selected.id, [...selected.blocks, emptyBlogBlock(type as BlogBlockCms["type"])]);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Add block…" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOCK_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="space-y-4">
                {selected.blocks.map((block, index) => (
                  <div key={index} className="rounded-lg border border-border/60 p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Select
                        value={block.type}
                        onValueChange={(type) => {
                          const blocks = [...selected.blocks];
                          blocks[index] = emptyBlogBlock(type as BlogBlockCms["type"]);
                          updateBlocks(selected.id, blocks);
                        }}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BLOCK_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={index === 0}
                          onClick={() => {
                            const blocks = [...selected.blocks];
                            [blocks[index - 1], blocks[index]] = [blocks[index], blocks[index - 1]];
                            updateBlocks(selected.id, blocks);
                          }}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={index === selected.blocks.length - 1}
                          onClick={() => {
                            const blocks = [...selected.blocks];
                            [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]];
                            updateBlocks(selected.id, blocks);
                          }}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            updateBlocks(
                              selected.id,
                              selected.blocks.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    {(block.type === "p" ||
                      block.type === "h2" ||
                      block.type === "h3" ||
                      block.type === "blockquote") && (
                      <Textarea
                        rows={block.type === "p" ? 3 : 2}
                        value={block.text}
                        onChange={(e) => {
                          const blocks = [...selected.blocks];
                          blocks[index] = { ...block, text: e.target.value };
                          updateBlocks(selected.id, blocks);
                        }}
                      />
                    )}

                    {(block.type === "ul" || block.type === "ol") && (
                      <Textarea
                        rows={4}
                        value={arrayToLines(block.items)}
                        onChange={(e) => {
                          const blocks = [...selected.blocks];
                          blocks[index] = { ...block, items: linesToArray(e.target.value) };
                          updateBlocks(selected.id, blocks);
                        }}
                        placeholder="One item per line"
                      />
                    )}

                    {block.type === "table" && (
                      <div className="space-y-2">
                        <Label className="text-xs">Headers (comma-separated)</Label>
                        <Input
                          value={block.headers.join(", ")}
                          onChange={(e) => {
                            const blocks = [...selected.blocks];
                            blocks[index] = {
                              ...block,
                              headers: e.target.value.split(",").map((h) => h.trim()).filter(Boolean),
                            };
                            updateBlocks(selected.id, blocks);
                          }}
                        />
                        <Label className="text-xs">Rows (one row per line, cells separated by |)</Label>
                        <Textarea
                          rows={4}
                          value={block.rows.map((r) => r.join(" | ")).join("\n")}
                          onChange={(e) => {
                            const blocks = [...selected.blocks];
                            blocks[index] = {
                              ...block,
                              rows: e.target.value
                                .split("\n")
                                .map((line) => line.split("|").map((c) => c.trim()))
                                .filter((row) => row.some((c) => c.length > 0)),
                            };
                            updateBlocks(selected.id, blocks);
                          }}
                        />
                      </div>
                    )}

                    {block.type === "cta" && (
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Input
                          className="sm:col-span-2"
                          placeholder="CTA title"
                          value={block.title ?? ""}
                          onChange={(e) => {
                            const blocks = [...selected.blocks];
                            blocks[index] = { ...block, title: e.target.value || undefined };
                            updateBlocks(selected.id, blocks);
                          }}
                        />
                        <Textarea
                          className="sm:col-span-2"
                          rows={2}
                          placeholder="Bullets (one per line)"
                          value={arrayToLines(block.bullets ?? [])}
                          onChange={(e) => {
                            const blocks = [...selected.blocks];
                            blocks[index] = { ...block, bullets: linesToArray(e.target.value) };
                            updateBlocks(selected.id, blocks);
                          }}
                        />
                        <Input
                          placeholder="Primary label"
                          value={block.primaryLabel}
                          onChange={(e) => {
                            const blocks = [...selected.blocks];
                            blocks[index] = { ...block, primaryLabel: e.target.value };
                            updateBlocks(selected.id, blocks);
                          }}
                        />
                        <Input
                          placeholder="Primary href"
                          value={block.primaryHref}
                          onChange={(e) => {
                            const blocks = [...selected.blocks];
                            blocks[index] = { ...block, primaryHref: e.target.value };
                            updateBlocks(selected.id, blocks);
                          }}
                        />
                        <Input
                          placeholder="Secondary label"
                          value={block.secondaryLabel ?? ""}
                          onChange={(e) => {
                            const blocks = [...selected.blocks];
                            blocks[index] = { ...block, secondaryLabel: e.target.value || undefined };
                            updateBlocks(selected.id, blocks);
                          }}
                        />
                        <Input
                          placeholder="Secondary href"
                          value={block.secondaryHref ?? ""}
                          onChange={(e) => {
                            const blocks = [...selected.blocks];
                            blocks[index] = { ...block, secondaryHref: e.target.value || undefined };
                            updateBlocks(selected.id, blocks);
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
                {selected.blocks.length === 0 && (
                  <p className="text-sm text-muted-foreground">No blocks yet. Use “Add block…” above.</p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="glass-card">
            <CardContent className="py-12 text-center text-muted-foreground">
              Add a post to start editing.
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Publish workflow</CardTitle>
          <CardDescription>
            Live blog pages update after publish — no code deploy. Edit each language separately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CmsWorkflowBar
            saving={saving}
            onSaveDraft={() => void persist("draft")}
            onRequestReview={() => void persist("review")}
            onPublish={() => void persist("publish")}
            onResetPublished={() => row && setDraft(row.published)}
            onResetDefaults={() => setDraft(getDefaultSiteCms("blog", locale))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
