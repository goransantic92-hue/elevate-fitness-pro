import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type MemberAccess = Database["public"]["Tables"]["member_access"]["Row"];

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  memberAccess: MemberAccess | null;
  loading: boolean;
  configured: boolean;
  isAdmin: boolean;
  hasProgramAccess: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

async function fetchMemberAccess(userId: string) {
  const { data, error } = await supabase.from("member_access").select("*").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [memberAccess, setMemberAccess] = useState<MemberAccess | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const loadUserData = useCallback(async (userId: string) => {
    const [p, m] = await Promise.all([fetchProfile(userId), fetchMemberAccess(userId)]);
    setProfile(p);
    setMemberAccess(m);
  }, []);

  const refreshProfile = useCallback(async () => {
    const uid = session?.user?.id;
    if (!uid || !isSupabaseConfigured) return;
    await loadUserData(uid);
  }, [session?.user?.id, loadUserData]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (cancelled) return;
      setSession(s);
      if (s?.user) {
        loadUserData(s.user.id).finally(() => {
          if (!cancelled) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        setLoading(true);
        loadUserData(s.user.id).finally(() => setLoading(false));
      } else {
        setProfile(null);
        setMemberAccess(null);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [loadUserData]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) return { error: new Error("Supabase is not configured") };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? new Error(error.message) : null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured) return { error: new Error("Supabase is not configured") };
    const site = import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, "") || "";
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        // Never use window.location.origin here — dev on localhost would bake localhost into confirmation emails.
        // If unset, Supabase uses Dashboard → Authentication → Site URL (must be production, e.g. https://busystrong90.com).
        emailRedirectTo: site ? `${site}/auth/callback` : undefined,
      },
    });
    return { error: error ? new Error(error.message) : null };
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
    setProfile(null);
    setMemberAccess(null);
  }, []);

  const isAdmin = profile?.role === "admin";
  const hasProgramAccess = isAdmin || memberAccess?.has_access === true;

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      memberAccess,
      loading,
      configured: isSupabaseConfigured,
      isAdmin,
      hasProgramAccess,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [session, profile, memberAccess, loading, isAdmin, hasProgramAccess, signIn, signUp, signOut, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
