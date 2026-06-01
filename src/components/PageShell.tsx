import { type ReactNode } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { DashboardLayout } from "@/components/DashboardLayout";

export function PageShell({
  title,
  children,
}: {
  title: string;
  children: (data: ReturnType<typeof useTransactions>["data"] extends infer T ? NonNullable<T> : never) => ReactNode;
}) {
  const { data, isLoading, error } = useTransactions();
  return (
    <DashboardLayout title={title}>
      {isLoading && <div className="text-muted-foreground">Loading sheet…</div>}
      {error && (
        <div className="rounded border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load sheet. Make sure the Google Sheet is shared as "Anyone with the link – Viewer".
          <div className="mt-1 text-xs opacity-70">{(error as Error).message}</div>
        </div>
      )}
      {data && children(data)}
    </DashboardLayout>
  );
}
