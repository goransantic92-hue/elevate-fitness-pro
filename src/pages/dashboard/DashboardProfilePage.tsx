import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function DashboardProfilePage() {
  const { t } = useTranslation("dashboard");
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name ?? "");
  }, [profile?.full_name]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName || null }).eq("id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: t("profile.toastSaveFailed"), description: error.message, variant: "destructive" });
      return;
    }
    await refreshProfile();
    toast({ title: t("profile.toastUpdated") });
  }

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black">{t("profile.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("profile.subhead")}</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">{t("profile.account")}</CardTitle>
          <CardDescription>{t("profile.signedInAs", { email: user?.email ?? "" })}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("profile.displayName")}</Label>
              <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
            </div>
            <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground font-semibold">
              {saving ? t("profile.saving") : t("profile.saveChanges")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
