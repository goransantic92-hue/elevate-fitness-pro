import { useCallback, useEffect, useState } from "react";
import { MemberGate } from "@/components/MemberGate";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/types/database";

type Prefs = Database["public"]["Tables"]["notification_preferences"]["Row"];

export default function DashboardNotificationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase.from("notification_preferences").select("*").eq("user_id", user.id).maybeSingle();
    if (error) {
      toast({ title: "Could not load preferences", description: error.message, variant: "destructive" });
    } else {
      setPrefs(data);
    }
    setLoading(false);
  }, [user, toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function patch(partial: Partial<Prefs>) {
    if (!user || !prefs) return;
    const next = { ...prefs, ...partial };
    setPrefs(next);
    const { error } = await supabase.from("notification_preferences").upsert({
      user_id: user.id,
      email_reminders: next.email_reminders,
      push_enabled: next.push_enabled,
      preferred_reminder_time: next.preferred_reminder_time,
      timezone: next.timezone,
    });
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      load();
    }
  }

  return (
    <MemberGate>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black">Reminders & notifications</h1>
          <p className="text-muted-foreground mt-2">
            Your preferences are stored now; email and push delivery will connect when backend jobs are enabled (Edge Functions +
            provider).
          </p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Preferences</CardTitle>
            <CardDescription>Structured for future automation — training slots, Sunday reset, etc.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading || !prefs ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : (
              <>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label className="text-base">Email reminders</Label>
                    <p className="text-xs text-muted-foreground">When enabled, we&apos;ll use this flag to schedule nudges.</p>
                  </div>
                  <Switch checked={prefs.email_reminders} onCheckedChange={(v) => patch({ email_reminders: v })} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label className="text-base">Push notifications (future)</Label>
                    <p className="text-xs text-muted-foreground">Reserved for web push or native wrapper.</p>
                  </div>
                  <Switch checked={prefs.push_enabled} onCheckedChange={(v) => patch({ push_enabled: v })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tz">Timezone (IANA)</Label>
                  <Input
                    id="tz"
                    placeholder="e.g. Europe/Belgrade"
                    defaultValue={prefs.timezone ?? ""}
                    onBlur={(e) => patch({ timezone: e.target.value || null })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Preferred reminder time</Label>
                  <Input
                    id="time"
                    type="time"
                    defaultValue={prefs.preferred_reminder_time?.slice(0, 5) ?? ""}
                    onBlur={(e) => patch({ preferred_reminder_time: e.target.value ? `${e.target.value}:00` : null })}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </MemberGate>
  );
}
