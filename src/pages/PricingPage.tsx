import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Shield, Zap, Clock, Star } from "lucide-react";

const features = [
  "3 Gym Training Programs (A/B/C)",
  "3 Home Training Programs (A/B/C)",
  "4 Emergency 10-Minute Workouts",
  "Complete Nutrition Framework",
  "Sample Daily Meal Plan",
  "'Eat Anywhere' Restaurant Guide",
  "Evidence-Based Supplement Guide",
  "6-Habit System for Consistency",
  "12-Week Progress Tracking",
  "Phase-by-Phase Roadmap",
  "Coach Tips on Every Exercise",
  "Lifetime Access + Updates",
];

const PricingPage = () => {
  return (
    <div>
      <section className="py-28 md:py-36">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xs text-primary font-bold tracking-widest mb-4">PRICING</div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            One Program. <span className="text-gradient">One Price.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            No subscriptions. No hidden fees. One payment, lifetime access.
          </p>
        </div>
      </section>

      <section className="pb-20 md:pb-28 px-4">
        <div className="container mx-auto max-w-lg">
          <div className="glass-card glow-green overflow-hidden">
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-8 text-center border-b border-border/50">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
                <Zap className="h-3 w-3" /> LAUNCH PRICE — LIMITED TIME
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-2">
                €39
              </h2>
              <p className="text-muted-foreground text-sm">One-time payment · Lifetime access</p>
            </div>

            <div className="p-8">
              <h3 className="font-bold text-sm uppercase tracking-wider text-primary mb-6">Everything Included:</h3>
              <div className="space-y-3 mb-8">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button className="w-full bg-primary text-primary-foreground font-bold text-lg h-14 hover:bg-primary/90 animate-pulse-glow" size="lg">
                Start Your Transformation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> Secure Payment</div>
                <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Instant Access</div>
              </div>
            </div>
          </div>

          {/* Trust */}
          <div className="mt-12 text-center">
            <div className="flex justify-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground italic max-w-md mx-auto">
              "I built this program to genuinely change lives — not just sell a PDF. If you have questions, reach out. I read every message."
            </p>
            <p className="text-sm font-bold mt-2">— Coach Milos</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
