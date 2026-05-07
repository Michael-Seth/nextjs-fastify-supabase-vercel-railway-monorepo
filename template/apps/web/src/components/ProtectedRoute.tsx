"use client";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

interface ProtectedRouteProps { children: React.ReactNode; requiredRole?: "admin" | "user" | "moderator"; }

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, accessToken } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    if (!accessToken) { router.push("/login"); return; }
    if (requiredRole && user?.role !== requiredRole && user?.role !== "admin") router.push("/dashboard");
  }, [accessToken, user, requiredRole, router]);
  if (!accessToken) return <div className="min-h-screen flex items-center justify-center"><Skeleton className="h-8 w-48" /></div>;
  return <>{children}</>;
}
