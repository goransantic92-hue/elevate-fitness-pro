import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { TestimonialVideoCard } from "@/components/TestimonialVideoCard";
import { HomeBlogSection } from "@/components/blog/HomeBlogSection";
import { resolveTestimonialsCms } from "@/lib/memberAppCms";
import { usePublishedTestimonials } from "@/hooks/usePublishedTestimonials";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import privateTrainerFitness from "@/assets/private-trainer-fitness.webp";
import coachAbout from "@/assets/coach-about.webp";
import { PageMeta } from "@/components/seo/PageMeta";
import { HandbooksLeadSection } from "@/components/HandbooksLeadSection";
import { CALENDLY_FREE_CALL_URL } from "@/lib/pricing";
import { usePricing } from "@/hooks/usePricing";
import { usePublishedHomepageCms } from "@/hooks/usePublishedHomepageCms";
import { usePublishedSiteCms } from "@/hooks/usePublishedSiteCms";
import {
  resolveHomepageCoach,
  resolveHomepageFinalCta,
  resolveHomepageHero,
  resolveHomepagePillars,
  resolveHomepageStats,
  resolveHomepageTiers,
  resolveHomepageWho,
  resolveSectionHeaders,
} from "@/lib/homepageCms";
import { resolveFaqCms } from "@/lib/siteCms";
import { applyPricingTokens } from "@/lib/pricingTokens";
import { homepageStorageUrl } from "@/lib/homepageMedia";

const whoCardKeys = [
  { key: "fathers", icon: "👨‍👧‍👦", featured: true },
  { key: "founders", icon: "💼" },
  { key: "professionals", icon: "🏢" },
] as const;

type FaqItem = { q: string; a: string };

const HomePage = () => {
  const { t } = useTranslation("home");
  const { t: tCommon } = useTranslation("common");
  const { t: tFaq } = useTranslation("faq");
  const pricing = usePricing();
  const { data: homepageCms } = usePublishedHomepageCms();
  const { data: faqCms } = usePublishedSiteCms("faq");
  const { data: testimonialsCms } = usePublishedTestimonials();
  const testimonialVideos = resolveTestimonialsCms(testimonialsCms ?? null);

  const hero = resolveHomepageHero(homepageCms?.hero, t, "Coach Milos — cable training in the gym");
  const coach = resolveHomepageCoach(homepageCms?.coach, t);
  const stats = resolveHomepageStats(homepageCms?.stats, t);
  const who = resolveHomepageWho(homepageCms?.who, t);
  const tiers = resolveHomepageTiers(homepageCms?.tiers, t);
  const pillars = resolveHomepagePillars(homepageCms?.pillars, t);
  const testimonialsHeaders = resolveSectionHeaders(homepageCms?.testimonials, t, "testimonials");
  const faqHeaders = resolveSectionHeaders(homepageCms?.faq, t, "faq");
  const finalCta = resolveHomepageFinalCta(homepageCms?.finalCta, t);
  const faqResolved = resolveFaqCms(faqCms ?? null, tFaq);
  const faqItems = faqResolved.items.map((item) => ({
    ...item,
    a: applyPricingTokens(item.a, pricing),
  }));

  const heroImage = homepageStorageUrl(hero.imagePath) ?? privateTrainerFitness;
  const coachImage = homepageStorageUrl(coach.imagePath) ?? coachAbout;
  const heroSubhead = applyPricingTokens(hero.subhead, pricing);
  const metaDescription = applyPricingTokens(t("meta.description"), pricing);

  return (
    <div className="font-sans">
      <PageMeta title={t("meta.title")} description={metaDescription} path="/" />

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
                  {hero.eyebrow}
                </span>
                <span className="block max-w-[22ch] text-balance">
                  {hero.headline}{" "}
                  <span className="text-primary">{hero.headlineEnergy}</span> {hero.headlineSuffix}
                </span>
              </h1>
              <p className="mt-6 max-w-[600px] text-pretty text-lg leading-relaxed text-[#ccc]">
                {heroSubhead}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Button asChild className="h-12 rounded-lg bg-primary px-8 text-base font-bold text-primary-foreground hover:bg-primary/90">
                  <Link to="/pricing">
                    {tCommon("cta.getProgramPrice", { price: pricing.selfGuided.label })}
                    <ArrowRight className="icon-directional ms-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-lg border-border bg-transparent px-8 text-base font-semibold hover:bg-transparent"
                >
                  <a href={CALENDLY_FREE_CALL_URL} target="_blank" rel="noopener noreferrer">
                    {tCommon("cta.bookFreeCall")}
                  </a>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                <a href="#coaching" className="underline decoration-border underline-offset-4 hover:text-primary">
                  {tCommon("cta.seeCoaching")}
                </a>
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {hero.pills.map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-tight text-primary"
                  >
                    {pill}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
                {hero.trust.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="md:col-span-5 lg:col-span-5">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[430px] overflow-hidden rounded-2xl border border-border/60 bg-secondary/20">
                <img
                  src={heroImage}
                  alt={hero.imageAlt}
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
            {stats.map((s) => (
              <div key={s.label}>
                <h3 className="font-display text-4xl text-primary md:text-5xl">{s.value}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who */}
      <section className="section-padding">
        <div className="container mx-auto max-w-[1100px] px-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">{who.eyebrow}</p>
          <h2 className="font-display text-balance text-[clamp(2rem,5vw,3rem)] text-foreground">
            {who.headline} <span className="text-primary">{who.headlineHighlight}</span> {who.headlineSuffix}
          </h2>
          <p className="mb-10 mt-4 max-w-[600px] text-pretty text-[1.05rem] leading-relaxed text-muted-foreground">
            {who.body}
          </p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {whoCardKeys.map((c) => (
              <div
                key={c.key}
                className={`group rounded-xl border bg-[hsl(0_0%_6.5%)] p-8 transition-colors ${
                  c.featured
                    ? "border-2 border-primary shadow-[0_0_32px_hsl(171_47%_50%_/_0.12)]"
                    : "border-border hover:border-primary/60"
                }`}
              >
                {c.featured && (
                  <div className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-primary">
                    {who.mostCommon}
                  </div>
                )}
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg text-xl"
                  style={{ background: "hsl(171 47% 50% / 0.12)" }}
                >
                  {c.icon}
                </div>
                <h4 className="font-sans text-base font-bold text-foreground">{who.cards[c.key].title}</h4>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{who.cards[c.key].text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section id="coaching" className="section-padding !pt-8 border-y border-border bg-[hsl(0_0%_6.5%)]">
        <div className="container mx-auto max-w-[1100px] px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary">{tiers.eyebrow}</p>
          <h2 className="font-display mt-2 text-balance text-center text-[clamp(2rem,5vw,3rem)] text-foreground">
            {tiers.headlinePrefix} <span className="text-primary">{tiers.headlineProgram}</span> {tiers.headlineMiddle}{" "}
            <span className="text-primary">{tiers.headlineCoach}</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[560px] text-center text-pretty text-muted-foreground">{tiers.subhead}</p>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col rounded-2xl border border-border bg-background p-8">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">{tiers.selfGuided.tier}</div>
              <h3 className="font-display mt-1 text-3xl">{tiers.selfGuided.name}</h3>
              <div className="mt-2 text-muted-foreground">
                <strong className="font-display text-4xl text-foreground">{pricing.selfGuided.label}</strong> {tCommon("misc.oneTime")}
              </div>
              <ul className="my-6 flex-1 list-none space-y-2.5 border-t border-border pt-4 text-sm text-[#ccc]">
                {tiers.selfGuided.benefits.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="font-bold text-primary">✓</span>
                    {x}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="h-11 w-full border-border font-semibold">
                <Link to="/pricing">{tiers.selfGuided.cta}</Link>
              </Button>
            </div>

            <div className="relative flex flex-col rounded-2xl border-2 border-primary bg-background p-8 shadow-[0_0_40px_hsl(171_47%_50%_/_0.1)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-primary-foreground">
                {tiers.coached.recommended}
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">{tiers.coached.recommendedNote}</p>
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">{tiers.coached.tier}</div>
              <h3 className="font-display mt-1 text-3xl">{tiers.coached.name}</h3>
              <div className="mt-2 text-muted-foreground">
                <strong className="font-display text-4xl text-foreground">{pricing.coachedStrong90.label}</strong> {tCommon("misc.perMonth")}
              </div>
              <ul className="my-6 flex-1 list-none space-y-2.5 border-t border-border/80 pt-4 text-sm text-[#ccc]">
                {tiers.coached.benefits.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="font-bold text-primary">✓</span>
                    {x}
                  </li>
                ))}
              </ul>
              <Button asChild className="h-11 w-full bg-primary font-bold text-primary-foreground hover:bg-primary/90">
                <Link to="/coaching-apply?plan=coached-strong-90#apply">{tiers.coached.cta}</Link>
              </Button>
            </div>

            <div className="flex flex-col rounded-2xl border border-border bg-background p-8">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">{tiers.elite.tier}</div>
              <h3 className="font-display mt-1 text-3xl">{tiers.elite.name}</h3>
              <div className="mt-2 text-muted-foreground">
                <strong className="font-display text-4xl text-foreground">{pricing.privateTransformation.label}</strong> {tCommon("misc.perMonth")}
              </div>
              <ul className="my-6 flex-1 list-none space-y-2.5 border-t border-border pt-4 text-sm text-[#ccc]">
                {tiers.elite.benefits.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="font-bold text-primary">✓</span>
                    {x}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="h-11 w-full border-border font-semibold">
                <Link to="/coaching-apply?plan=private-transformation#apply">{tiers.elite.cta}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <HandbooksLeadSection />

      {/* Pillars */}
      <section className="section-padding">
        <div className="container mx-auto max-w-[1100px] px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary">{pillars.eyebrow}</p>
          <h2 className="font-display mt-2 text-balance text-center text-[clamp(2rem,5vw,3rem)] text-foreground">
            {pillars.headlinePrefix} <span className="text-primary">{pillars.headlineBrand}</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[560px] text-center text-pretty text-[1.05rem] text-muted-foreground">{pillars.subhead}</p>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {pillars.items.map((p) => (
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
                src={coachImage}
                alt={coach.imageAlt}
                width={430}
                height={538}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">{coach.eyebrow}</p>
              <h2 className="font-display text-balance text-[clamp(2rem,4.5vw,2.75rem)] text-foreground">
                {coach.headline} <span className="text-primary">{coach.headlineHighlight}</span>
              </h2>
              {coach.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-4 text-[0.95rem] leading-8 text-[#ccc] first:mt-5">
                  {paragraph}
                </p>
              ))}
              <p className="mt-4 text-[0.95rem] font-medium leading-8 text-primary">{coach.highlight}</p>
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-8">
                {coach.stats.map((s) => (
                  <div key={s.label}>
                    <h3 className="font-display text-3xl text-primary">{s.value}</h3>
                    <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
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
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary">{testimonialsHeaders.eyebrow}</p>
          <h2 className="font-display mt-2 text-balance text-center text-[clamp(2rem,5vw,3rem)] text-foreground">
            {testimonialsHeaders.headline} <span className="text-primary">{testimonialsHeaders.headlineHighlight}</span>
          </h2>
          <p className="mx-auto mt-2 max-w-[560px] text-center text-pretty text-muted-foreground">{testimonialsHeaders.subhead}</p>
          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {testimonialVideos.map((item) => (
              <TestimonialVideoCard key={item.id} testimonial={item} />
            ))}
          </div>
        </div>
      </section>

      <HomeBlogSection />

      {/* FAQ */}
      <section className="section-padding">
        <div className="container mx-auto max-w-[1100px] px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary">{faqHeaders.eyebrow}</p>
          <h2 className="font-display mt-2 text-balance text-center text-[clamp(2rem,5vw,3rem)] text-foreground">
            {faqHeaders.headline} <span className="text-primary">{faqHeaders.headlineHighlight}</span>
          </h2>
          <p className="mx-auto mt-2 max-w-[520px] text-center text-pretty text-muted-foreground">{faqHeaders.subhead}</p>
          <Accordion type="single" collapsible className="mx-auto mt-10 max-w-3xl w-full">
            {faqItems.map((f, i) => (
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
            {finalCta.headline} <span className="text-primary">{finalCta.headlineHighlight}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">{finalCta.body}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild className="h-12 rounded-lg bg-primary px-8 text-base font-bold text-primary-foreground">
              <Link to="/pricing">{tCommon("cta.getProgramPrice", { price: pricing.selfGuided.label })}</Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-lg border-border px-8 text-base font-semibold">
              <a href={CALENDLY_FREE_CALL_URL} target="_blank" rel="noopener noreferrer">
                {tCommon("cta.bookFreeCall")}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
