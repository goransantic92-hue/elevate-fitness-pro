import { MemberGate } from "@/components/MemberGate";
import { Check } from "lucide-react";
import { phases, weeklySchedule } from "@/data/busyStrong90";

export default function DashboardRoadmapPage() {
  return (
    <MemberGate>
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-black">90-day roadmap</h1>
          <p className="text-muted-foreground mt-2">
            Three 4-week phases. You do not jump phases. You do not skip weeks. Trust the process.
          </p>
        </div>

        <div className="space-y-6">
          {phases.map((phase) => (
            <div
              key={phase.number}
              className="glass-card p-5 sm:p-6 md:p-8 bg-gradient-to-r from-primary/10 to-transparent border-primary/15 relative min-w-0 rounded-2xl"
            >
              <div className="pointer-events-none absolute top-2 right-2 text-5xl leading-none font-black text-primary/5 sm:top-4 sm:right-5 sm:text-7xl md:right-6">
                {phase.number}
              </div>
              <div className="relative z-10 min-w-0 pr-10 sm:pr-14 md:pr-20">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                  <span className="text-xs text-primary font-bold tracking-widest">PHASE {phase.number}</span>
                  <span className="text-xs text-muted-foreground">{phase.weeks}</span>
                </div>
                <h2 className="text-xl font-black leading-tight tracking-tight break-words text-balance sm:text-2xl mb-3">{phase.name}</h2>
                <p className="text-muted-foreground leading-relaxed mb-4 max-w-2xl">{phase.description}</p>
                <div className="flex flex-wrap gap-2">
                  {phase.focus.map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full"
                    >
                      <Check className="h-3 w-3" /> {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-black mb-2">Weekly schedule</h2>
          <p className="text-sm text-muted-foreground mb-6">Same structure for all 12 weeks.</p>
          <div className="space-y-2">
            {weeklySchedule.map((d) => {
              const isTraining = d.session.startsWith("Training") || d.session === "10-Min Bonus";
              return (
                <div
                  key={d.day}
                  className={`glass-card p-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-6 ${isTraining ? "border-primary/20" : ""}`}
                >
                  <div className="w-28 shrink-0">
                    <span className={`font-bold text-sm ${isTraining ? "text-primary" : "text-muted-foreground"}`}>{d.day}</span>
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-sm">{d.session}</span>
                    <span className="text-muted-foreground text-sm ml-2">— {d.focus}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{d.duration}</div>
                  <div className="text-xs text-muted-foreground italic md:max-w-[220px]">{d.note}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MemberGate>
  );
}
