import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/types/database";

type Resource = Database["public"]["Tables"]["content_resources"]["Row"];

export default function AdminContentPage() {
  const { toast } = useToast();
  const [list, setList] = useState<Resource[]>([]);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<"public" | "member">("member");
  const [published, setPublished] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("content_resources").select("*").order("updated_at", { ascending: false });
    if (error) toast({ title: "Load failed", description: error.message, variant: "destructive" });
    else setList(data ?? []);
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function createResource(e: React.FormEvent) {
    e.preventDefault();
    if (!slug.trim() || !title.trim()) {
      toast({ title: "Slug and title required", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("content_resources").insert({
      slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
      title: title.trim(),
      body,
      audience,
      published,
    });
    if (error) {
      toast({ title: "Create failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Resource created" });
    setSlug("");
    setTitle("");
    setBody("");
    setPublished(false);
    load();
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-black">Content & resources</h1>
        <p className="text-muted-foreground mt-2">Optional extra articles or downloads beyond the core PDF-aligned program.</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">New resource</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createResource} className="space-y-4 max-w-xl">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. mobility-reset" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={(v) => setAudience(v as "public" | "member")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member only</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="pub" checked={published} onCheckedChange={setPublished} />
              <Label htmlFor="pub">Published</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Body (markdown-friendly plain text)</Label>
              <Textarea id="body" rows={6} value={body} onChange={(e) => setBody(e.target.value)} />
            </div>
            <Button type="submit" className="bg-amber-500 text-black font-bold hover:bg-amber-400">
              Save resource
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Library</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {list.length === 0 ? (
            <p className="text-sm text-muted-foreground">No rows yet.</p>
          ) : (
            list.map((r) => (
              <div key={r.id} className="flex flex-wrap justify-between gap-2 border-b border-border/40 py-2 text-sm">
                <span className="font-medium">{r.title}</span>
                <span className="text-muted-foreground">
                  {r.slug} · {r.audience} · {r.published ? "live" : "draft"}
                </span>
              </div>
            ))
          )}
          <Button variant="outline" size="sm" onClick={() => load()}>
            Refresh
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
