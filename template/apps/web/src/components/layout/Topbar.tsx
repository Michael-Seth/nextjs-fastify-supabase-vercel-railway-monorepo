"use client";

import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useAuthQuery";
import { useUIStore } from "@/stores/uiStore";
import { Menu, Sun, Moon, Bell, LogOut, Layers } from "lucide-react";
import { initials } from "@/lib/formatters";
import { useState } from "react";

interface TopbarProps {
  /** Called when the mobile hamburger is pressed — wire to your mobile sidebar state */
  onMobileMenuClick?: () => void;
}

export function Topbar({ onMobileMenuClick }: Readonly<TopbarProps>) {
  const { user } = useAuth();
  const { mutate: logout } = useLogout();
  const { toggleSidebar, toggleTheme, theme } = useUIStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 h-14 z-30 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-full items-center gap-3 px-4">

        {/* Mobile: opens overlay sidebar */}
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden rounded-md p-1.5 hover:bg-muted text-muted-foreground transition-colors"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        {/* Desktop: collapses/expands sidebar */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex rounded-md p-1.5 hover:bg-muted text-muted-foreground transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2.5 font-semibold text-foreground">
          <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center shrink-0">
            <Layers size={14} className="text-primary-foreground" />
          </div>
          <span>{process.env.NEXT_PUBLIC_APP_NAME ?? "NFS Mono"}</span>
        </div>

        <div className="ml-auto flex items-center gap-1">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-md p-1.5 hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Notifications */}
          <button
            className="rounded-md p-1.5 hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Notifications"
          >
            <Bell size={17} />
          </button>

          {/* User menu */}
          <div className="relative ml-1">
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="flex items-center rounded-md p-1 hover:bg-muted transition-colors"
            >
              <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium shrink-0">
                {initials(user?.name ?? user?.email ?? "U")}
              </div>
            </button>

            {menuOpen && (
              <>
                {/* Click-outside trap */}
                <button
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setMenuOpen(false)}
                  onKeyDown={e => e.key === "Escape" && setMenuOpen(false)}
                  aria-label="Close menu"
                  tabIndex={-1}
                />
                <div className="absolute right-0 mt-1.5 w-52 bg-card border border-border rounded-md shadow-lg z-50 py-1">
                  <div className="px-3 py-2.5 border-b border-border">
                    <p className="text-sm font-medium truncate">{user?.name ?? user?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
