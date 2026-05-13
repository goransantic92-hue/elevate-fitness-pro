import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/types/database";

type Job = Database["public"]["Tables"]["reminder_jobs"]["Row"];

export default function AdminRemindersPage() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("reminder_jobs").select("*").order("scheduled_for", { ascending: false }).limit(100);
    if (error) toast({ title: "Load failed", description: error.message, variant: "destructive" });
    else setJobs(data ?? []);
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-black">Reminders queue</h1>
        <p className="text-muted-foreground mt-2">
          Rows are ready for a scheduled worker (Supabase Edge Function + cron). Members can opt in under Your Training → Reminders.
        </p>
      </div>
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent jobs</CardTitle>
          <Button variant="outline" size="sm" onClick={() => load()}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reminder jobs yet.</p>
          ) : (
            <div className="overflow-x-auto text-sm">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="pb-2 pr-4">When</th>
                    <th className="pb-2 pr-4">Kind</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2">User</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j) => (
                    <tr key={j.id} className="border-b border-border/40">
                      <td className="py-2 pr-4 whitespace-nowrap">{new Date(j.scheduled_for).toLocaleString()}</td>
                      <td className="py-2 pr-4">{j.kind}</td>
                      <td className="py-2 pr-4">{j.status}</td>
                      <td className="py-2 font-mono text-xs">{j.user_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
