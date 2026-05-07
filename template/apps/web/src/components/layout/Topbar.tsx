"use client";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useAuthQuery";
import { useUIStore } from "@/stores/uiStore";
import { Button } from "@/components/ui/Button";
import { Menu, Sun, Moon, Bell, LogOut, User } from "lucide-react";
import { initials } from "@/lib/formatters";
import { useState } from "react";

export function Topbar() {
  const { user } = useAuth();
  const { mutate: logout } = useLogout();
  const { toggleSidebar, toggleTheme, theme } = useUIStore();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="h-16 border-b bg-card flex items-center px-4 gap-4 sticky top-0 z-30">
      <button onClick={toggleSidebar} className="p-2 rounded hover:bg-muted"><Menu className="h-5 w-5" /></button>
      <div className="flex-1" />
      <button onClick={toggleTheme} className="p-2 rounded hover:bg-muted">{theme==="dark"?<Sun className="h-5 w-5"/>:<Moon className="h-5 w-5"/>}</button>
      <button className="p-2 rounded hover:bg-muted relative"><Bell className="h-5 w-5" /></button>
      <div className="relative">
        <button onClick={()=>setMenuOpen(o=>!o)} className="flex items-center gap-2 p-1 rounded hover:bg-muted">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">{initials(user?.name ?? user?.email ?? "U")}</div>
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-1 w-48 bg-card border rounded-md shadow-lg z-50 py-1">
            <div className="px-3 py-2 border-b"><p className="text-sm font-medium truncate">{user?.name ?? user?.email}</p><p className="text-xs text-muted-foreground">{user?.role}</p></div>
            <button onClick={()=>{logout();setMenuOpen(false);}} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted"><LogOut className="h-4 w-4"/>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}
