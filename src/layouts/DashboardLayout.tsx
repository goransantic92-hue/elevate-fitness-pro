import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  Map,
  LineChart,
  Bell,
  User,
  LogOut,
  Shield,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/training", label: "Training", icon: Dumbbell },
  { to: "/dashboard/nutrition", label: "Nutrition", icon: Utensils },
  { to: "/dashboard/roadmap", label: "Roadmap", icon: Map },
  { to: "/dashboard/progress", label: "Progress", icon: LineChart },
  { to: "/dashboard/reminders", label: "Reminders", icon: Bell },
  { to: "/dashboard/profile", label: "Profile", icon: User },
];

export default function DashboardLayout() {
  const location = useLocation();
  const { signOut, isAdmin, user } = useAuth();

  return (
    <div className="relative min-h-screen bg-background flex">
      <div className="dashboard-bg" aria-hidden />
      <aside className="relative z-10 hidden md:flex w-64 shrink-0 flex-col border-r border-border/60 bg-card/50 backdrop-blur-xl">
        <div className="p-6 border-b border-border/60">
          <Link to="/dashboard" className="font-black text-lg tracking-tight inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
              <Dumbbell className="h-5 w-5 text-primary" />
            </span>
            <span>
              BUSY<span className="text-gradient">STRONG</span>90
            </span>
          </Link>
          <p className="text-xs text-muted-foreground mt-2 truncate">{user?.email}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
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
                {item.label}
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
              Coach / Admin
            </Link>
          )}
        </nav>
        <div className="p-3 border-t border-border/60 space-y-1">
          <Link to="/" className="block px-3 py-2 text-xs text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/60 transition-colors">
            ← Public site
          </Link>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between h-14 px-4 border-b border-border/60 bg-card/40 backdrop-blur-xl">
          <Link to="/dashboard" className="font-black text-sm tracking-tight">
            BUSY<span className="text-primary">STRONG</span>90
          </Link>
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            Sign out
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
