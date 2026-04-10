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
              className="glass-card p-6 md:p-8 bg-gradient-to-r from-primary/10 to-transparent border-primary/15 relative overflow-hidden"
            >
              <div className="absolute top-4 right-6 text-7xl font-black text-primary/5">{phase.number}</div>
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-xs text-primary font-bold tracking-widest">PHASE {phase.number}</span>
                  <span className="text-xs text-muted-foreground">{phase.weeks}</span>
                </div>
                <h2 className="text-2xl font-black mb-3">{phase.name}</h2>
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
