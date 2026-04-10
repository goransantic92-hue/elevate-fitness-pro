import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { MemberGate } from "@/components/MemberGate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { programMeta, weeklySchedule } from "@/data/busyStrong90";

export default function DashboardHome() {
  const { hasProgramAccess, profile } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          Hey{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-muted-foreground mt-2">
          {programMeta.name} — {programMeta.tagline} Your digital command center for training, nutrition, and progress.
        </p>
      </div>

      {!hasProgramAccess ? (
        <MemberGate>
          <span />
        </MemberGate>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">This week</CardTitle>
                <CardDescription>Same structure all 12 weeks — consistency is king.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {weeklySchedule.slice(0, 5).map((d) => (
                  <div key={d.day} className="flex justify-between text-sm border-b border-border/40 pb-2 last:border-0">
                    <span className="font-medium">{d.day}</span>
                    <span className="text-muted-foreground text-right">{d.session}</span>
                  </div>
                ))}
                <Button variant="link" className="px-0 text-primary" asChild>
                  <Link to="/dashboard/roadmap">
                    Full schedule <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick actions</CardTitle>
                <CardDescription>Everything from your manual, organized for daily use.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button asChild variant="secondary" className="justify-between">
                  <Link to="/dashboard/training">
                    Open training plans <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="justify-between">
                  <Link to="/dashboard/nutrition">
                    Nutrition system <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="justify-between">
                  <Link to="/dashboard/progress">
                    Log progress <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">Today&apos;s mindset</CardTitle>
              <CardDescription>From the manual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground italic">&ldquo;{programMeta.quote}&rdquo; — {programMeta.coach.name}</p>
              <ul className="text-sm space-y-2">
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  Train smart — minimum effective dose, not maximum suffering.
                </li>
                <li className="flex gap-2">
                  <Circle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  Log Monday weight, main lifts each session, photos every 4 weeks.
                </li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
