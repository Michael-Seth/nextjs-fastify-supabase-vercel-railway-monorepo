import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import type { AuthResponse } from "@/types/api";
import type { LoginValues, RegisterValues } from "@/lib/validators";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export const authKeys = { me: ["auth","me"] as const };

export function useMe() {
  const { accessToken } = useAuthStore();
  return useQuery({ queryKey: authKeys.me, queryFn: () => api.get<{user:AuthResponse["user"]}>("/auth/me").then(r=>r.data.user), enabled: !!accessToken });
}

export function useLogin() {
  const { setUser, setTokens } = useAuthStore();
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (b: LoginValues) => api.post<AuthResponse>("/auth/login", b).then(r=>r.data),
    onSuccess: (data) => {
      setUser(data.user); setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      qc.setQueryData(authKeys.me, data.user);
      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    },
  });
}

export function useRegister() {
  const { setUser, setTokens } = useAuthStore();
  const router = useRouter();
  return useMutation({
    mutationFn: (b: RegisterValues) => api.post<AuthResponse>("/auth/register", b).then(r=>r.data),
    onSuccess: (data) => { setUser(data.user); setTokens(data.tokens.accessToken, data.tokens.refreshToken); router.push("/dashboard"); },
  });
}

export function useLogout() {
  const { refreshToken, logout } = useAuthStore();
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => api.post("/auth/logout", { refreshToken }),
    onSettled: () => { logout(); qc.clear(); router.push("/login"); },
  });
}

export function useGoogleSignIn() {
  return useMutation({
    mutationFn: async () => {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${globalThis.location.origin}/auth/callback` },
      });
      if (error) throw new Error(error.message);
    },
  });
}
