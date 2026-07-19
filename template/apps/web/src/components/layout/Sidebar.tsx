"use client";

import { useState, useCallback } from "react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/uiStore";

// ─── Public types ─────────────────────────────────────────────────────────────

export type NavChildItem = {
  id: string;
  label: string;
  href: string;
};

export type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  /** Direct link — omit when using children */
  href?: string;
  /** Sub-items rendered in a collapsible group */
  children?: NavChildItem[];
  adminOnly?: boolean;
};

export type SidebarUserInfo = {
  name: string;
  role: string;
  initials: string;
  /** Tailwind classes for the avatar circle; defaults to green */
  avatarClassName?: string;
};

export interface SidebarProps {
  navItems: NavItem[];
  userInfo?: SidebarUserInfo;
  brandName?: string;
  brandIcon?: React.ReactNode;
  isAdmin?: boolean;
  /** Controlled mobile-overlay open state */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Sidebar({
  navItems,
  userInfo,
  brandName = "Navigation",
  brandIcon,
  isAdmin = false,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const isCollapsed = !sidebarOpen;
  const pathname = usePathname();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const defaults: Record<string, boolean> = {};
    navItems.forEach(item => {
      if (item.children?.length) defaults[item.id] = true;
    });
    return defaults;
  });

  const toggleSection = useCallback(
    (id: string) => setExpandedSections(prev => ({ ...prev, [id]: !prev[id] })),
    [],
  );

  const filteredItems = navItems.filter(item => !item.adminOnly || isAdmin);

  const isLeafActive = (href?: string) => !!href && pathname === href;
  const isSectionActive = (item: NavItem) =>
    item.children?.some(c => pathname === c.href) ?? false;

  // ── Shared desktop sidebar ──────────────────────────────────────────────────

  const desktopSidebar = (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-64",
      )}
    >
      {/* Brand + collapse toggle */}
      <div
        className={cn(
          "flex items-center border-b border-gray-100 py-3.5",
          isCollapsed ? "justify-center px-3.5" : "justify-between px-4",
        )}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            {brandIcon ?? (
              <div className="w-[22px] h-[22px] rounded bg-indigo-600 flex items-center justify-center text-xs text-white font-medium select-none">
                ◈
              </div>
            )}
            <span className="font-medium text-sm whitespace-nowrap">{brandName}</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="rounded border border-gray-300 w-[26px] h-[26px] flex items-center justify-center text-xs text-gray-600 shrink-0 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      {/* Nav items */}
      <nav
        className="flex-1 px-2 py-2.5 flex flex-col gap-0.5 overflow-y-auto"
        aria-label="Main navigation"
      >
        {filteredItems.map(item => {
          const Icon = item.icon;
          const hasChildren = !!item.children?.length;
          const active = hasChildren ? isSectionActive(item) : isLeafActive(item.href);

          if (!hasChildren) {
            const cls = cn(
              "flex items-center rounded-md cursor-pointer relative whitespace-nowrap transition-colors",
              isCollapsed ? "justify-center p-2" : "justify-start px-2 py-[7px]",
              active
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
            );
            const inner = (
              <>
                {active && !isCollapsed && (
                  <div className="absolute left-0 top-[20%] h-[60%] w-0.5 bg-indigo-600 rounded" />
                )}
                <Icon className="w-[18px] h-[18px] shrink-0" />
                {!isCollapsed && <span className="text-sm ml-2">{item.label}</span>}
              </>
            );
            return item.href ? (
              <Link
                key={item.id}
                href={item.href as Route}
                className={cls}
                aria-current={active ? "page" : undefined}
              >
                {inner}
              </Link>
            ) : (
              <div
                key={item.id}
                role="button"
                className={cls}
                aria-current={active ? "page" : undefined}
              >
                {inner}
              </div>
            );
          }

          // Section with children
          return (
            <div key={item.id}>
              <button
                onClick={() => toggleSection(item.id)}
                className={cn(
                  "w-full flex items-center rounded-md whitespace-nowrap transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                  isCollapsed ? "justify-center p-2" : "justify-between px-2 py-[7px]",
                )}
              >
                <span
                  className={cn(
                    "flex items-center",
                    isCollapsed ? "justify-center" : "gap-2.5 flex-1",
                  )}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" />
                  {!isCollapsed && <span className="text-sm">{item.label}</span>}
                </span>
                {!isCollapsed && (
                  <ChevronDown
                    size={13}
                    className="shrink-0 transition-transform duration-200"
                    style={{
                      transform: expandedSections[item.id] ? "rotate(0deg)" : "rotate(-90deg)",
                    }}
                  />
                )}
              </button>

              {expandedSections[item.id] && !isCollapsed && (
                <div className="flex flex-col gap-0.5 ml-3 pl-3 border-l border-gray-100 mb-1">
                  {item.children!.map(child => {
                    const childActive = pathname === child.href;
                    return (
                      <Link
                        key={child.id}
                        href={child.href as Route}
                        aria-current={childActive ? "page" : undefined}
                        className={cn(
                          "px-2 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors",
                          childActive
                            ? "bg-gray-100 text-gray-900 font-medium"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                        )}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User info */}
      {userInfo && (
        <div className="border-t border-gray-100 px-2 py-2.5">
          <div
            className={cn(
              "flex items-center gap-2.5 px-2 py-1.5 rounded-md",
              isCollapsed ? "justify-center" : "justify-start",
            )}
          >
            <div
              className={cn(
                "w-[26px] h-[26px] shrink-0 rounded-full flex items-center justify-center text-xs font-medium",
                userInfo.avatarClassName ?? "bg-green-100 text-green-700",
              )}
            >
              {userInfo.initials}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <div className="text-xs font-medium text-gray-900 whitespace-nowrap">
                  {userInfo.name}
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">{userInfo.role}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* Desktop — fixed below header */}
      <div className="hidden lg:block fixed top-14 bottom-0 left-0 z-20">{desktopSidebar}</div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
          <aside className="relative w-72 h-full bg-white border-r border-gray-200 flex flex-col shadow-xl">
            {/* Mobile header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {brandIcon}
                <span className="font-medium text-sm">{brandName}</span>
              </div>
              <button
                onClick={onMobileClose}
                className="cursor-pointer bg-transparent border-none text-gray-600 hover:bg-gray-100 p-1 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Mobile nav */}
            <nav className="flex-1 px-2 py-2.5 flex flex-col gap-0.5 overflow-y-auto">
              {filteredItems.map(item => {
                const Icon = item.icon;
                const hasChildren = !!item.children?.length;
                const active = hasChildren ? isSectionActive(item) : isLeafActive(item.href);

                if (!hasChildren) {
                  const cls = cn(
                    "flex items-center gap-2.5 px-2 py-[7px] rounded-md text-sm transition-colors",
                    active
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                  );
                  return item.href ? (
                    <Link
                      key={item.id}
                      href={item.href as Route}
                      className={cls}
                      onClick={onMobileClose}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="w-[18px] h-[18px] shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <div
                      key={item.id}
                      role="button"
                      className={cls}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="w-[18px] h-[18px] shrink-0" />
                      <span>{item.label}</span>
                    </div>
                  );
                }

                return (
                  <div key={item.id}>
                    <button
                      onClick={() => toggleSection(item.id)}
                      className="w-full flex items-center justify-between gap-2.5 px-2 py-[7px] rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="w-[18px] h-[18px] shrink-0" />
                        <span>{item.label}</span>
                      </span>
                      <ChevronDown
                        size={13}
                        className="transition-transform duration-200"
                        style={{
                          transform: expandedSections[item.id]
                            ? "rotate(0deg)"
                            : "rotate(-90deg)",
                        }}
                      />
                    </button>
                    {expandedSections[item.id] && (
                      <div className="flex flex-col gap-0.5 ml-3 pl-3 border-l border-gray-100 mb-1">
                        {item.children!.map(child => {
                          const childActive = pathname === child.href;
                          return (
                            <Link
                              key={child.id}
                              href={child.href as Route}
                              onClick={onMobileClose}
                              aria-current={childActive ? "page" : undefined}
                              className={cn(
                                "px-2 py-1.5 rounded-md text-xs transition-colors",
                                childActive
                                  ? "bg-gray-100 text-gray-900 font-medium"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                              )}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Mobile user info */}
            {userInfo && (
              <div className="border-t border-gray-100 px-2 py-2.5">
                <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md">
                  <div
                    className={cn(
                      "w-[26px] h-[26px] shrink-0 rounded-full flex items-center justify-center text-xs font-medium",
                      userInfo.avatarClassName ?? "bg-green-100 text-green-700",
                    )}
                  >
                    {userInfo.initials}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-medium text-gray-900 whitespace-nowrap">
                      {userInfo.name}
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap">{userInfo.role}</div>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
