import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import coachHanging from "@/assets/coach-hanging.webp";
import { PageMeta } from "@/components/seo/PageMeta";
import { usePricing } from "@/hooks/usePricing";
import { usePublishedSiteCms } from "@/hooks/usePublishedSiteCms";
import { resolveProgramCms } from "@/lib/siteCms";

const phaseColors = ["from-primary/20 to-primary/5", "from-primary/30 to-primary/10", "from-primary/40 to-primary/15"];

type Phase = { number: string; name: string; weeks: string; description: string; focus: string[] };
type ScheduleDay = { day: string; session: string; duration: string; focus: string; note: string };

const ProgramPage = () => {
  const { t } = useTranslation("program");
  const pricing = usePricing();
  const { data: programCms } = usePublishedSiteCms("program");
  const content = resolveProgramCms(programCms ?? null, t);

  const phases = content.phases;
  const weeklySchedule = content.schedule.items;
  const includedItems = content.included.items;

  return (
    <div>
      <PageMeta title={t("meta.title")} description={t("meta.description")} path="/program" />
      {/* Hero */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={coachHanging}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="text-xs text-primary font-bold tracking-widest mb-4">{content.hero.eyebrow}</div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            {content.hero.headline} <span className="text-gradient">{content.hero.headlineHighlight}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{content.hero.subhead}</p>
        </div>
      </section>

      {/* Phases */}
      <section className="section-padding">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-8">
            {phases.map((phase, i) => (
              <div
                key={phase.number}
                className={`glass-card p-5 sm:p-8 md:p-10 bg-gradient-to-r ${phaseColors[i] ?? phaseColors[0]} relative rounded-2xl min-w-0`}
              >
                <div className="pointer-events-none absolute top-2 right-2 text-5xl leading-none font-black text-primary/5 sm:top-4 sm:right-5 sm:text-7xl md:text-8xl md:right-6">
                  {phase.number}
                </div>
                <div className="relative z-10 min-w-0 pr-10 sm:pr-14 md:pr-20">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                    <span className="text-xs text-primary font-bold tracking-widest">
                      {t("phaseLabel", { number: phase.number })}
                    </span>
                    <span className="text-xs text-muted-foreground">{phase.weeks}</span>
                  </div>
                  <h2 className="text-xl font-black leading-tight tracking-tight break-words text-balance sm:text-2xl md:text-3xl mb-4">
                    {phase.name}
                  </h2>
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
              {content.schedule.title} <span className="text-gradient">{content.schedule.titleHighlight}</span>
            </h2>
            <p className="text-muted-foreground">{content.schedule.subhead}</p>
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
                    <span className="text-muted-foreground text-sm ms-2">— {day.focus}</span>
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
            {content.included.title} <span className="text-gradient">{content.included.titleHighlight}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            {includedItems.map((item) => (
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
                {content.included.cta?.replace("{{price}}", pricing.selfGuided.label) ?? pricing.selfGuided.label}{" "}
                <ArrowRight className="icon-directional ms-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramPage;
