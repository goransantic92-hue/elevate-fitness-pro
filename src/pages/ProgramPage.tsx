import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import coachHanging from "@/assets/coach-hanging.jpg";
import { phases, weeklySchedule } from "@/data/busyStrong90";
import { PageMeta } from "@/components/seo/PageMeta";

const phaseColors = ["from-primary/20 to-primary/5", "from-primary/30 to-primary/10", "from-primary/40 to-primary/15"];

const ProgramPage = () => {
  return (
    <div>
      <PageMeta
        title="Program overview — 90-day roadmap"
        description="Three 4-week phases, weekly training schedule, and everything included in BUSY STRONG 90 for busy people 35+."
        path="/program"
      />
      {/* Hero */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <img src={coachHanging} alt="Coach Milos training" className="w-full h-full object-cover object-top opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="text-xs text-primary font-bold tracking-widest mb-4">THE PROGRAM</div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            Your 90-Day <span className="text-gradient">Road Map</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            90 days divided into three distinct 4-week phases, each building on the last. You do not jump phases. You do not skip weeks. Trust the process.
          </p>
        </div>
      </section>

      {/* Phases */}
      <section className="section-padding">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-8">
            {phases.map((phase, i) => (
              <div key={phase.number} className={`glass-card p-8 md:p-10 bg-gradient-to-r ${phaseColors[i] ?? phaseColors[0]} relative overflow-hidden`}>
                <div className="absolute top-4 right-6 text-8xl font-black text-primary/5">{phase.number}</div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-primary font-bold tracking-widest">PHASE {phase.number}</span>
                    <span className="text-xs text-muted-foreground">{phase.weeks}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black mb-4">{phase.name}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">{phase.description}</p>
                  <div className="flex flex-wrap gap-3">
                    {phase.focus.map((f) => (
                      <span key={f} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                        <Check className="h-3 w-3" /> {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Schedule */}
      <section className="section-padding bg-card/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Your Weekly <span className="text-gradient">Schedule</span>
            </h2>
            <p className="text-muted-foreground">Same structure for all 12 weeks. Consistency is king.</p>
          </div>
          <div className="space-y-3">
            {weeklySchedule.map((day) => {
              const isTraining = day.session.startsWith("Training") || day.session === "10-Min Bonus";
              return (
                <div key={day.day} className={`glass-card p-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-6 ${isTraining ? "border-primary/20" : ""}`}>
                  <div className="w-28 shrink-0">
                    <span className={`font-bold text-sm ${isTraining ? "text-primary" : "text-muted-foreground"}`}>{day.day}</span>
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-sm">{day.session}</span>
                    <span className="text-muted-foreground text-sm ml-2">— {day.focus}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{day.duration}</div>
                  <div className="text-xs text-muted-foreground italic hidden md:block max-w-[200px]">{day.note}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="section-padding">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-10">
            Everything <span className="text-gradient">Included</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            {[
              "3 Gym Training Programs (A/B/C)",
              "3 Home Training Programs (A/B/C)",
              "4 Emergency 10-Min Workouts",
              "Complete Nutrition Framework",
              "Sample Meal Plans",
              "'Eat Anywhere' Restaurant Guide",
              "Supplement Guide (What to buy & skip)",
              "6-Habit System for Consistency",
              "12-Week Progress Tracking Log",
              "Realistic Progress Timeline",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 py-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link to="/pricing">
              <Button size="lg" className="bg-primary text-primary-foreground font-bold h-14 px-10 glow-green">
                Get Full Access — €39 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramPage;
