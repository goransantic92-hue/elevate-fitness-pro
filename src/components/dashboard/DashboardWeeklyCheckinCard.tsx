import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";

type Checkin = Database["public"]["Tables"]["progress_checkins"]["Row"];

type Props = {
  checkins: Checkin[];
  week: number;
  onWeekChange: (w: number) => void;
  saving: boolean;
  onSave: (payload: { week: number; weightKg: string; notes: string }) => void;
};

export function DashboardWeeklyCheckinCard({ checkins, week, onWeekChange, saving, onSave }: Props) {
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const row = checkins.find((c) => c.week_number === week);
    setWeight(row?.weight_kg != null ? String(row.weight_kg) : "");
    setNotes(row?.notes ?? "");
  }, [week, checkins]);

  const historySorted = useMemo(() => {
    return [...checkins].sort((a, b) => b.week_number - a.week_number);
  }, [checkins]);

  return (
    <section className="glass-card p-6 md:p-8 border-border/60">
      <h2 className="text-lg font-black">Weekly check-in</h2>
      <p className="text-sm text-muted-foreground mt-1 mb-6">Monday weight + short note (optional).</p>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-10 items-start">
        <form
          className="space-y-4 max-w-lg md:max-w-none"
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ week, weightKg: weight, notes });
          }}
        >
          <div className="space-y-2">
            <Label>Week (1–12)</Label>
            <Select value={String(week)} onValueChange={(v) => onWeekChange(Number(v))}>
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

        <div className="min-h-[200px] md:border-l md:border-border/50 md:pl-8 pt-2 md:pt-0">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Check-in history</h3>
          {historySorted.length === 0 ? (
            <p className="text-sm text-muted-foreground leading-relaxed">
              After you save a check-in, it appears here by week. Tap a row to load that week in the form.
            </p>
          ) : (
            <ScrollArea className="h-[min(360px,50vh)] pr-3">
              <ul className="space-y-2">
                {historySorted.map((c) => {
                  const active = c.week_number === week;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => onWeekChange(c.week_number)}
                        className={cn(
                          "w-full text-left rounded-xl border px-3 py-2.5 transition-colors",
                          active
                            ? "border-primary/50 bg-primary/10"
                            : "border-border/60 bg-card/40 hover:border-primary/30 hover:bg-card/60"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold">Week {c.week_number}</span>
                          <span className="text-sm font-semibold text-primary tabular-nums">
                            {c.weight_kg != null ? `${c.weight_kg} kg` : "—"}
                          </span>
                        </div>
                        {c.notes?.trim() ? (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-3 leading-snug">{c.notes}</p>
                        ) : (
                          <p className="text-xs text-muted-foreground/70 mt-1 italic">No notes</p>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          )}
        </div>
      </div>
    </section>
  );
}
