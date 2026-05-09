import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Zap, Star } from "lucide-react";
import { PageMeta } from "@/components/seo/PageMeta";

const features = [
  "3 Gym Training Programs (A/B/C)",
  "3 Home Training Programs (A/B/C)",
  "4 Emergency 10-Minute Workouts",
  "Complete Nutrition Framework",
  "Sample Daily Meal Plan",
  "Eat Anywhere guide",
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
      <PageMeta
        title="Pricing — BUSY STRONG 90"
        description="Launch price €39 one-time for the full BUSY STRONG 90 digital program. Lifetime access to training, nutrition, and habits."
        path="/pricing"
      />
      <section className="py-28 md:py-36">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xs text-primary font-bold tracking-widest mb-4">PRICING</div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            One Program. <span className="text-gradient">One Price.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            No subscriptions. No hidden fees. One payment, lifetime access — aligned with your manual.
          </p>
        </div>
      </section>

      <section className="pb-20 md:pb-28 px-3 sm:px-4">
        <div className="container mx-auto max-w-lg min-w-0">
          <div className="glass-card glow-green overflow-hidden min-w-0">
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-5 sm:p-8 text-center border-b border-border/50">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
                <Zap className="h-3 w-3" /> LAUNCH PRICE — LIMITED TIME
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-2">€39</h2>
              <p className="text-muted-foreground text-[10px] leading-snug sm:text-xs md:text-sm tracking-tight text-center whitespace-normal sm:whitespace-nowrap px-1">
                One-time payment · Lifetime access
              </p>
            </div>

            <div className="p-5 sm:p-8">
              <h3 className="font-bold text-sm uppercase tracking-wider text-primary mb-6">Everything Included:</h3>
              <div className="space-y-3 mb-8">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 min-w-0">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm text-left break-words">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className="w-full bg-primary text-primary-foreground font-bold text-xs sm:text-sm md:text-base h-auto min-h-10 py-2.5 px-2 sm:px-3 sm:min-h-11 sm:py-3 md:h-12 md:py-0 hover:bg-primary/90 animate-pulse-glow leading-snug whitespace-normal"
                asChild
              >
                <Link
                  to="/signup"
                  className="inline-flex w-full min-h-[2.75rem] items-center justify-center gap-1.5 text-center flex-wrap sm:flex-nowrap px-1.5 py-2 whitespace-normal"
                >
                  <span className="max-w-full text-pretty">Create account</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 md:h-5 md:w-5" aria-hidden />
                </Link>
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Already registered?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="flex justify-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground italic max-w-md mx-auto">
              &ldquo;I built this program to genuinely change lives — not just sell a PDF. If you have questions, reach out. I read every
              message.&rdquo;
            </p>
            <p className="text-sm font-bold mt-2">— Coach Milos</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
