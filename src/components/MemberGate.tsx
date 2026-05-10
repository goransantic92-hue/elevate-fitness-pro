import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { buildProgramCheckoutUrl } from "@/lib/stripeProgramCheckout";

export function MemberGate({ children }: { children: React.ReactNode }) {
  const { hasProgramAccess, loading, user } = useAuth();

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
            <CardTitle>Program access</CardTitle>
          </div>
          <CardDescription>
            Your account is active, but full program content unlocks after purchase. Use the button below to complete checkout on Stripe, or contact Coach Milos if you need help.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            className="bg-primary text-primary-foreground font-semibold"
            disabled={!user}
            onClick={() => {
              if (!user) return;
              try {
                window.location.href = buildProgramCheckoutUrl(user);
              } catch {
                window.location.href = "/pricing";
              }
            }}
          >
            Get the program
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Back to home</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
