import type { Transaction } from "@/types/finance";

export const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

export const fmtNum = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n || 0);

export const sumINR = (rows: Transaction[]) =>
  rows.reduce((acc, r) => acc + (r.inrValue || 0), 0);

export const byEvent = (rows: Transaction[], type: string) =>
  rows.filter((r) => r.eventType === type);

export const byDirection = (rows: Transaction[], dir: string) =>
  rows.filter((r) => r.direction === dir);

export const byCategoryStartsWith = (rows: Transaction[], prefix: string) =>
  rows.filter((r) => r.category?.startsWith(prefix));

export interface GroupBucket {
  key: string;
  total: number;
  count: number;
}

export function groupSum(
  rows: Transaction[],
  keyFn: (r: Transaction) => string,
): GroupBucket[] {
  const map = new Map<string, GroupBucket>();
  for (const r of rows) {
    const k = keyFn(r) || "Unknown";
    const cur = map.get(k) ?? { key: k, total: 0, count: 0 };
    cur.total += r.inrValue || 0;
    cur.count += 1;
    map.set(k, cur);
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

export function monthlySeries(rows: Transaction[]): { month: string; income: number; expense: number; net: number }[] {
  const map = new Map<string, { month: string; income: number; expense: number; net: number; sortKey: number }>();
  for (const r of rows) {
    if (!r.date) continue;
    const key = `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, "0")}`;
    const label = r.month || key;
    const sortKey = r.date.getFullYear() * 12 + r.date.getMonth();
    const cur = map.get(key) ?? { month: label, income: 0, expense: 0, net: 0, sortKey };
    if (r.eventType === "Income") cur.income += r.inrValue;
    if (r.eventType === "Expenses") cur.expense += r.inrValue;
    cur.net = cur.income - cur.expense;
    map.set(key, cur);
  }
  return Array.from(map.values())
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ sortKey: _s, ...rest }) => rest);
}
