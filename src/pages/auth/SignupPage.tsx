import { useState } from "react";
import { Link } from "react-router-dom";
import { PageMeta } from "@/components/seo/PageMeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const { signUp, configured } = useAuth();
  const { toast } = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await signUp(email, password, fullName);
    setBusy(false);
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
    toast({ title: "Check your email", description: "Confirm your address if required by your Supabase project settings." });
  }

  return (
    <>
      <PageMeta
        title="Create account"
        description="Create your BUSY STRONG 90 account to access the member dashboard when your program is unlocked."
        path="/signup"
      />
      <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
        <div className="w-full max-w-md glass-card p-8 border-border/60">
          <h1 className="text-2xl font-black mb-1">Create account</h1>
          <p className="text-sm text-muted-foreground mb-6">One account for the full digital program experience.</p>
          {!configured && (
            <p className="text-xs text-amber-500 mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              Supabase env vars are missing. Add them before signing up.
            </p>
          )}
          {done ? (
            <p className="text-sm text-muted-foreground">
              If email confirmation is enabled in Supabase, check your inbox. Then{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                sign in
              </Link>
              .
            </p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required autoComplete="name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground font-bold" disabled={busy || !configured}>
                {busy ? "Creating…" : "Create account"}
              </Button>
            </form>
          )}
          <p className="text-sm text-muted-foreground mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
