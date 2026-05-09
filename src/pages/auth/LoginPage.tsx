import { useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { PageMeta } from "@/components/seo/PageMeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { safeInternalPath } from "@/lib/safeRedirect";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { signIn, configured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const from = safeInternalPath(searchParams.get("redirect"), (location.state as { from?: string } | null)?.from, "/dashboard");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      return;
    }
    navigate(from, { replace: true });
  }

  return (
    <>
      <PageMeta
        title="Member login"
        description="Sign in to your BUSY STRONG 90 member dashboard — training, nutrition, and progress in one place."
        path="/login"
      />
      <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
        <div className="w-full max-w-md glass-card p-8 border-border/60">
          <h1 className="text-2xl font-black mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-6">Log in to your member dashboard.</p>
          {!configured && (
            <p className="text-xs text-amber-500 mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              Supabase env vars are missing. Add them to use real authentication.
            </p>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground font-bold" disabled={busy || !configured}>
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-6 text-center">
            No account?{" "}
            <Link to={`/signup?redirect=${encodeURIComponent(from)}`} className="text-primary font-semibold hover:underline">
              Create one
            </Link>
          </p>
          <p className="text-center mt-4">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
              ← Back to website
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
