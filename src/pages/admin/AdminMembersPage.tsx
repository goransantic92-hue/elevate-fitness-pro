import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type MemberAccess = Database["public"]["Tables"]["member_access"]["Row"];

type Row = Profile & { access: MemberAccess | null };

export default function AdminMembersPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: profiles, error: pe } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (pe) {
      toast({ title: "Error", description: pe.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    const { data: accessList, error: ae } = await supabase.from("member_access").select("*");
    if (ae) {
      toast({ title: "Error", description: ae.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    const merged: Row[] = (profiles ?? []).map((p) => ({
      ...p,
      access: accessList?.find((a) => a.user_id === p.id) ?? null,
    }));
    setRows(merged);
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function setAccess(userId: string, has: boolean) {
    const { error } = await supabase.from("member_access").upsert({
      user_id: userId,
      has_access: has,
      access_type: has ? "lifetime" : "expired",
      source: "manual",
      activated_at: has ? new Date().toISOString() : null,
    });
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: has ? "Access granted" : "Access revoked" });
    load();
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-black">Members</h1>
        <p className="text-muted-foreground mt-2">Toggle full program access until payment automation ships.</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">All accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4">Name</th>
                    <th className="pb-3 pr-4">Role</th>
                    <th className="pb-3 pr-4">Access</th>
                    <th className="pb-3">Program</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-border/40">
                      <td className="py-3 pr-4">{r.email ?? "—"}</td>
                      <td className="py-3 pr-4">{r.full_name ?? "—"}</td>
                      <td className="py-3 pr-4">
                        <span className={r.role === "admin" ? "text-amber-500 font-semibold" : ""}>{r.role}</span>
                      </td>
                      <td className="py-3 pr-4">{r.access?.access_type ?? "—"}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={r.role === "admin" || r.access?.has_access === true}
                            disabled={r.role === "admin"}
                            onCheckedChange={(v) => setAccess(r.id, v)}
                          />
                          <span className="text-xs text-muted-foreground">{r.role === "admin" ? "admin" : r.access?.has_access ? "on" : "off"}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Button variant="outline" className="mt-4" onClick={() => load()}>
            Refresh
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
