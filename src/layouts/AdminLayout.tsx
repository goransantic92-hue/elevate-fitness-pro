import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, FileText, Bell, Dumbbell, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MEMBER_APP_LINK_LABEL } from "@/lib/memberAppLabels";

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/members", label: "Members", icon: Users },
  { to: "/admin/content", label: "Content", icon: FileText },
  { to: "/admin/reminders", label: "Reminders", icon: Bell },
  { to: "/admin/workouts", label: "Workouts", icon: Dumbbell },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r border-border bg-card/50">
        <div className="p-5 border-b border-border/60">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500">Coach</p>
          <p className="font-black text-lg">Admin</p>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {nav.map((item) => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
                  isActive ? "bg-amber-500/15 text-amber-400" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-border/60">
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              {MEMBER_APP_LINK_LABEL}
            </Link>
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
