import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  TrendingUp,
  Receipt,
  LineChart,
  Bitcoin,
  PiggyBank,
  Calculator,
  RefreshCw,
} from "lucide-react";
import { type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/income", label: "Income", icon: TrendingUp },
  { to: "/expenses", label: "Expenses", icon: Receipt },
  { to: "/trading", label: "Trading", icon: LineChart },
  { to: "/crypto", label: "Crypto", icon: Bitcoin },
  { to: "/investments", label: "Investments", icon: PiggyBank },
  { to: "/tax", label: "Tax", icon: Calculator },
] as const;

export function DashboardLayout({ title, children }: { title: string; children: ReactNode }) {
  const { location } = useRouterState();
  const qc = useQueryClient();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden md:flex w-60 flex-col border-r border-border bg-sidebar">
        <div className="px-6 py-5 border-b border-sidebar-border">
          <div className="text-lg font-semibold">Finance HQ</div>
          <div className="text-xs text-muted-foreground">Live from Google Sheets</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = location.pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 min-w-0">
        <header className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h1 className="text-xl font-semibold">{title}</h1>
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ["transactions"] })}
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-border hover:bg-accent"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </header>
        <div className="p-6 space-y-6">{children}</div>
      </main>
    </div>
  );
}
