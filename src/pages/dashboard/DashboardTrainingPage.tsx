import { Link } from "react-router-dom";
import { MemberGate } from "@/components/MemberGate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { gymWorkouts, homeWorkouts, emergencyWorkouts } from "@/data/busyStrong90";
import { ArrowRight } from "lucide-react";

function WorkoutCard({
  variant,
  id,
  title,
  focus,
}: {
  variant: "gym" | "home";
  id: string;
  title: string;
  focus: string;
}) {
  return (
    <Card className="glass-card hover:border-primary/30 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">{title}</CardTitle>
        <CardDescription>{focus}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild size="sm" variant="secondary" className="w-full justify-between">
          <Link to={`/dashboard/training/${variant}/${id}`}>
            View workout <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function DashboardTrainingPage() {
  return (
    <MemberGate>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black">Training plans</h1>
          <p className="text-muted-foreground mt-2">
            Gym and home versions match in structure and intensity. Progressive overload: add weight or reps each session.
          </p>
        </div>

        <Tabs defaultValue="gym" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="gym">Gym</TabsTrigger>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="emergency">10 min</TabsTrigger>
          </TabsList>
          <TabsContent value="gym" className="mt-6 grid sm:grid-cols-3 gap-4">
            {(["a", "b", "c"] as const).map((k) => {
              const w = gymWorkouts[k];
              return <WorkoutCard key={k} variant="gym" id={k} title={w.title} focus={w.focus} />;
            })}
          </TabsContent>
          <TabsContent value="home" className="mt-6 grid sm:grid-cols-3 gap-4">
            {(["a", "b", "c"] as const).map((k) => {
              const w = homeWorkouts[k];
              return <WorkoutCard key={k} variant="home" id={k} title={w.title} focus={w.focus} />;
            })}
          </TabsContent>
          <TabsContent value="emergency" className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground max-w-2xl">
              Not substitutes for main sessions — far better than skipping. From the manual: &ldquo;Missing a session is a choice.&rdquo;
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {emergencyWorkouts.map((w) => (
                <Card key={w.id} className="glass-card">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-base">{w.name}</CardTitle>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">{w.time}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button asChild size="sm" variant="secondary" className="w-full justify-between">
                      <Link to={`/dashboard/training/emergency/${w.id}`}>
                        Open workout <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <table className="w-full text-xs text-muted-foreground">
                      <thead>
                        <tr className="text-left border-b border-border/50">
                          <th className="pb-2 pr-2">Exercise</th>
                          <th className="pb-2 pr-2">Sets</th>
                          <th className="pb-2 pr-2">Reps</th>
                          <th className="pb-2">Rest</th>
                        </tr>
                      </thead>
                      <tbody>
                        {w.rows.map((r) => (
                          <tr key={r.exercise} className="border-b border-border/30">
                            <td className="py-2 pr-2 text-foreground">{r.exercise}</td>
                            <td className="py-2 pr-2">{r.sets}</td>
                            <td className="py-2 pr-2">{r.reps}</td>
                            <td className="py-2">{r.rest}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MemberGate>
  );
}
