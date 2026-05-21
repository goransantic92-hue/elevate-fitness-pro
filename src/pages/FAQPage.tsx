import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "@/data/busyStrong90";
import { PageMeta } from "@/components/seo/PageMeta";

const FAQPage = () => {
  return (
    <div className="font-sans">
      <PageMeta
        title="Before You Decide — FAQ — BUSY STRONG 90"
        description="FAQ for busy fathers, founders & professionals 35+: quitting past programs, travel, hectic weeks, low energy, no food scale, kg + energy results, coaching vs self-guided."
        path="/faq"
      />
      <section className="pt-8 pb-12 md:pt-12 md:pb-16">
        <div className="container mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Questions</p>
          <h1 className="font-display mt-2 text-balance text-[clamp(2rem,5vw,3rem)] text-foreground">
            Before You <span className="text-primary">Decide</span>
          </h1>
          <p className="mt-3 text-pretty text-muted-foreground">
            Every objection you have, someone else had too. Here&apos;s the truth.
          </p>
        </div>
      </section>

      <section className="pb-20 md:pb-28 px-6">
        <div className="container mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
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
              <Link to="/coaching-apply?plan=coached-strong-90#apply">Apply for Coached Strong 90</Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-lg border-border px-8 text-base font-semibold">
              <Link to="/pricing">
                Get the €39 Program <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
