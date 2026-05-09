import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, LineChart, Bell } from "lucide-react";

export default function AdminOverview() {
  const [counts, setCounts] = useState({ members: 0, checkins: 0, reminders: 0 });

  useEffect(() => {
    (async () => {
      const [p, c, r] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("progress_checkins").select("id", { count: "exact", head: true }),
        supabase.from("reminder_jobs").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        members: p.count ?? 0,
        checkins: c.count ?? 0,
        reminders: r.count ?? 0,
      });
    })();
  }, []);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-black">Coach dashboard</h1>
        <p className="text-muted-foreground mt-2">High-level view of members, progress data, and reminder queue.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="glass-card border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Profiles</CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{counts.members}</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Progress check-ins</CardTitle>
            <LineChart className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{counts.checkins}</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reminder jobs</CardTitle>
            <Bell className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{counts.reminders}</p>
          </CardContent>
        </Card>
      </div>
      <p className="text-sm text-muted-foreground">
        Purchases via Stripe unlock access automatically. You can still grant or revoke access manually under Members. Workout and nutrition copy follows the official PDF in the app code; database content is for extra resources only.
      </p>
    </div>
  );
}
