import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

export default function AdminWorkoutsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-black">Workouts & nutrition (CMS)</h1>
        <p className="text-muted-foreground mt-2">
          Gym A/B/C, home A/B/C, emergency sessions, and nutrition rules are authored from the official PDF in{" "}
          <code className="text-primary">src/data/busyStrong90.ts</code> so they stay aligned with the product you sell.
        </p>
      </div>
      <Card className="glass-card border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-amber-500" />
            Future: editable overrides
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            When you want coach-controlled tweaks without a deploy, we can add versioned rows in Postgres or link to PDF revisions. For
            now, ship changes through code review so nothing drifts from the manual.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
