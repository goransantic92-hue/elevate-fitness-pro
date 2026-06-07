import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Mail, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/types/database";
import enHandbooks from "@/i18n/locales/en/handbooks";

type HandbookLead = Database["public"]["Tables"]["handbook_leads"]["Row"];

type UniqueLead = {
  email: string;
  name: string;
  lastSignup: string;
  handbooks: string[];
  signupCount: number;
};

function handbookLabel(id: string): string {
  const items = enHandbooks.items as Record<string, { title: string }>;
  return items[id]?.title ?? id;
}

function formatHandbooks(ids: string[]): string {
  return ids.map(handbookLabel).join("; ");
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function downloadCsv(filename: string, rows: string[][]) {
  const body = rows.map((row) => row.map((cell) => csvEscape(cell)).join(",")).join("\n");
  const blob = new Blob([`\uFEFF${body}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function buildUniqueLeads(rows: HandbookLead[]): UniqueLead[] {
  const byEmail = new Map<string, UniqueLead>();

  for (const row of rows) {
    const email = row.email.toLowerCase();
    const existing = byEmail.get(email);
    const handbooks = new Set(existing?.handbooks ?? []);
    for (const id of row.handbook_ids) handbooks.add(id);

    if (!existing || row.created_at > existing.lastSignup) {
      byEmail.set(email, {
        email,
        name: row.name,
        lastSignup: row.created_at,
        handbooks: [...handbooks],
        signupCount: (existing?.signupCount ?? 0) + 1,
      });
    } else {
      byEmail.set(email, {
        ...existing,
        handbooks: [...handbooks],
        signupCount: existing.signupCount + 1,
      });
    }
  }

  return [...byEmail.values()].sort((a, b) => b.lastSignup.localeCompare(a.lastSignup));
}

export default function AdminHandbookLeadsPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<HandbookLead[]>([]);
  const [loading, setLoading] = useState(true);

  const uniqueLeads = useMemo(() => buildUniqueLeads(rows), [rows]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("handbook_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    setRows(data ?? []);
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  function exportAllSubmissions() {
    downloadCsv("handbook-leads-all.csv", [
      ["Date", "Name", "Email", "Handbooks", "Email sent", "Source"],
      ...rows.map((r) => [
        new Date(r.created_at).toISOString(),
        r.name,
        r.email,
        formatHandbooks(r.handbook_ids),
        r.emails_sent ? "yes" : "no",
        r.source,
      ]),
    ]);
    toast({ title: "Exported", description: `${rows.length} submissions downloaded.` });
  }

  function exportUniqueEmails() {
    downloadCsv("handbook-leads-unique-emails.csv", [
      ["Email", "Name", "Last signup", "Handbooks requested", "Signup count"],
      ...uniqueLeads.map((r) => [
        r.email,
        r.name,
        new Date(r.lastSignup).toISOString(),
        formatHandbooks(r.handbooks),
        String(r.signupCount),
      ]),
    ]);
    toast({ title: "Exported", description: `${uniqueLeads.length} unique emails downloaded.` });
  }

  async function copyUniqueEmails() {
    const text = uniqueLeads.map((r) => r.email).join(", ");
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied", description: `${uniqueLeads.length} emails copied to clipboard.` });
    } catch {
      toast({ title: "Copy failed", description: "Use CSV export instead.", variant: "destructive" });
    }
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-black">Handbook leads</h1>
        <p className="mt-2 text-muted-foreground">
          Everyone who requested a free handbook. Export unique emails for offers and campaigns (Resend, Mailchimp, etc.).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="glass-card border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total signups</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{rows.length}</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unique emails</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{uniqueLeads.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="default" className="gap-2" onClick={exportUniqueEmails} disabled={uniqueLeads.length === 0}>
          <Download className="h-4 w-4" />
          Export unique emails (CSV)
        </Button>
        <Button variant="outline" className="gap-2" onClick={exportAllSubmissions} disabled={rows.length === 0}>
          <Download className="h-4 w-4" />
          Export all submissions
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => void copyUniqueEmails()} disabled={uniqueLeads.length === 0}>
          <Mail className="h-4 w-4" />
          Copy emails
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => void load()}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Recent signups</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No leads yet. They appear here when someone submits the free handbook form on the homepage.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Name</th>
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4">Handbooks</th>
                    <th className="pb-3">Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-border/40">
                      <td className="py-3 pr-4 whitespace-nowrap text-muted-foreground">
                        {new Date(r.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 pr-4">{r.name}</td>
                      <td className="py-3 pr-4">
                        <a href={`mailto:${r.email}`} className="text-primary hover:underline">
                          {r.email}
                        </a>
                      </td>
                      <td className="py-3 pr-4 max-w-xs">{formatHandbooks(r.handbook_ids)}</td>
                      <td className="py-3">{r.emails_sent ? "✓" : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Run the Supabase migration <code className="rounded bg-secondary px-1">20260607120000_handbook_leads.sql</code> if this page shows a permissions error.{" "}
        <Link to="/admin" className="text-primary hover:underline">
          Back to overview
        </Link>
      </p>
    </div>
  );
}
