"use client";
import { createContext, useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import type { User } from "@/types/api";

interface AuthContextValue { user: User | null; isAuthenticated: boolean; isAdmin: boolean; logout: () => void; }
const AuthContext = createContext<AuthContextValue | null>(null);

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/reset-password"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated, isAdmin, accessToken } = useAuthStore();
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isPublic = PUBLIC_ROUTES.some(r => pathname.startsWith(r));
    if (!accessToken && !isPublic) router.push(`/login?redirect=${pathname}`);
  }, [accessToken, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: isAuthenticated(), isAdmin: isAdmin(), logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
