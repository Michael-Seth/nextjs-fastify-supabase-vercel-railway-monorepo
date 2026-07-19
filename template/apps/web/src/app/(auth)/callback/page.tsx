"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { AuthResponse } from "@/types/api";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error || !session) {
        toast.error("Google sign-in failed. Please try again.");
        router.replace("/login");
        return;
      }

      try {
        const { data } = await api.post<AuthResponse>("/auth/google/callback", {
          accessToken: session.access_token,
        });
        setUser(data.user);
        setTokens(data.tokens.accessToken, data.tokens.refreshToken);
        router.replace(data.user.role === "admin" ? "/admin" : "/dashboard");
      } catch {
        toast.error("Failed to complete sign-in. Please try again.");
        router.replace("/login");
      }
    });
  }, [router, setUser, setTokens]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="text-sm text-muted-foreground">Completing sign-in…</p>
      </div>
    </div>
  );
}
