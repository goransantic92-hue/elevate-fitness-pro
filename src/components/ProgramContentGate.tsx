import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { localePath } from "@/i18n/localePaths";
import type { AppLanguage } from "@/i18n/constants";

/**
 * Public Training / Nutrition pages: only members with program access (or admins).
 * Without Supabase env, pages stay open for local development.
 */
export function ProgramContentGate({ children }: { children: React.ReactNode }) {
  const { configured, hasProgramAccess, loading } = useAuth();
  const { i18n } = useTranslation();
  const locale = (i18n.language?.split("-")[0] ?? "en") as AppLanguage;

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
    return <Navigate to={localePath("/pricing", locale)} replace />;
  }

  return <>{children}</>;
}
