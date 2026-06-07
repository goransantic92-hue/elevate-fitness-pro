import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { TestimonialVideoCard } from "@/components/TestimonialVideoCard";
import { testimonialVideos } from "@/data/testimonials";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import privateTrainerFitness from "@/assets/private-trainer-fitness.webp";
import coachAbout from "@/assets/coach-about.webp";
import { PageMeta } from "@/components/seo/PageMeta";
import { faqs } from "@/data/busyStrong90";
import { CALENDLY_FREE_CALL_URL, PRICING } from "@/lib/pricing";

const whoCards = [
  { icon: "👨‍👧‍👦", title: "Busy Fathers & Parents", text: "Your kids watch everything you do. When you have energy after work, you show up for them — instead of crashing on the couch. 30–40 minutes, 3× a week, at home while they're sleeping or playing.", featured: true },
  { icon: "💼", title: "Founders & Business Owners", text: "Early mornings, late nights, back-to-back calls. You need your weight down and your energy up — not another hour in the gym. 30–40 minutes, 3× a week, train at home between meetings." },
  { icon: "🏢", title: "Corporate Professionals", text: "The 2pm energy crash. The calendar that never stops. This system fits your schedule: train at home (no commute), track kg and daily energy, and stop restarting every Monday." },
] as const;

const pillars = [
  { num: "01", title: "Train Smart", text: "3× per week. 30–40 minutes. Progressive overload. Compound movements that build real strength. No junk volume. Every rep has a purpose — because your time has a price tag." },
  { num: "02", title: "Eat Simply", text: "No app needed. No food scale. One rule: protein at every meal. The rest follows naturally. Built for people who eat with their family, travel for work, and don't have time to meal prep 6 containers on Sunday." },
  { num: "03", title: "Build Systems", text: "Motivation is unreliable. Systems are not. You build habits so automatic that missing a session feels wrong — the same way forgetting to brush your teeth would. That's the real transformation." },
] as const;

const HomePage = () => {
  return (
    <div className="font-sans">
      <PageMeta
        title="Busy Strong 90 — 90-Day Fitness for Busy Fathers in Dubai | Coach Milos"
        description="90-day training & nutrition for busy fathers 35+ in Dubai. 30–40 min home workouts, no food scale. Lose weight, restore energy. Coached Strong 90 from 1,299 AED/mo."
        path="/"
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-10 md:pb-24">
        <div
          className="pointer-events-none absolute -right-[20%] -top-1/2 h-[min(90vw,800px)] w-[min(90vw,800px)] rounded-full bg-[hsl(171_47%_50%/0.12)] blur-3xl"
          aria-hidden
        />
        <div className="container relative z-[1] mx-auto max-w-[1100px] px-6">
          <div className="mb-8 grid items-center gap-8 md:grid-cols-12 md:gap-10">
            <div className="min-w-0 md:col-span-7 lg:col-span-7">
              <h1 className="font-display text-[clamp(2.4rem,6vw,4rem)] leading-[1.08] text-foreground">
                <span className="mb-3 block font-sans text-base font-normal normal-case leading-relaxed tracking-normal text-muted-foreground md:text-lg">
                  You haven&apos;t trained in months. You&apos;re tired. Your kids see it.
                </span>
                <span className="block max-w-[22ch] text-balance">
                  For busy fathers in Dubai who want their <span className="text-primary">energy</span> back.
                </span>
              </h1>
              <p className="mt-6 max-w-[600px] text-pretty text-lg leading-relaxed text-[#ccc]">
                The 90-day system built for men who don&apos;t have time — 30–40 minutes, 3× per week, train at home (no commute). No food scale. Coached plans from{" "}
                {PRICING.coachedStrong90.labelMonthly}.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Button asChild className="h-12 rounded-lg bg-primary px-8 text-base font-bold text-primary-foreground hover:bg-primary/90">
                  <Link to="/pricing">
                    Get the Program — {PRICING.selfGuided.label}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-lg border-border bg-transparent px-8 text-base font-semibold hover:bg-transparent"
                >
                  <a href={CALENDLY_FREE_CALL_URL} target="_blank" rel="noopener noreferrer">
                    Book a Free Call
                  </a>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                <a href="#coaching" className="underline decoration-border underline-offset-4 hover:text-primary">
                  Or see how coaching works
                </a>
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["30–40 min", "No food scale", "Train at home", "Dubai, UAE"].map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-tight text-primary"
                  >
                    {pill}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  Train at home — no commute
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  30–40 min · track kg + energy
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  Built for fathers 35+
                </span>
              </div>
            </div>
            <div className="md:col-span-5 lg:col-span-5">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[430px] overflow-hidden rounded-2xl border border-border/60 bg-secondary/20">
                <img
                  src={privateTrainerFitness}
                  alt="Coach Milos — cable training in the gym"
                  width={430}
                  height={538}
                  decoding="async"
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border py-12">
        <div className="container mx-auto max-w-[1100px] px-6">
          <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4 md:gap-8">
            {[
              { v: "3×", l: "Per Week" },
              { v: "90", l: "Day System" },
              { v: "30-40", l: "Min / Session" },
              { v: "35+", l: "Age Group" },
            ].map((s) => (
              <div key={s.l}>
                <h3 className="font-display text-4xl text-primary md:text-5xl">{s.v}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who */}
      <section className="section-padding">
        <div className="container mx-auto max-w-[1100px] px-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">Built For You</p>
          <h2 className="font-display text-balance text-[clamp(2rem,5vw,3rem)] text-foreground">
            Built for busy <span className="text-primary">fathers in Dubai</span> — founders &amp; professionals welcome too
          </h2>
          <p className="mb-10 mt-4 max-w-[600px] text-pretty text-[1.05rem] leading-relaxed text-muted-foreground">
            You don&apos;t need another influencer telling you to &quot;just be consistent.&quot; You need 30–40 minutes, three times a week, and a plan that still
            works when travel, deadlines, or family blows up the week.
          </p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {whoCards.map((c) => (
              <div
                key={c.title}
                className={`group rounded-xl border bg-[hsl(0_0%_6.5%)] p-8 transition-colors ${
                  "featured" in c && c.featured
                    ? "border-2 border-primary shadow-[0_0_32px_hsl(171_47%_50%_/_0.12)]"
                    : "border-border hover:border-primary/60"
                }`}
              >
                {"featured" in c && c.featured && (
                  <div className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-primary">
                    Most common
                  </div>
                )}
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg text-xl"
                  style={{ background: "hsl(171 47% 50% / 0.12)" }}
                >
                  {c.icon}
                </div>
                <h4 className="font-sans text-base font-bold text-foreground">{c.title}</h4>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section id="coaching" className="section-padding !pt-8 border-y border-border bg-[hsl(0_0%_6.5%)]">
        <div className="container mx-auto max-w-[1100px] px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary">Choose Your Path</p>
          <h2 className="font-display mt-2 text-balance text-center text-[clamp(2rem,5vw,3rem)] text-foreground">
            The <span className="text-primary">Program</span> or The <span className="text-primary">Coach</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[560px] text-center text-pretty text-muted-foreground">
            The self-guided program gives you the system. Coaching gets you there faster — custom schedule, weekly check-ins, and tracking weight (kg) and energy
            week to week.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col rounded-2xl border border-border bg-background p-8">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">Self-Guided</div>
              <h3 className="font-display mt-1 text-3xl">Busy Strong 90</h3>
              <div className="mt-2 text-muted-foreground">
                <strong className="font-display text-4xl text-foreground">{PRICING.selfGuided.label}</strong> one-time
              </div>
              <ul className="my-6 flex-1 list-none space-y-2.5 border-t border-border pt-4 text-sm text-[#ccc]">
                {[
                  "Full 90-day program you can finish — 36 sessions, 30–40 min each",
                  "Know exactly what to do every workout",
                  "Eat normally — no food scale, no macro app",
                  "Habits that stick after the 90 days",
                  "Email support when you're stuck",
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="font-bold text-primary">✓</span>
                    {x}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="h-11 w-full border-border font-semibold">
                <Link to="/pricing">Get the Program</Link>
              </Button>
            </div>

            <div className="relative flex flex-col rounded-2xl border-2 border-primary bg-background p-8 shadow-[0_0_40px_hsl(171_47%_50%_/_0.1)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-primary-foreground">
                Recommended
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">For fathers who want accountability without the elite price.</p>
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">Core Coaching</div>
              <h3 className="font-display mt-1 text-3xl">Coached Strong 90</h3>
              <div className="mt-2 text-muted-foreground">
                <strong className="font-display text-4xl text-foreground">{PRICING.coachedStrong90.label}</strong> / month
              </div>
              <ul className="my-6 flex-1 list-none space-y-2.5 border-t border-border/80 pt-4 text-sm text-[#ccc]">
                {[
                  "Everything in Self-Guided",
                  "Train before the family wakes up — plan built for your schedule",
                  "Feel the energy shift within the first 14 days",
                  "Eat with your family — no food scale, no tracking obsession",
                  "Form checks so you train safely, without injuries",
                  "WhatsApp group that keeps you going past week 3",
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="font-bold text-primary">✓</span>
                    {x}
                  </li>
                ))}
              </ul>
              <Button asChild className="h-11 w-full bg-primary font-bold text-primary-foreground hover:bg-primary/90">
                <Link to="/coaching-apply?plan=coached-strong-90#apply">Start This Week</Link>
              </Button>
            </div>

            <div className="flex flex-col rounded-2xl border border-border bg-background p-8">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">Elite</div>
              <h3 className="font-display mt-1 text-3xl">Private Transformation</h3>
              <div className="mt-2 text-muted-foreground">
                <strong className="font-display text-4xl text-foreground">{PRICING.privateTransformation.label}</strong> / month
              </div>
              <ul className="my-6 flex-1 list-none space-y-2.5 border-t border-border pt-4 text-sm text-[#ccc]">
                {[
                  "Everything in Core Coaching",
                  "1-on-1 calls with Coach Milos (4×/month)",
                  "Fully custom program — rebuilt monthly",
                  "Direct WhatsApp access to Milos",
                  "Priority response (under 1 hour)",
                  "Monthly video call with progress analysis",
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="font-bold text-primary">✓</span>
                    {x}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="h-11 w-full border-border font-semibold">
                <Link to="/coaching-apply?plan=private-transformation#apply">Book Strategy Call</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="section-padding">
        <div className="container mx-auto max-w-[1100px] px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary">The Method</p>
          <h2 className="font-display mt-2 text-balance text-center text-[clamp(2rem,5vw,3rem)] text-foreground">
            Three Pillars of <span className="text-primary">BUSY STRONG 90</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[560px] text-center text-pretty text-[1.05rem] text-muted-foreground">
            The minimum effective dose. Not the maximum you can possibly do — the minimum that produces maximum results.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {pillars.map((p) => (
              <div
                key={p.num}
                className="relative overflow-hidden rounded-xl border border-border bg-[#111] p-8 pt-10 text-center"
              >
                <div className="absolute left-0 right-0 top-0 h-0.5 bg-primary" />
                <div className="font-display text-5xl text-primary/15 md:text-6xl">{p.num}</div>
                <h3 className="mt-1 font-display text-2xl text-foreground md:text-3xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coach */}
      <section className="section-padding !pt-8">
        <div className="container mx-auto max-w-[1100px] px-6">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-secondary/20">
              <img
                src={coachAbout}
                alt="Coach Milos"
                width={430}
                height={538}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Meet Your Coach</p>
              <h2 className="font-display text-balance text-[clamp(2rem,4.5vw,2.75rem)] text-foreground">
                I&apos;m Milos. Father First. <span className="text-primary">Coach Second.</span>
              </h2>
              <p className="mt-5 text-[0.95rem] leading-8 text-[#ccc]">
                I spent 10 years as a competitive bodybuilder. I trained 4+ hours a day, ate from containers, and lived in the gym. Then I became a father — twice. And
                everything changed.
              </p>
              <p className="mt-4 text-[0.95rem] leading-8 text-[#ccc]">
                I realized the old way was dead. I couldn&apos;t train like a 22-year-old with zero responsibilities. So I rebuilt my entire approach from scratch:
                minimum time, maximum impact, zero compromise on results.
              </p>
              <p className="mt-4 text-[0.95rem] leading-8 text-[#ccc]">
                That system became Busy Strong 90. It&apos;s what I use myself. It&apos;s what I teach my clients. And it works — because it was built by someone
                who actually lives the life you&apos;re living.
              </p>
              <p className="mt-4 text-[0.95rem] font-medium leading-8 text-primary">
                Training is how I parent. My kids don&apos;t hear me talk about discipline — they see it. Every morning. That&apos;s the real reason I train. And
                that&apos;s what I want for you.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-8">
                {[
                  { v: "15+", l: "Years Training" },
                  { v: "10", l: "Years Competing" },
                  { v: "2", l: "Kids & Counting" },
                ].map((s) => (
                  <div key={s.l}>
                    <h3 className="font-display text-3xl text-primary">{s.v}</h3>
                    <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding border-t border-border/60 bg-card/30">
        <div className="container mx-auto max-w-[1100px] px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary">Real Results</p>
          <h2 className="font-display mt-2 text-balance text-center text-[clamp(2rem,5vw,3rem)] text-foreground">
            They Started Where <span className="text-primary">You Are Now</span>
          </h2>
          <p className="mx-auto mt-2 max-w-[560px] text-center text-pretty text-muted-foreground">
            Busy. Skeptical. One decision away from changing everything.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {testimonialVideos.map((t) => (
              <TestimonialVideoCard key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </section>


      {/* FAQ */}
      <section className="section-padding">
        <div className="container mx-auto max-w-[1100px] px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary">Questions</p>
          <h2 className="font-display mt-2 text-balance text-center text-[clamp(2rem,5vw,3rem)] text-foreground">
            Before You <span className="text-primary">Decide</span>
          </h2>
          <p className="mx-auto mt-2 max-w-[520px] text-center text-pretty text-muted-foreground">Every objection you have, someone else had too. Here&apos;s the truth.</p>
          <Accordion type="single" collapsible className="mx-auto mt-10 max-w-3xl w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`} className="border-border">
                <AccordionTrigger className="text-left text-base font-semibold hover:text-primary hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section id="apply" className="section-padding border-t border-border/50 pb-24 text-center">
        <div className="container mx-auto max-w-3xl px-6">
          <h2 className="font-display text-balance text-[clamp(2.2rem,6vw,3.5rem)] text-foreground">
            90 days. <span className="text-primary">Weight down. Energy back.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
            The training system, simple nutrition, and habits — built for busy fathers in Dubai who don&apos;t have time to waste.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild className="h-12 rounded-lg bg-primary px-8 text-base font-bold text-primary-foreground">
              <Link to="/pricing">Get the Program — {PRICING.selfGuided.label}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-lg border-border px-8 text-base font-semibold"
            >
              <a href={CALENDLY_FREE_CALL_URL} target="_blank" rel="noopener noreferrer">
                Book a Free Call
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
