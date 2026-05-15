"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { User } from "@/types/user";
import { supabase } from "@/lib/supabase";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchUser(authUser: SupabaseUser) {
    // auth 메타데이터로 즉시 세팅 — DB 조회 없이 로딩 해제
    setUser({
      id: authUser.id,
      email: authUser.email ?? "",
      nickname:
        (authUser.user_metadata?.nickname as string | undefined) ??
        authUser.email?.split("@")[0] ??
        "",
      profile_url: "",
      review_cnt: 0,
    });
    setIsLoading(false);

    // DB에서 nickname / profile_url / review_cnt 보강 (비동기)
    const { data: profile } = await supabase
      .from("user")
      .select("nickname, profile_url, review_cnt")
      .eq("id", authUser.id)
      .single();
    if (profile) {
      setUser((prev) => (prev ? { ...prev, ...profile } : null));
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUser(session.user);
      } else {
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
