import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "I missed a session — should I do two in one day?",
    a: "No. Never double up on sessions. If you miss Monday, do it Tuesday and shift the week by one day. Missing one session in 90 days will not derail your progress. Missing 20 sessions will.",
  },
  {
    q: "Can I do more than 3 sessions per week?",
    a: "In Phase 1 and 2 — no. Follow the plan. In Phase 3, you may add a light 30-min cardio session on Saturday if you feel strong and recovery is excellent. More is not always better. Recovery is where the growth happens.",
  },
  {
    q: "I don't see results after 2 weeks. Should I change the program?",
    a: "No. Two weeks is not enough time to evaluate any program. Most visible changes appear at week 4–6. Trust the process. The only thing you should evaluate at week 2 is your compliance.",
  },
  {
    q: "What if I can't do certain exercises due to injury?",
    a: "Always consult a physio for serious injuries. For minor issues: substitute push movements with push-ups or machine press, pull movements with lat pulldown or band rows, squat with leg press or split squat. Training around injuries intelligently is better than not training.",
  },
  {
    q: "How much cardio should I do?",
    a: "For fat loss: 10,000 steps per day is worth more than 30 minutes on a treadmill. Walk more. If you want dedicated cardio, add one 20-minute moderate session after a strength workout — never before.",
  },
  {
    q: "What if I travel for work?",
    a: "Use the HOME workout version. Use the 10-minute emergency workouts when time is truly impossible. Follow the Eat Anywhere Guide. You have zero valid excuses while traveling — the program is designed for exactly this.",
  },
  {
    q: "Do I need to count macros exactly?",
    a: "No. Use the hand method: a palm of protein, a fist of carbs, a cupped hand of vegetables, a thumb of fat per meal. That is approximately correct and 1000x more sustainable than obsessive tracking.",
  },
  {
    q: "Will I lose strength if I reduce to 3 days per week from more?",
    a: "In the first 2 weeks, possibly a small adaptation. After that, your strength will match or exceed previous levels because recovery is optimized. Many advanced trainees are overtrained — not undertrained.",
  },
];

const FAQPage = () => {
  return (
    <div>
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
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
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
