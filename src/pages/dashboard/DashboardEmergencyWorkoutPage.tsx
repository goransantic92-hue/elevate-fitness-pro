import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MemberGate } from "@/components/MemberGate";
import { Button } from "@/components/ui/button";
import { emergencyWorkouts } from "@/data/busyStrong90";
import { ArrowLeft } from "lucide-react";
import NotFound from "@/pages/NotFound";

const IDS = new Set(emergencyWorkouts.map((w) => w.id));

export default function DashboardEmergencyWorkoutPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("dashboard");

  if (!id || !IDS.has(id)) return <NotFound />;

  const w = emergencyWorkouts.find((x) => x.id === id)!;

  return (
    <MemberGate>
      <div className="max-w-3xl mx-auto space-y-8">
        <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground" asChild>
          <Link to="/dashboard/training">
            <ArrowLeft className="icon-directional h-4 w-4" />
            {t("training.allTraining")}
          </Link>
        </Button>

        <div className="glass-card overflow-hidden border-primary/20">
          <div className="bg-gradient-to-r from-primary/15 to-transparent p-6 border-b border-border/50">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <p className="text-xs font-bold text-primary tracking-widest">{t("training.emergencyBadge")}</p>
              <span className="text-xs font-bold bg-primary/15 text-primary px-2 py-0.5 rounded-md">{w.time}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black">{w.name}</h1>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{t("training.emergencyNoteDetail")}</p>
          </div>
          <div className="p-5 md:p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-border/50 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="pb-3 pr-3">{t("training.table.exercise")}</th>
                  <th className="pb-3 pr-3">{t("training.table.sets")}</th>
                  <th className="pb-3 pr-3">{t("training.table.reps")}</th>
                  <th className="pb-3">{t("training.table.rest")}</th>
                </tr>
              </thead>
              <tbody>
                {w.rows.map((r) => (
                  <tr key={r.exercise} className="border-b border-border/30">
                    <td className="py-3 pr-3 font-medium">{r.exercise}</td>
                    <td className="py-3 pr-3 text-muted-foreground">{r.sets}</td>
                    <td className="py-3 pr-3 text-muted-foreground">{r.reps}</td>
                    <td className="py-3 text-muted-foreground">{r.rest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MemberGate>
  );
}
