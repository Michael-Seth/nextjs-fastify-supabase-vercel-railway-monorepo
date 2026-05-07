"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CheckCircle, Clock, ListTodo, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div><h1 className="text-2xl font-bold">Welcome back{user?.name ? `, ${user.name}` : ""}!</h1><p className="text-muted-foreground">Here&#39;s what&#39;s happening today.</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[{title:"Total Todos",icon:ListTodo,value:"0",trend:"+0%"},{title:"Completed",icon:CheckCircle,value:"0",trend:"+0%"},{title:"Pending",icon:Clock,value:"0",trend:"+0%"},{title:"Completion Rate",icon:TrendingUp,value:"0%",trend:"+0%"}].map(s=>(
              <Card key={s.title}><CardHeader className="flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">{s.title}</CardTitle><s.icon className="h-5 w-5 text-muted-foreground"/></CardHeader><CardContent><p className="text-3xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground mt-1">{s.trend} from last month</p></CardContent></Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
