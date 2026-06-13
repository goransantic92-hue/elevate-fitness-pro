import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useMemberDashboardCms } from "@/hooks/useMemberAppCms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { buildProgramCheckoutUrl } from "@/lib/stripeProgramCheckout";
import { PRICING_AED } from "@/lib/pricing";
import { trackInitiateCheckout } from "@/lib/metaPixel";

export function MemberGate({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation("dashboard");
  const { hasProgramAccess, loading, user } = useAuth();
  const { content: dashboardCms } = useMemberDashboardCms();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!hasProgramAccess) {
    return (
      <Card className="glass-card max-w-lg mx-auto border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <Lock className="h-5 w-5" />
            <CardTitle>{dashboardCms.gate.title}</CardTitle>
          </div>
          <CardDescription>{dashboardCms.gate.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            className="bg-primary text-primary-foreground font-semibold"
            disabled={!user}
            onClick={() => {
              if (!user) return;
              try {
                trackInitiateCheckout(PRICING_AED.selfGuided.amount, PRICING_AED.currency);
                window.location.href = buildProgramCheckoutUrl(user);
              } catch {
                window.location.href = "/pricing";
              }
            }}
          >
            {t("gate.getProgram")}
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">{t("gate.backHome")}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
