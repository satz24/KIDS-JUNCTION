"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    const client = supabase;
    if (!client) {
      setLoading(false);
      return;
    }

    let active = true;

    const syncSession = async () => {
      const { data: refreshed } = await client.auth.refreshSession();
      if (!active) return;

      const session = refreshed.session ?? (await client.auth.getSession()).data.session;
      setUser(session?.user ?? null);
      setLoading(false);
    };

    void syncSession();

    const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, loading, isConfigured: isSupabaseConfigured };
}

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, isConfigured } = useAdminAuth();

  useEffect(() => {
    if (loading) return;
    if (!isConfigured) return;
    if (!user) router.replace("/admin/login");
  }, [user, loading, isConfigured, router]);

  if (!isConfigured) {
    return (
      <div className="p-8 max-w-lg">
        <h1 className="text-xl font-bold mb-2">Supabase not configured</h1>
        <p className="text-muted-foreground text-sm">
          Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground animate-pulse">Checking admin session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground animate-pulse">Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
