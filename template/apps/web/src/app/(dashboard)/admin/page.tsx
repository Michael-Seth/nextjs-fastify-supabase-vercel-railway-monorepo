"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Users, Key, Shield, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatNumber } from "@/lib/formatters";

export default function AdminPage() {
  const { data: stats, isLoading } = useQuery({ queryKey: ["admin","stats"], queryFn: () => api.get<{totalUsers:number;activeUsers:number;totalApiKeys:number;adminCount:number}>("/admin/stats").then(r=>r.data).catch(()=>({totalUsers:0,activeUsers:0,totalApiKeys:0,adminCount:0})) });
  const cards = [
    { title:"Total Users",   icon:Users,    value:stats?.totalUsers,   color:"text-blue-500"  },
    { title:"Active Users",  icon:Activity, value:stats?.activeUsers,  color:"text-green-500" },
    { title:"API Keys",      icon:Key,      value:stats?.totalApiKeys, color:"text-purple-500"},
    { title:"Admins",        icon:Shield,   value:stats?.adminCount,   color:"text-orange-500"},
  ];
  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout>
        <div className="space-y-6">
          <div><h1 className="text-2xl font-bold">Admin Dashboard</h1><p className="text-muted-foreground">Overview of your application</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map(({ title, icon: Icon, value, color }) => (
              <Card key={title}>
                <CardHeader className="flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle><Icon className={`h-5 w-5 ${color}`} /></CardHeader>
                <CardContent>{isLoading ? <Skeleton className="h-8 w-20" /> : <p className="text-3xl font-bold">{formatNumber(value??0)}</p>}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
