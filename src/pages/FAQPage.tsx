import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageMeta } from "@/components/seo/PageMeta";
import { usePricing } from "@/hooks/usePricing";

type FaqItem = { q: string; a: string };

const FAQPage = () => {
  const { t } = useTranslation("faq");
  const pricing = usePricing();

  const faqItems = t("items", { returnObjects: true }) as FaqItem[];

  return (
    <div className="font-sans">
      <PageMeta title={t("meta.title")} description={t("meta.description")} path="/faq" />
      <section className="pt-8 pb-12 md:pt-12 md:pb-16">
        <div className="container mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{t("page.eyebrow")}</p>
          <h1 className="font-display mt-2 text-balance text-[clamp(2rem,5vw,3rem)] text-foreground">
            {t("page.headline")} <span className="text-primary">{t("page.headlineHighlight")}</span>
          </h1>
          <p className="mt-3 text-pretty text-muted-foreground">{t("page.subhead")}</p>
        </div>
      </section>

      <section className="pb-20 md:pb-28 px-6">
        <div className="container mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((faq, i) => (
              <AccordionItem key={faq.q} value={`faq-${i}`} className="border-border">
                <AccordionTrigger className="text-left text-base font-semibold hover:text-primary hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild className="h-12 rounded-lg bg-primary px-8 text-base font-bold text-primary-foreground">
              <Link to="/pricing">{t("cta.getProgram", { price: pricing.selfGuided.label })}</Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-lg border-border px-8 text-base font-semibold">
              <Link to="/coaching-apply?plan=coached-strong-90#apply">
                {t("cta.startCoaching")} <ArrowRight className="icon-directional ms-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
