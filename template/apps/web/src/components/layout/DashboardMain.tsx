"use client";

import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/uiStore";

// ─── Types ────────────────────────────────────────────────────────────────────

type MaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full";
type Padding  = "none" | "sm" | "md" | "lg";

export interface PageHeaderProps {
  title: string;
  description?: string;
  /** Slot for buttons or controls rendered on the right */
  actions?: React.ReactNode;
}

export interface DashboardMainProps {
  children: React.ReactNode;
  /** Optional page header with title, description, and action slot */
  header?: PageHeaderProps;
  /** Constrain inner content width. Defaults to "full" */
  maxWidth?: MaxWidth;
  /** Inner content padding. Defaults to "md" */
  padding?: Padding;
  /** Extra classes applied to the inner content wrapper */
  className?: string;
}

// ─── Maps ─────────────────────────────────────────────────────────────────────

const maxWidthMap: Record<MaxWidth, string> = {
  sm:   "max-w-2xl",
  md:   "max-w-4xl",
  lg:   "max-w-6xl",
  xl:   "max-w-7xl",
  "2xl":"max-w-screen-2xl",
  full: "max-w-none",
};

const paddingMap: Record<Padding, string> = {
  none: "p-0",
  sm:   "p-4",
  md:   "p-6",
  lg:   "p-8",
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Drop this as the outermost element inside DashboardLayout.
 * It handles offset for the fixed Topbar and Sidebar automatically.
 *
 * @example
 * // Bare wrapper
 * <DashboardMain><MyPage /></DashboardMain>
 *
 * @example
 * // With page header + constrained width
 * <DashboardMain
 *   header={{ title: "Users", description: "Manage your team", actions: <Button>Invite</Button> }}
 *   maxWidth="xl"
 * >
 *   <UsersTable />
 * </DashboardMain>
 */
export function DashboardMain({
  children,
  header,
  maxWidth = "full",
  padding  = "md",
  className,
}: Readonly<DashboardMainProps>) {
  const { sidebarOpen } = useUIStore();

  return (
    <main
      className={cn(
        "min-h-screen transition-[padding] duration-300",
        "pt-14",                                      // clear fixed Topbar (h-14)
        sidebarOpen ? "lg:pl-64" : "lg:pl-[70px]",   // clear fixed Sidebar
      )}
    >
      <div
        className={cn(
          "mx-auto w-full",
          maxWidthMap[maxWidth],
          paddingMap[padding],
          className,
        )}
      >
        {header && <PageHeader {...header} />}
        {children}
      </div>
    </main>
  );
}

// ─── Page header sub-component (also exported for standalone use) ──────────────

export function PageHeader({ title, description, actions }: Readonly<PageHeaderProps>) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="min-w-0 space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground truncate">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}
