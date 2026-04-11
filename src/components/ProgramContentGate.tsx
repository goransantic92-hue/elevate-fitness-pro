import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/**
 * Public Training / Nutrition pages: only members with program access (or admins).
 * Without Supabase env, pages stay open for local development.
 */
export function ProgramContentGate({ children }: { children: React.ReactNode }) {
  const { configured, hasProgramAccess, loading } = useAuth();

  if (!configured) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="h-9 w-9 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!hasProgramAccess) {
    return <Navigate to="/pricing" replace />;
  }

  return <>{children}</>;
}
