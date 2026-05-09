import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PageMeta } from "@/components/seo/PageMeta";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export default function CoachingApplyPage() {
  const { toast } = useToast();
  const [age, setAge] = useState("");
  const [role, setRole] = useState("");
  const [fitness, setFitness] = useState("");
  const [minutes, setMinutes] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!age || !role || !fitness || !minutes) {
      toast({ title: "Please complete all fields", variant: "destructive" });
      return;
    }
    toast({
      title: "Application received",
      description: "Connect this form to your backend or email info@ptmilosilic.com.",
    });
  };

  return (
    <div className="font-sans">
      <PageMeta
        title="Apply for Coaching — Coach Milos"
        description="Apply to train with Coach Milos. Limited spots. Response within 24 hours."
        path="/coaching-apply"
      />
      <div className="mx-auto max-w-[680px] px-6 py-12 md:py-16">
        <Link
          to="/"
          className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Busy Strong 90
        </Link>

        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Application</p>
          <h1 className="font-display text-balance text-[clamp(2rem,5vw,3rem)] text-foreground">
            Apply to Train With <span className="text-primary">Coach Milos</span>
          </h1>
          <p className="mt-4 max-w-lg text-pretty text-[1.05rem] leading-relaxed text-muted-foreground">
            I work with a limited number of clients at a time so I can give each person the attention they deserve. Fill out this short application and I&apos;ll
            get back to you within 24 hours.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-7">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input className="h-11 border-border bg-[#111] text-foreground" placeholder="Your first name" required />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input className="h-11 border-border bg-[#111] text-foreground" placeholder="Your last name" required />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" className="h-11 border-border bg-[#111] text-foreground" placeholder="you@email.com" required />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp Number</Label>
              <Input type="tel" className="h-11 border-border bg-[#111] text-foreground" placeholder="+971 50 123 4567" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Where are you based?</Label>
            <Input className="h-11 border-border bg-[#111] text-foreground" placeholder="City, Country" />
          </div>

          <div className="h-px bg-border" aria-hidden />

          <div className="space-y-2">
            <Label>How old are you?</Label>
            <Select value={age} onValueChange={setAge}>
              <SelectTrigger className="h-11 border-border bg-[#111] text-foreground">
                <SelectValue placeholder="Select your age range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25-34">25–34</SelectItem>
                <SelectItem value="35-39">35–39</SelectItem>
                <SelectItem value="40-44">40–44</SelectItem>
                <SelectItem value="45-49">45–49</SelectItem>
                <SelectItem value="50+">50+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>What best describes you?</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="h-11 border-border bg-[#111] text-foreground">
                <SelectValue placeholder="Select one" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="founder">Business Owner / Founder</SelectItem>
                <SelectItem value="corporate">Corporate Professional</SelectItem>
                <SelectItem value="parent">Parent (stay-at-home or part-time)</SelectItem>
                <SelectItem value="freelance">Freelancer / Self-Employed</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>How would you describe your current fitness level?</Label>
            <RadioGroup value={fitness} onValueChange={setFitness} className="gap-2">
              {[
                { v: "scratch", t: "Haven't trained in 6+ months", s: "Starting from scratch — that's okay" },
                { v: "inconsistent", t: "Inconsistent — train sometimes but can't stick to it", s: "The most common answer. You're not alone." },
                { v: "no-results", t: "Training regularly but not seeing results", s: "Effort without a system. We fix that." },
                { v: "experienced", t: "Experienced — just need structure and accountability", s: "You know what to do, you need someone to keep you honest." },
              ].map((o) => (
                <div
                  key={o.v}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-[#111] p-4 transition-colors hover:border-primary/40",
                    fitness === o.v && "border-primary/50"
                  )}
                >
                  <RadioGroupItem value={o.v} id={`fit-${o.v}`} className="mt-1" />
                  <label htmlFor={`fit-${o.v}`} className="cursor-pointer text-left">
                    <span className="block text-sm text-foreground">{o.t}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{o.s}</span>
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>What&apos;s your #1 goal right now?</Label>
            <p className="text-xs text-muted-foreground">Be specific. &ldquo;Lose the gut and have energy to play with my kids&rdquo; is better than &ldquo;get fit.&rdquo;</p>
            <Textarea
              className="min-h-[100px] border-border bg-[#111] text-foreground"
              placeholder="Tell me what you want to change and why it matters to you..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label>What have you tried before? What didn&apos;t work?</Label>
            <p className="text-xs text-muted-foreground">This helps me understand what to do differently for you.</p>
            <Textarea
              className="min-h-[100px] border-border bg-[#111] text-foreground"
              placeholder="Gym memberships, personal trainers, apps, programs, diets..."
            />
          </div>

          <div className="h-px bg-border" aria-hidden />

          <div className="space-y-2">
            <Label>How many minutes per day can you realistically commit to training?</Label>
            <Select value={minutes} onValueChange={setMinutes}>
              <SelectTrigger className="h-11 border-border bg-[#111] text-foreground">
                <SelectValue placeholder="Be honest — I'll build around it" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20-30">20–30 minutes</SelectItem>
                <SelectItem value="30-40">30–40 minutes</SelectItem>
                <SelectItem value="40-60">40–60 minutes</SelectItem>
                <SelectItem value="less">Less than 20 minutes (we'll talk)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Anything else you want me to know?</Label>
            <p className="text-xs text-muted-foreground">Injuries, medical conditions, travel schedule, dietary restrictions — anything relevant.</p>
            <Textarea className="min-h-[100px] border-border bg-[#111] text-foreground" placeholder="Optional — but the more I know, the better I can help" />
          </div>

          <div className="pt-2" id="apply">
            <Button
              type="submit"
              className="h-12 w-full bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90 md:h-14"
            >
              Submit Application
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
              I review every application personally and respond within 24 hours. No spam. No auto-emails. Just me.
            </p>
          </div>
        </form>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 border-t border-border pt-8 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-primary" /> Limited spots
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-primary" /> No commitment until we talk
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-primary" /> 100% personalized
          </span>
        </div>
      </div>
    </div>
  );
}
