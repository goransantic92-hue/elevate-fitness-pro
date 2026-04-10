import { MemberGate } from "@/components/MemberGate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  eatAnywhere,
  nutritionRules,
  sampleMealPlan,
  supplementEssential,
  supplementOptional,
  supplementWaste,
} from "@/data/busyStrong90";
import { Ban, Beef, Pill, Utensils } from "lucide-react";

export default function DashboardNutritionPage() {
  return (
    <MemberGate>
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-black">Nutrition system</h1>
          <p className="text-muted-foreground mt-2">
            From your manual — three rules, a sample day structure, eating anywhere, and what to buy (or skip) for supplements.
          </p>
        </div>

        <section>
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <Utensils className="h-5 w-5 text-primary" />
            The only rules you need
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {nutritionRules.map((r) => (
              <Card key={r.number} className="glass-card">
                <CardHeader className="pb-2">
                  <p className="text-xs font-bold text-primary">RULE {r.number}</p>
                  <CardTitle className="text-base leading-snug">{r.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed">{r.body}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-black mb-4">Sample daily meal plan</h2>
          <p className="text-sm text-muted-foreground mb-4">80kg male template — adjust to your weight. Structure matters more than exact foods.</p>
          <div className="space-y-3">
            {sampleMealPlan.map((m) => (
              <Card key={m.name} className="glass-card">
                <CardContent className="p-5 flex flex-col md:flex-row md:gap-6">
                  <div className="shrink-0 w-28">
                    <p className="text-xs font-bold text-primary">{m.time}</p>
                    <p className="text-sm font-bold mt-1">{m.name}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{m.meal}</p>
                    <p className="text-xs text-muted-foreground mt-1">{m.macros}</p>
                    <p className="text-xs text-muted-foreground mt-2 italic">Coach tip: {m.tip}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <Beef className="h-5 w-5 text-primary" />
            Eat anywhere
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {eatAnywhere.map((block) => (
              <Card key={block.place} className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-primary">{block.place}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    {block.tips.map((t) => (
                      <li key={t} className="flex gap-2">
                        <span className="text-primary">→</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="glass-card mt-4 bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-bold mb-2">The 90/10 rule</h3>
              <p className="text-sm text-muted-foreground">
                Be compliant 90% of the time — 54 of 60 meals in two weeks on plan. The other 6? Enjoy them. Aim for compliance, not perfection.
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Supplements
          </h2>
          <p className="text-sm text-muted-foreground mb-4">Supplements are ~5% of results. Food is ~80%. Training ~15%.</p>
          <h3 className="text-sm font-bold text-primary mb-3">Essential — do buy</h3>
          <div className="space-y-2 mb-8">
            {supplementEssential.map((s) => (
              <Card key={s.name} className="glass-card">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
                  <span className="font-bold w-48 shrink-0">{s.name}</span>
                  <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded w-fit">{s.dose}</span>
                  <span className="text-muted-foreground">{s.note}</span>
                </CardContent>
              </Card>
            ))}
          </div>
          <h3 className="text-sm font-bold text-muted-foreground mb-3">Optional — situational</h3>
          <div className="space-y-2 mb-8">
            {supplementOptional.map((s) => (
              <Card key={s.name} className="glass-card">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
                  <span className="font-semibold w-48 shrink-0">{s.name}</span>
                  <span className="text-xs bg-secondary px-2 py-1 rounded w-fit">{s.dose}</span>
                  <span className="text-muted-foreground">{s.note}</span>
                </CardContent>
              </Card>
            ))}
          </div>
          <h3 className="text-sm font-bold text-destructive mb-3 flex items-center gap-2">
            <Ban className="h-4 w-4" />
            Waste of money — don&apos;t buy
          </h3>
          <div className="space-y-2">
            {supplementWaste.map((s) => (
              <Card key={s.name} className="glass-card opacity-70">
                <CardContent className="p-4 flex flex-col sm:flex-row gap-2 text-sm">
                  <span className="font-bold line-through w-48 shrink-0">{s.name}</span>
                  <span className="text-muted-foreground">{s.reason}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </MemberGate>
  );
}
