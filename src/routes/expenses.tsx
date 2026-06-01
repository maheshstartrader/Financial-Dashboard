import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid,
} from "recharts";
import { PageShell } from "@/components/PageShell";
import { KPICard, ChartCard } from "@/components/cards";
import { TransactionsTable } from "@/components/TransactionsTable";
import { byEvent, fmtINR, groupSum, monthlySeries, sumINR } from "@/lib/analytics";

const PIE = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export const Route = createFileRoute("/expenses")({
  head: () => ({ meta: [{ title: "Expenses · Finance HQ" }] }),
  component: ExpensesPage,
});

function ExpensesPage() {
  return (
    <PageShell title="Expenses">
      {(rows) => {
        const exp = byEvent(rows, "Expenses");
        const total = sumINR(exp);
        const cats = groupSum(exp, (r) => r.category.replace(/^E\./, ""));
        const platforms = groupSum(exp, (r) => r.platform);
        const monthly = monthlySeries(exp);

        return (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <KPICard label="Total Expense" value={fmtINR(total)} tone="negative" />
              <KPICard label="Top Category" value={cats[0]?.key ?? "-"} hint={cats[0] ? fmtINR(cats[0].total) : ""} />
              <KPICard label="Categories Used" value={cats.length.toString()} />
              <KPICard label="Transactions" value={exp.length.toString()} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="Expense Breakdown">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={cats} dataKey="total" nameKey="key" outerRadius={90} label>
                      {cats.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => fmtINR(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Top Spending Categories">
                <ResponsiveContainer>
                  <BarChart data={cats.slice(0, 8)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis type="number" fontSize={12} />
                    <YAxis dataKey="key" type="category" fontSize={12} width={110} />
                    <Tooltip formatter={(v: number) => fmtINR(v)} />
                    <Bar dataKey="total" fill="var(--chart-1)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Monthly Expenses">
                <ResponsiveContainer>
                  <BarChart data={monthly}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(v: number) => fmtINR(v)} />
                    <Bar dataKey="expense" fill="var(--chart-1)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Expense by Platform">
                <ResponsiveContainer>
                  <BarChart data={platforms}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="key" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(v: number) => fmtINR(v)} />
                    <Bar dataKey="total" fill="var(--chart-4)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <TransactionsTable rows={exp} />
          </>
        );
      }}
    </PageShell>
  );
}
