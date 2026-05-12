import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { safeInternalPath } from "@/lib/safeRedirect";

/**
 * Handles Supabase email confirmation / magic-link redirects (PKCE `?code=` or hash tokens).
 * Add this URL to Supabase → Authentication → URL Configuration → Redirect URLs, e.g.
 * https://busystrong90.com/auth/callback
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [msg, setMsg] = useState("Signing you in…");

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const code = searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            if (!cancelled) {
              setMsg("Link expired or invalid. Try logging in.");
              setTimeout(() => navigate("/login", { replace: true }), 2500);
            }
            return;
          }
        } else {
          await supabase.auth.getSession();
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        const next = safeInternalPath(searchParams.get("next"), searchParams.get("redirect"), "/dashboard");

        if (cancelled) return;
        if (session) {
          navigate(next, { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      } catch {
        if (!cancelled) navigate("/login", { replace: true });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <p className="text-muted-foreground text-sm">{msg}</p>
    </div>
  );
}
