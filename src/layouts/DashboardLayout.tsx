import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { StripeCheckoutSuccess } from "@/components/StripeCheckoutSuccess";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  Map,
  LineChart,
  User,
  LogOut,
  Shield,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navKeys = [
  { to: "/dashboard", key: "overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/training", key: "training", icon: Dumbbell },
  { to: "/dashboard/nutrition", key: "nutrition", icon: Utensils },
  { to: "/dashboard/roadmap", key: "roadmap", icon: Map },
  { to: "/dashboard/progress", key: "progress", icon: LineChart },
  { to: "/dashboard/profile", key: "profile", icon: User },
] as const;

export default function DashboardLayout() {
  const location = useLocation();
  const { signOut, isAdmin, user } = useAuth();
  const { t } = useTranslation("dashboard");

  return (
    <div className="relative min-h-screen bg-background flex">
      <div className="dashboard-bg" aria-hidden />
      <aside className="relative z-10 hidden md:flex w-64 shrink-0 flex-col border-r border-border/60 bg-card/50 backdrop-blur-xl">
        <div className="p-6 border-b border-border/60">
          <div className="flex items-start justify-between gap-2">
            <Link to="/dashboard" className="font-black text-lg tracking-tight inline-flex items-center gap-2 min-w-0">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 border border-primary/25 shrink-0">
                <Dumbbell className="h-5 w-5 text-primary" />
              </span>
              <span>
                BUSY<span className="text-gradient">STRONG</span>90
              </span>
            </Link>
            <LanguageSwitcher size="icon" />
          </div>
          <p className="text-xs text-muted-foreground mt-2 truncate">{user?.email}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navKeys.map((item) => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/15 text-primary shadow-[0_0_24px_hsl(110_100%_55%/0.12)] border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-transparent"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {t(`nav.${item.key}`)}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border border-transparent",
                location.pathname.startsWith("/admin") ? "bg-amber-500/15 text-amber-400 border-amber-500/20" : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              )}
            >
              <Shield className="h-4 w-4 shrink-0" />
              {t("nav.coachAdmin")}
            </Link>
          )}
        </nav>
        <div className="p-3 border-t border-border/60 space-y-1">
          <Link to="/" className="block px-3 py-2 text-xs text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/60 transition-colors">
            {t("nav.publicSite")}
          </Link>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" />
            {t("nav.signOut")}
          </Button>
        </div>
      </aside>

      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between h-14 px-4 border-b border-border/60 bg-card/40 backdrop-blur-xl">
          <Link to="/dashboard" className="font-black text-sm tracking-tight">
            BUSY<span className="text-primary">STRONG</span>90
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher size="icon" />
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              {t("nav.signOut")}
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-auto">
          <StripeCheckoutSuccess />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
