import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function KPICard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "positive" | "negative" | "info";
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div
        className={cn(
          "mt-1 text-2xl font-semibold",
          tone === "positive" && "text-emerald-600",
          tone === "negative" && "text-red-600",
          tone === "info" && "text-blue-600",
        )}
      >
        {value}
      </div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}

export function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-sm font-medium mb-3">{title}</div>
      <div className="h-72">{children}</div>
    </div>
  );
}
