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
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-card/40 backdrop-blur-xl">
        <div className="p-6 border-b border-border/60">
          <Link to="/dashboard" className="font-black text-lg tracking-tight">
            BUSY<span className="text-primary">STRONG</span>90
          </Link>
          <p className="text-xs text-muted-foreground mt-1 truncate">{user?.email}</p>
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
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
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
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                location.pathname.startsWith("/admin") ? "bg-amber-500/15 text-amber-400" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Shield className="h-4 w-4 shrink-0" />
              Coach / Admin
            </Link>
          )}
        </nav>
        <div className="p-3 border-t border-border/60 space-y-1">
          <Link to="/" className="block px-3 py-2 text-xs text-muted-foreground hover:text-foreground">
            ← Public site
          </Link>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between h-14 px-4 border-b border-border bg-card/60 backdrop-blur-xl">
          <Link to="/dashboard" className="font-bold text-sm">
            Member
          </Link>
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            Out
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
