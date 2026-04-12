import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Database } from "@/types/database";

type Checkin = Database["public"]["Tables"]["progress_checkins"]["Row"];

type Props = {
  checkins: Checkin[];
  defaultWeek: number;
  saving: boolean;
  onSave: (payload: { week: number; weightKg: string; notes: string }) => void;
};

export function DashboardWeeklyCheckinCard({ checkins, defaultWeek, saving, onSave }: Props) {
  const [week, setWeek] = useState(defaultWeek);

  useEffect(() => {
    setWeek(defaultWeek);
  }, [defaultWeek]);

  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const row = checkins.find((c) => c.week_number === week);
    setWeight(row?.weight_kg != null ? String(row.weight_kg) : "");
    setNotes(row?.notes ?? "");
  }, [week, checkins]);

  return (
    <section className="glass-card p-6 md:p-8 border-border/60">
      <h2 className="text-lg font-black">Weekly check-in</h2>
      <p className="text-sm text-muted-foreground mt-1 mb-6">Monday weight + short note (optional).</p>
      <form
        className="space-y-4 max-w-lg"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ week, weightKg: weight, notes });
        }}
      >
        <div className="space-y-2">
          <Label>Week (1–12)</Label>
          <Select value={String(week)} onValueChange={(v) => setWeek(Number(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <SelectItem key={n} value={String(n)}>
                  Week {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dash-weight">Weight (kg)</Label>
          <Input
            id="dash-weight"
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g. 82.4"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dash-notes">Notes</Label>
          <Textarea
            id="dash-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Sleep, stress, lifts felt heavy…"
          />
        </div>
        <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground font-bold">
          {saving ? "Saving…" : "Save check-in"}
        </Button>
      </form>
    </section>
  );
}
