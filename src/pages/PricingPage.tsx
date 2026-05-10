import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Zap, Star, Loader2 } from "lucide-react";
import { PageMeta } from "@/components/seo/PageMeta";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { buildProgramCheckoutUrl } from "@/lib/stripeProgramCheckout";

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
];

const PricingPage = () => {
  const { user, hasProgramAccess, configured, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [checkoutBusy, setCheckoutBusy] = useState(false);

  useEffect(() => {
    if (searchParams.get("checkout") === "canceled") {
      toast({
        title: "Checkout canceled",
        description: "You can complete your purchase anytime from this page.",
      });
      const next = new URLSearchParams(searchParams);
      next.delete("checkout");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams, toast]);

  async function startCheckout() {
    if (!configured) {
      toast({ title: "Not configured", description: "Supabase environment is missing.", variant: "destructive" });
      return;
    }
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent("/pricing")}`);
      return;
    }
    setCheckoutBusy(true);
    try {
      window.location.href = buildProgramCheckoutUrl(user);
    } catch {
      toast({
        title: "Checkout failed",
        description: "Invalid Stripe payment link configuration.",
        variant: "destructive",
      });
    } finally {
      setCheckoutBusy(false);
    }
  }

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

              <div className="flex flex-col gap-3">
                {loading ? (
                  <Button
                    type="button"
                    className="w-full bg-primary text-primary-foreground font-bold text-xs sm:text-sm md:text-base h-auto min-h-12 py-3 px-2 leading-snug whitespace-normal"
                    disabled
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" aria-hidden />
                    Checking account…
                  </Button>
                ) : hasProgramAccess ? (
                  <Button
                    className="w-full bg-primary text-primary-foreground font-bold text-sm md:text-base h-12 hover:bg-primary/90 animate-pulse-glow"
                    asChild
                  >
                    <Link to="/dashboard" className="inline-flex w-full items-center justify-center gap-2">
                      Go to member dashboard
                      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="w-full bg-primary text-primary-foreground font-bold text-xs sm:text-sm md:text-base h-auto min-h-12 py-3 px-2 hover:bg-primary/90 animate-pulse-glow leading-snug whitespace-normal"
                    disabled={checkoutBusy || !configured}
                    onClick={() => void startCheckout()}
                  >
                    {checkoutBusy ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" aria-hidden />
                        Redirecting to checkout…
                      </>
                    ) : (
                      <>
                        <span className="max-w-full text-pretty">Get the program</span>
                        <ArrowRight className="ml-1 h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
                      </>
                    )}
                  </Button>
                )}

                {!hasProgramAccess && !loading && (
                  <p className="text-center text-xs text-muted-foreground">
                    {user ? (
                      <>Checkout opens on Stripe with your account.</>
                    ) : (
                      <>
                        Already registered?{" "}
                        <Link to="/login?redirect=/pricing" className="text-primary font-semibold hover:underline">
                          Log in
                        </Link>
                        {" · New here? "}
                        <Link to="/signup?redirect=/pricing" className="text-primary font-semibold hover:underline">
                          Sign up
                        </Link>
                      </>
                    )}
                  </p>
                )}
              </div>
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
