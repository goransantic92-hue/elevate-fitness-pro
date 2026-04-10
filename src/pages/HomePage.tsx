import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Calendar, Timer, Users, Dumbbell, Utensils, Target, ChevronRight, Quote } from "lucide-react";
import coachHero from "@/assets/coach-hero.jpg";
import coachAbout from "@/assets/coach-about.jpg";
import { PageMeta } from "@/components/seo/PageMeta";

const stats = [
  { value: "3x", label: "Per Week", icon: Calendar },
  { value: "90", label: "Days", icon: Target },
  { value: "30-40", label: "Min / Session", icon: Timer },
  { value: "35+", label: "Age Group", icon: Users },
];

const pillars = [
  {
    icon: Dumbbell,
    title: "Train Smart",
    description: "3x per week. 30–40 minutes. Progressive overload. Compound movements first. No junk volume. Every rep has a purpose.",
  },
  {
    icon: Utensils,
    title: "Eat Simply",
    description: "No app needed. No food scale required. One rule: protein at every meal. The rest follows naturally.",
  },
  {
    icon: Target,
    title: "Build Systems",
    description: "Motivation is unreliable. Systems are not. You will build habits so automatic that missing a session feels wrong.",
  },
];

const HomePage = () => {
  return (
    <div>
      <PageMeta
        title="BUSY STRONG 90 — Get strong. Stay busy."
        description="The complete 90-day training system for busy professionals, parents, and entrepreneurs 35+. 3× per week, 30–40 minutes, gym & home programs, nutrition framework, and habits — by Coach Milos."
        path="/"
      />
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={coachHero} alt="Coach Milos demonstrating fitness" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Launch Price — Limited Time
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] mb-6">
              GET <span className="text-gradient">STRONG</span><br />
              STAY <span className="text-gradient">BUSY</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4 max-w-lg">
              The complete 90-day training system for busy professionals, parents, and entrepreneurs 35+.
            </p>
            <p className="text-sm text-muted-foreground mb-8 italic">
              "You don't need to suffer more. You need to suffer smarter." — Coach Milos
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/pricing">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-8 h-14 glow-green">
                  Start Your Transformation — €39
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/program">
                <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary h-14 px-8">
                  Explore the Program
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-16 z-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card p-6 text-center glow-green">
                <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="text-3xl md:text-4xl font-black text-primary">{stat.value}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who is this for */}
      <section className="section-padding">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            Built For People Who <span className="text-gradient">Don't Have Time</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Most fitness programs are built for people with unlimited time, no responsibilities, and obsessive motivation. That is not you. You run a business, raise kids, manage a career — and you still want to look and feel strong.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {["Entrepreneurs & Business Owners", "Busy Parents", "Corporate Professionals"].map((who) => (
              <div key={who} className="glass-card p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <ChevronRight className="h-5 w-5 text-primary" />
                </div>
                <span className="font-semibold">{who}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Pillars */}
      <section className="section-padding bg-card/50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Three Pillars of <span className="text-gradient">BUSY STRONG 90</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">The minimum effective dose. Not the maximum you can possibly do — the minimum that produces maximum results.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar, i) => (
              <div key={pillar.title} className="glass-card p-8 group hover:border-primary/30 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <pillar.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="text-xs text-primary font-bold tracking-widest mb-2">PILLAR {i + 1}</div>
                <h3 className="text-xl font-bold mb-3">{pillar.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coach Section */}
      <section className="section-padding">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img src={coachAbout} alt="Coach Milos" className="rounded-2xl w-full object-cover aspect-[3/4] glow-green" />
              <div className="absolute bottom-4 left-4 right-4 glass-card p-4">
                <p className="font-bold text-sm">Coach Milos</p>
                <p className="text-xs text-muted-foreground">@_coachmilos · Fitness Coach & Creator</p>
              </div>
            </div>
            <div>
              <div className="text-xs text-primary font-bold tracking-widest mb-3">MEET YOUR COACH</div>
              <h2 className="text-3xl md:text-4xl font-black mb-6">
                This Is Not a Fitness Plan.<br /><span className="text-gradient">It Is a System.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                BUSY STRONG 90 operates on one core principle: the minimum effective dose. Science is clear — 3 well-structured training sessions per week is enough to build significant muscle and lose significant fat when combined with proper nutrition and recovery.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                This program works if you do the work. The manual is complete. The system is proven. The only variable is you. You have 90 days. That is 12 weeks. That is 36 training sessions. Let's make every one count.
              </p>
              <Link to="/program">
                <Button className="bg-primary text-primary-foreground font-semibold">
                  See Full Program <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials — placeholders until real stories are collected */}
      <section className="section-padding bg-card/50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Success <span className="text-gradient">Stories</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Placeholder cards for future client testimonials and before/after highlights. Only publish quotes you have permission to use.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Member story 1", "Member story 2", "Member story 3"].map((label) => (
              <div key={label} className="glass-card p-8 border-dashed border-border/80 flex flex-col items-center text-center">
                <Quote className="h-8 w-8 text-primary/40 mb-4" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Add a short testimonial here with name, age range, and role (e.g. entrepreneur, parent). Pair with progress photos when available.
                </p>
                <span className="text-xs font-bold uppercase tracking-wider text-primary/70">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            90 Days. 36 Sessions.<br /><span className="text-gradient">One Decision: Start.</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            The program. The nutrition framework. The habit system. Everything you need. The only thing standing between you and the body you want is starting.
          </p>
          <Link to="/pricing">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-10 h-14 glow-green animate-pulse-glow">
              Get Started Now — €39
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
