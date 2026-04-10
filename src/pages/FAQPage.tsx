import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "@/data/busyStrong90";
import { PageMeta } from "@/components/seo/PageMeta";

const FAQPage = () => {
  return (
    <div>
      <PageMeta
        title="FAQ — BUSY STRONG 90"
        description="Frequently asked questions about training frequency, travel, cardio, injuries, and macros — straight from the program manual."
        path="/faq"
      />
      <section className="py-28 md:py-36">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xs text-primary font-bold tracking-widest mb-4">FAQ</div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Got questions? Coach Milos has answers. Straight talk, no BS.
          </p>
        </div>
      </section>

      <section className="pb-20 md:pb-28 px-4">
        <div className="container mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="glass-card px-6 border-border/50 data-[state=open]:border-primary/30">
                <AccordionTrigger className="text-left font-semibold text-sm md:text-base py-5 hover:no-underline hover:text-primary">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-6">Still have questions? The full program includes everything you need to succeed.</p>
            <Link to="/pricing">
              <Button size="lg" className="bg-primary text-primary-foreground font-bold h-14 px-10 glow-green">
                Get BUSY STRONG 90 — €39 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
