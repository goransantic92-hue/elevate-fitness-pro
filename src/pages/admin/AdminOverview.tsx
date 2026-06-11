import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, LineChart, Bell, BookOpen, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AdminOverview() {
  const [counts, setCounts] = useState({ members: 0, checkins: 0, reminders: 0, handbookLeads: 0, homepagePending: 0 });

  useEffect(() => {
    (async () => {
      const [p, c, r, h, homepage] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("progress_checkins").select("id", { count: "exact", head: true }),
        supabase.from("reminder_jobs").select("id", { count: "exact", head: true }),
        supabase.from("handbook_leads").select("id", { count: "exact", head: true }),
        supabase.from("homepage_content").select("locale", { count: "exact", head: true }).eq("review_status", "pending_review"),
      ]);
      setCounts({
        members: p.count ?? 0,
        checkins: c.count ?? 0,
        reminders: r.count ?? 0,
        handbookLeads: h.count ?? 0,
        homepagePending: homepage.count ?? 0,
      });
    })();
  }, []);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-black">Coach dashboard</h1>
        <p className="text-muted-foreground mt-2">High-level view of members, progress data, and reminder queue.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <Card className="glass-card border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Handbook leads</CardTitle>
            <BookOpen className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{counts.handbookLeads}</p>
            <Button variant="link" className="mt-2 h-auto p-0 text-amber-500" asChild>
              <Link to="/admin/leads">View & export emails</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      {counts.homepagePending > 0 && (
        <Card className="glass-card border-amber-500/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Homepage changes waiting</CardTitle>
            <Home className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {counts.homepagePending} locale{counts.homepagePending === 1 ? "" : "s"} marked ready for review. Publish from the homepage editor — no deploy needed.
            </p>
            <Button variant="link" className="h-auto p-0 text-amber-500" asChild>
              <Link to="/admin/homepage">Open homepage editor</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <p className="text-sm text-muted-foreground">
        Purchases via Stripe unlock access automatically. You can still grant or revoke access manually under Members. Hero and coach copy can be edited under Homepage. Workout and nutrition copy follows the official PDF in the app code.
      </p>
    </div>
  );
}
