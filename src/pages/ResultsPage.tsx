import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Scale, Dumbbell, Battery, Eye } from "lucide-react";
import coachFront from "@/assets/coach-front.webp";
import { progressExpectations, habits, trackingGuidance } from "@/data/busyStrong90";
import { PageMeta } from "@/components/seo/PageMeta";

const progressIcons = [Scale, Dumbbell, TrendingUp, Battery, Eye];

const progressData = progressExpectations.map((row, i) => ({
  metric: row.metric,
  icon: progressIcons[i] ?? Scale,
  week1: row.w1,
  week5: row.w2,
  week9: row.w3,
}));

const ResultsPage = () => {
  return (
    <div>
      <PageMeta
        title="Results, progress tracking & habits"
        description="Realistic 90-day progress timeline, how to track like an athlete, and the six habit pillars from BUSY STRONG 90."
        path="/results"
      />
      {/* Hero */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={coachFront}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="text-xs text-primary font-bold tracking-widest mb-4">RESULTS & HABITS</div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            What to <span className="text-gradient">Expect</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{trackingGuidance.body}</p>
        </div>
      </section>

      {/* Progress Timeline */}
      <section className="section-padding">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
            Realistic <span className="text-gradient">Progress Timeline</span>
          </h2>

          {/* Desktop Table */}
          <div className="hidden md:block glass-card overflow-hidden">
            <div className="grid grid-cols-4 bg-primary/10 p-4">
              <div className="font-bold text-sm">Metric</div>
              <div className="font-bold text-sm text-center">Phase 1 (Week 1–4)</div>
              <div className="font-bold text-sm text-center">Phase 2 (Week 5–8)</div>
              <div className="font-bold text-sm text-center">Phase 3 (Week 9–12)</div>
            </div>
            {progressData.map((row) => (
              <div key={row.metric} className="grid grid-cols-4 p-4 border-t border-border/50 items-center">
                <div className="flex items-center gap-2">
                  <row.icon className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">{row.metric}</span>
                </div>
                <div className="text-center text-sm text-muted-foreground">{row.week1}</div>
                <div className="text-center text-sm text-muted-foreground">{row.week5}</div>
                <div className="text-center text-sm text-primary font-medium">{row.week9}</div>
              </div>
            ))}
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {progressData.map((row) => (
              <div key={row.metric} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <row.icon className="h-4 w-4 text-primary" />
                  <span className="font-bold text-sm">{row.metric}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Week 1–4:</span> <span>{row.week1}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Week 5–8:</span> <span>{row.week5}</span></div>
                  <div className="flex justify-between"><span className="text-primary font-medium">Week 9–12:</span> <span className="text-primary">{row.week9}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Track */}
      <section className="section-padding bg-card/50">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-8">
            Track Like an <span className="text-gradient">Athlete</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Bodyweight", detail: "Every Monday morning, same time, same conditions" },
              { label: "Progress Photos", detail: "Every 4 weeks — front, side, back, same lighting" },
              { label: "Main Lifts", detail: "Each session — log weight and reps for bench, squat, row" },
            ].map((item) => (
              <div key={item.label} className="glass-card p-6">
                <h4 className="font-bold text-primary mb-2">{item.label}</h4>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 Habits */}
      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              6 Habits for <span className="text-gradient">Consistency</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">This is the section most people skip. It is also the most important. Every training methodology works if applied consistently.</p>
          </div>
          <div className="space-y-4">
            {habits.map((habit) => (
              <div key={habit.n} className="glass-card p-6 md:p-8 hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary font-black">{habit.n}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{habit.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{habit.body}</p>
                    <div className="inline-flex items-center gap-2 text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                      <span className="font-medium">ACTION:</span> {habit.action}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card/50 text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-black mb-4">
            90 days. <span className="text-gradient">Weight down. Energy back.</span>
          </h2>
          <p className="text-muted-foreground mb-8">36 sessions. 6 habits. Built for busy fathers, founders, and professionals.</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/coaching-apply?plan=coached-strong-90#apply">
              <Button size="lg" className="bg-primary text-primary-foreground font-bold h-14 px-10 glow-green">
                Apply for Coached Strong 90 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="h-14 px-8 font-semibold border-border">
                Self-guided — €39
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResultsPage;
