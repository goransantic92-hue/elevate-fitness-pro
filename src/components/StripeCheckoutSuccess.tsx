import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { trackPurchase } from "@/lib/metaPixel";

/**
 * After Stripe redirects to /dashboard?checkout=success&session_id=..., confirms payment server-side and refreshes access.
 */
export function StripeCheckoutSuccess() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { session, refreshProfile } = useAuth();
  const { toast } = useToast();
  const ran = useRef(false);

  useEffect(() => {
    const ok = searchParams.get("checkout") === "success";
    const sid = searchParams.get("session_id");
    const token = session?.access_token;

    if (!ok || !sid || !token) return;
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const r = await fetch("/api/stripe/verify-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionId: sid }),
        });
        const data = (await r.json().catch(() => ({}))) as {
          error?: string;
          ok?: boolean;
          value?: number;
          currency?: string;
        };

        const next = new URLSearchParams(searchParams);
        next.delete("checkout");
        next.delete("session_id");
        setSearchParams(next, { replace: true });

        if (!r.ok || !data.ok) {
          toast({
            title: "Could not confirm payment",
            description: data.error ?? "Try refreshing the page or contact support.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "You're in!",
          description: "Program access is unlocked. Welcome to BUSY STRONG 90.",
        });
        if (typeof data.value === "number" && data.currency) {
          trackPurchase(data.value, data.currency, sid);
        }
        await refreshProfile();
      } catch {
        toast({ title: "Confirmation failed", description: "Please refresh or contact support.", variant: "destructive" });
      }
    })();
  }, [searchParams, session?.access_token, setSearchParams, toast, refreshProfile]);

  return null;
}
