import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Check, Star } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import coachHero from "@/assets/coach-hero.jpg";
import coachAbout from "@/assets/coach-about.jpg";
import { PageMeta } from "@/components/seo/PageMeta";
import { faqs } from "@/data/busyStrong90";

const whoCards = [
  { icon: "💼", title: "Founders & Business Owners", text: "You're building something. Early mornings, late nights, back-to-back calls. Your body is the one thing holding everything else up — and you've been neglecting it. This program fits between meetings, not instead of them." },
  { icon: "👨‍👧‍👦", title: "Busy Parents", text: "Your kids watch everything you do. When you train, they learn that discipline isn't something you talk about — it's something you live. 30 minutes, 3× a week, at home. While they're sleeping or playing." },
  { icon: "🏢", title: "Corporate Professionals", text: "You've been saying \"I'll start Monday\" for months. The gym membership you never use. The energy crash at 2pm. This system requires no commute, no equipment, and no willpower — just a decision to start." },
] as const;

const leadChecklist = [
  "12 structured training sessions (no gym, no equipment)",
  "Simple nutrition framework — no calorie counting",
  "The \"Parent Fit\" daily habit checklist",
  "Direct access to Coach Milos via email",
] as const;

const pillars = [
  { num: "01", title: "Train Smart", text: "3× per week. 30–40 minutes. Progressive overload. Compound movements that build real strength. No junk volume. Every rep has a purpose — because your time has a price tag." },
  { num: "02", title: "Eat Simply", text: "No app needed. No food scale. One rule: protein at every meal. The rest follows naturally. Built for people who eat with their family, travel for work, and don't have time to meal prep 6 containers on Sunday." },
  { num: "03", title: "Build Systems", text: "Motivation is unreliable. Systems are not. You build habits so automatic that missing a session feels wrong — the same way forgetting to brush your teeth would. That's the real transformation." },
] as const;

const testimonials = [
  { tag: "Lost 8kg in 90 Days", quote: "I come home differently now and my kids notice. I have energy to play with them after work instead of collapsing on the couch. My wife says I'm a different person.", initials: "DM", name: "David M.", sub: "Project Manager, 42 — Father of 3" },
  { tag: "3 Sessions / Week — Never Missed", quote: "Three sessions I can actually protect on my calendar — stronger without living in the gym. I've tried 5 programs before this. This is the first one I actually finished.", initials: "ER", name: "Elena R.", sub: "Founder, 38 — Mother of 2" },
  { tag: "Down 2 Waist Sizes", quote: "I stopped overthinking meals. Protein, consistency, and the plan did the rest. Dropped 2 waist sizes, sleep better, and my team says I show up sharper in meetings.", initials: "MV", name: "Marcus V.", sub: "Corporate Lead, 45 — Father of 1" },
] as const;

const HomePage = () => {
  const { toast } = useToast();
  const [emailLead, setEmailLead] = useState("");

  const onLeadSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!emailLead.trim()) {
      toast({ title: "Enter your email", variant: "destructive" });
      return;
    }
    toast({ title: "You’re on the list", description: "We’ll send the Busy Strong 30 starter plan when email delivery is connected." });
    setEmailLead("");
  };

  return (
    <div className="font-sans">
      <PageMeta
        title="BUSY STRONG 90 — By Coach Milos"
        description="The complete training system for fathers, founders, and busy professionals over 35. 3× per week, 30–40 minutes, gym or home. No excuses."
        path="/"
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-10 md:pb-24">
        <div
          className="pointer-events-none absolute -right-[20%] -top-1/2 h-[min(90vw,800px)] w-[min(90vw,800px)] rounded-full bg-[hsl(171_47%_50%/0.12)] blur-3xl"
          aria-hidden
        />
        <div className="container relative z-[1] mx-auto max-w-[1100px] px-6">
          <div className="mb-8 flex flex-col gap-8 md:flex-row md:items-center">
            <div className="relative min-h-[220px] w-full max-w-md shrink-0 overflow-hidden rounded-2xl border border-border/60 md:max-w-sm">
              <img src={coachHero} alt="Coach Milos — training" className="h-56 w-full object-cover object-top md:h-72" />
            </div>
            <div className="min-w-0 max-w-2xl flex-1">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                Launch Price — Ends May 15th
              </div>
              <h1 className="font-display text-[clamp(2.5rem,7vw,4.25rem)] text-foreground">
                <span className="mb-3 block font-sans text-lg font-normal normal-case leading-snug tracking-normal text-muted-foreground md:text-xl">
                  You haven&apos;t trained in months. You&apos;re tired. Your kids see it.
                </span>
                <span className="block text-balance">
                  GET <span className="text-primary">STRONG</span> IN 90 DAYS. NO GYM. NO EXCUSES.
                </span>
              </h1>
              <p className="mt-6 max-w-[560px] text-pretty text-lg leading-relaxed text-[#ccc]">
                The complete training system built for fathers, founders, and busy professionals over 35 who refuse to let fitness slide — but only have 30
                minutes a day.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Button asChild className="h-12 rounded-lg bg-primary px-8 text-base font-bold text-primary-foreground hover:bg-primary/90">
                  <Link to="/coaching-apply">
                    Apply for 1-on-1 Coaching
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-lg border-border bg-transparent px-8 text-base font-semibold text-foreground hover:border-primary hover:bg-transparent hover:text-primary"
                >
                  <a href="#free">Get the Free 30-Day Starter Plan</a>
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  No gym required
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  30–40 min sessions
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  Built by a competitive bodybuilder &amp; father of 2
                </span>
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
            This Is For People Who <span className="text-primary">Don&apos;t Have Time</span> — And Know That&apos;s Not An Excuse
          </h2>
          <p className="mb-10 mt-4 max-w-[600px] text-pretty text-[1.05rem] leading-relaxed text-muted-foreground">
            You run a company, raise kids, manage a career. You don&apos;t need another fitness influencer telling you to &quot;just be consistent.&quot; You need
            a system that fits inside the life you already have.
          </p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {whoCards.map((c) => (
              <div
                key={c.title}
                className="group rounded-xl border border-border bg-[hsl(0_0%_6.5%)] p-8 transition-colors hover:border-primary/60"
              >
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

      {/* Lead magnet */}
      <section id="free" className="section-padding !pt-8">
        <div className="container mx-auto max-w-[1100px] px-6">
          <div
            className="flex flex-col items-stretch gap-8 rounded-2xl border border-primary/25 p-8 md:flex-row md:items-center md:gap-12 md:p-12"
            style={{ background: "linear-gradient(135deg, hsl(171 47% 50% / 0.08) 0%, hsl(171 47% 50% / 0.02) 100%)" }}
          >
            <div className="min-w-0 flex-1">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Free Download</p>
              <h2 className="font-display text-balance text-[clamp(1.8rem,4vw,2.5rem)] text-foreground">
                Not Ready To Commit? Start With <span className="text-primary">30 Days Free.</span>
              </h2>
              <p className="mt-4 text-[#ccc] leading-relaxed">
                Get the Busy Strong 30 — a complete 30-day starter program with training sessions, a nutrition checklist, and the daily habit system that
                Coach Milos uses with his private clients.
              </p>
              <ul className="my-6 list-none space-y-2 text-[0.95rem] text-[#ccc]">
                {leadChecklist.map((x) => (
                  <li key={x} className="pl-0">
                    <span className="mr-2.5 font-bold text-primary">✓</span>
                    {x}
                  </li>
                ))}
              </ul>
              <form onSubmit={onLeadSubmit} className="flex max-w-lg flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="h-12 min-w-[220px] flex-1 rounded-lg border-border bg-[#111] text-foreground"
                  value={emailLead}
                  onChange={(e) => setEmailLead(e.target.value)}
                />
                <Button
                  type="submit"
                  className="h-12 shrink-0 rounded-lg bg-primary px-6 font-bold text-primary-foreground hover:bg-primary/90"
                >
                  Send Me the Plan
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </form>
            </div>
            <div className="font-display flex h-44 w-full shrink-0 flex-col items-center justify-center rounded-xl border border-border bg-[#111] p-5 text-center text-xl text-primary md:h-[280px] md:w-[220px]">
              BUSY
              <br />
              STRONG
              <br />
              30
              <span className="mt-2 font-sans text-[0.6rem] font-medium uppercase tracking-wide text-muted-foreground">Free starter plan</span>
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
            <div className="overflow-hidden rounded-2xl border border-border">
              <img src={coachAbout} alt="Coach Milos" className="aspect-[4/5] w-full object-cover object-top" />
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
          <p className="mx-auto mt-2 max-w-[560px] text-center text-pretty text-muted-foreground">Busy. Skeptical. One decision away from changing everything.</p>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl border border-border bg-[#111] p-8">
                <div className="mb-3 flex text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <div className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-primary">
                  {t.tag}
                </div>
                <blockquote className="text-sm italic leading-relaxed text-[#ccc]">&ldquo;{t.quote}&rdquo;</blockquote>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-sm font-bold text-primary">{t.initials}</div>
                  <div>
                    <h5 className="font-sans text-sm font-bold text-foreground">{t.name}</h5>
                    <p className="text-xs text-muted-foreground">{t.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section id="coaching" className="section-padding border-y border-border bg-[hsl(0_0%_6.5%)]">
        <div className="container mx-auto max-w-[1100px] px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary">Choose Your Path</p>
          <h2 className="font-display mt-2 text-balance text-center text-[clamp(2rem,5vw,3rem)] text-foreground">
            The <span className="text-primary">Program</span> or The <span className="text-primary">Coach</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[560px] text-center text-pretty text-muted-foreground">
            The self-guided program gets you strong. The coaching gets you there faster, with accountability and a custom plan built around your life.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col rounded-2xl border border-border bg-background p-8">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">Self-Guided</div>
              <h3 className="font-display mt-1 text-3xl">Busy Strong 90</h3>
              <div className="mt-2 text-muted-foreground">
                <strong className="font-display text-4xl text-foreground">€39</strong> one-time
              </div>
              <ul className="my-6 flex-1 list-none space-y-2.5 border-t border-border pt-4 text-sm text-[#ccc]">
                {["Full 90-day program (36 sessions)", "Exercise video library", "Nutrition framework guide", "Habit-building system", "Email support"].map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="font-bold text-primary">✓</span>
                    {x}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="h-11 w-full border-border font-semibold text-foreground hover:border-primary hover:text-primary">
                <Link to="/pricing">Get the Program</Link>
              </Button>
            </div>

            <div className="relative flex flex-col rounded-2xl border-2 border-primary bg-background p-8 shadow-[0_0_40px_hsl(171_47%_50%_/_0.1)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-primary-foreground">
                Most Popular
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">Core Coaching</div>
              <h3 className="font-display mt-1 text-3xl">Coached Strong 90</h3>
              <div className="mt-2 text-muted-foreground">
                <strong className="font-display text-4xl text-foreground">€299</strong> / month
              </div>
              <ul className="my-6 flex-1 list-none space-y-2.5 border-t border-border/80 pt-4 text-sm text-[#ccc]">
                {[
                  "Everything in Self-Guided",
                  "Custom training plan for your schedule",
                  "Weekly check-ins with Coach Milos",
                  "Nutrition plan adapted to your lifestyle",
                  "WhatsApp accountability group",
                  "Form checks via video",
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="font-bold text-primary">✓</span>
                    {x}
                  </li>
                ))}
              </ul>
              <Button asChild className="h-11 w-full bg-primary font-bold text-primary-foreground hover:bg-primary/90">
                <Link to="/coaching-apply#apply">Apply Now</Link>
              </Button>
            </div>

            <div className="flex flex-col rounded-2xl border border-border bg-background p-8">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">Elite</div>
              <h3 className="font-display mt-1 text-3xl">Private Transformation</h3>
              <div className="mt-2 text-muted-foreground">
                <strong className="font-display text-4xl text-foreground">€699</strong> / month
              </div>
              <ul className="my-6 flex-1 list-none space-y-2.5 border-t border-border pt-4 text-sm text-[#ccc]">
                {[
                  "Everything in Core Coaching",
                  "1-on-1 calls with Coach Milos (2×/month)",
                  "Fully custom program — rebuilt monthly",
                  "Direct WhatsApp access to Milos",
                  "Priority response (under 4 hours)",
                  "Quarterly progress photoshoot plan",
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="font-bold text-primary">✓</span>
                    {x}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="h-11 w-full border-border font-semibold text-foreground hover:border-primary hover:text-primary">
                <Link to="/coaching-apply#apply">Apply for Elite</Link>
              </Button>
            </div>
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
            90 Days. 36 Sessions. <span className="text-primary">One Decision: Start.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">The program. The nutrition framework. The habit system. Everything you need. The only thing standing between you and the body you want is starting.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild className="h-12 rounded-lg bg-primary px-8 text-base font-bold text-primary-foreground">
              <Link to="/coaching-apply#apply">Apply for Coaching</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-lg border-border px-8 text-base font-semibold text-foreground hover:border-primary hover:text-primary"
            >
              <Link to="/pricing">Get the €39 Program</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
