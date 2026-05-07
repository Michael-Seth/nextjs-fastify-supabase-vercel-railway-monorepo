"use client";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/uiStore";
import { LayoutDashboard, Users, Settings, Key, ChevronLeft, ChevronRight, FileText } from "lucide-react";

const navItems: { href: string; label: string; icon: React.ElementType; adminOnly?: boolean }[] = [
  { href:"/dashboard",   label:"Dashboard", icon:LayoutDashboard },
  { href:"/dashboard/todos", label:"Todos",  icon:FileText },
  { href:"/admin",       label:"Admin",     icon:Users,  adminOnly:true },
  { href:"/admin/users", label:"Users",     icon:Users,  adminOnly:true },
  { href:"/api-keys",    label:"API Keys",  icon:Key },
  { href:"/settings",    label:"Settings",  icon:Settings },
];

export function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const pathname = usePathname();
  const items = navItems.filter(i => !i.adminOnly || isAdmin);
  return (
    <aside className={cn("relative flex flex-col bg-card border-r min-h-screen transition-all duration-300", sidebarOpen ? "w-64" : "w-16")}>
      <div className="flex items-center h-16 px-4 border-b">
        {sidebarOpen && <span className="font-bold text-lg truncate">MyApp</span>}
        <button onClick={toggleSidebar} className="ml-auto p-1 rounded hover:bg-muted">{sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}</button>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {items.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href as Route} className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors", pathname === href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
            <Icon className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="truncate">{label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
