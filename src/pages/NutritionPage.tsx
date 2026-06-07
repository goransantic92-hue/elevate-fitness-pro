import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Utensils, MapPin, Pill, Apple, Beef, Egg } from "lucide-react";
import coachWorkout from "@/assets/coach-workout.webp";
import {
  nutritionRules,
  sampleMealPlan,
  eatAnywhere,
  supplementEssential,
  supplementOptional,
  supplementWaste,
} from "@/data/busyStrong90";
import { PageMeta } from "@/components/seo/PageMeta";
import { PRICING } from "@/lib/pricing";

const ruleIcons = [Beef, Apple, Egg];

const NutritionPage = () => {
  return (
    <div>
      <PageMeta
        title="Nutrition framework — rules, meals, eat anywhere"
        description="Three nutrition rules, sample meal plan, Eat Anywhere guide, and supplement guidance from the BUSY STRONG 90 manual."
        path="/nutrition"
      />
      {/* Hero */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={coachWorkout}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="text-xs text-primary font-bold tracking-widest mb-4">NUTRITION SYSTEM</div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            Eat Simply. <span className="text-gradient">Stay Strong.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The fitness industry overcomplicates nutrition to sell you products. The truth is simple. Master three rules and outperform 90% of people who follow complicated diets.
          </p>
        </div>
      </section>

      {/* 3 Rules */}
      <section className="section-padding">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
            The Only <span className="text-gradient">3 Rules</span> You Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nutritionRules.map((rule, i) => {
              const Icon = ruleIcons[i] ?? Utensils;
              return (
                <div key={rule.number} className="glass-card p-8 hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-xs text-primary font-bold tracking-widest mb-2">RULE {rule.number}</div>
                  <h3 className="text-lg font-bold mb-3">{rule.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{rule.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sample Meal Plan */}
      <section className="section-padding bg-card/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Sample <span className="text-gradient">Daily Meal Plan</span>
            </h2>
            <p className="text-muted-foreground">80kg male template — adjust to your weight. Swap proteins and carbs freely. The structure matters, not the exact foods.</p>
          </div>
          <div className="space-y-4">
            {sampleMealPlan.map((meal, i) => (
              <div key={meal.name + i} className="glass-card p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="shrink-0 w-24">
                    <span className="text-xs text-primary font-bold">{meal.time}</span>
                    <p className="text-sm font-bold mt-1">{meal.name}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">{meal.meal}</p>
                    <p className="text-xs text-muted-foreground mb-2">{meal.macros}</p>
                    <p className="text-xs text-muted-foreground italic">💡 {meal.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eat Anywhere */}
      <section className="section-padding">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-3xl md:text-4xl font-black">The 'Eat Anywhere' <span className="text-gradient">Guide</span></h2>
            </div>
            <p className="text-muted-foreground">
              You will eat in restaurants. You will travel. The Eat Anywhere guide ensures you always have a strategy — no excuses, no guilt, no derailment.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {eatAnywhere.map((place) => (
              <div key={place.place} className="glass-card p-6">
                <h4 className="font-bold text-primary mb-4">{place.place}</h4>
                <ul className="space-y-2">
                  {place.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">→</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="glass-card p-8 mt-8 text-center bg-gradient-to-r from-primary/10 to-transparent">
            <h3 className="text-xl font-bold mb-2">The 90/10 Rule</h3>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Be compliant 90% of the time. That means 54 out of 60 meals in a two-week period are on plan. The other 6? Enjoy them. Life is not a diet competition.
            </p>
            <p className="text-sm mt-4 italic text-muted-foreground">"Perfection is the enemy of progress. Aim for compliance, not perfection." — Coach Milos</p>
          </div>
        </div>
      </section>

      {/* Supplements */}
      <section className="section-padding bg-card/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Pill className="h-5 w-5 text-primary" />
              <h2 className="text-3xl md:text-4xl font-black">Supplement <span className="text-gradient">Guide</span></h2>
            </div>
            <p className="text-muted-foreground">Supplements are 5% of your results. Food is 80%. Training is the remaining 15%. The right 5% still matters.</p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-primary mb-4">✅ Essential — Do Buy</h3>
            <div className="space-y-3">
              {supplementEssential.map((s) => (
                <div key={s.name} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <span className="font-bold text-sm w-48 shrink-0">{s.name}</span>
                  <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded w-fit">{s.dose}</span>
                  <span className="text-sm text-muted-foreground">{s.note}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-muted-foreground mb-4">Optional — situational</h3>
            <div className="space-y-3">
              {supplementOptional.map((s) => (
                <div key={s.name} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <span className="font-semibold text-sm w-48 shrink-0">{s.name}</span>
                  <span className="text-xs bg-secondary px-2 py-1 rounded w-fit">{s.dose}</span>
                  <span className="text-sm text-muted-foreground">{s.note}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-destructive mb-4">❌ Waste of Money — Don&apos;t Buy</h3>
            <div className="space-y-3">
              {supplementWaste.map((s) => (
                <div key={s.name} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 opacity-60">
                  <span className="font-bold text-sm w-48 shrink-0 line-through">{s.name}</span>
                  <span className="text-sm text-muted-foreground">{s.reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-black mb-4">Ready to <span className="text-gradient">Transform</span>?</h2>
          <p className="text-muted-foreground mb-8">Get the complete nutrition framework, meal plans, and guides inside BUSY STRONG 90.</p>
          <Link to="/pricing">
            <Button size="lg" className="bg-primary text-primary-foreground font-bold h-14 px-10 glow-green">
              Get Full Access — {PRICING.selfGuided.label} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default NutritionPage;
