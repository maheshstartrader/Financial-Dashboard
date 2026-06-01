import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend,
} from "recharts";
import { PageShell } from "@/components/PageShell";
import { KPICard, ChartCard } from "@/components/cards";
import { TransactionsTable } from "@/components/TransactionsTable";
import { byEvent, fmtINR, groupSum, monthlySeries, sumINR } from "@/lib/analytics";

const PIE = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export const Route = createFileRoute("/income")({
  head: () => ({ meta: [{ title: "Income · Finance HQ" }] }),
  component: IncomePage,
});

function IncomePage() {
  return (
    <PageShell title="Income">
      {(rows) => {
        const income = byEvent(rows, "Income");
        const total = sumINR(income);
        const get = (cat: string) => sumINR(income.filter((r) => r.category === cat));
        const sources = groupSum(income, (r) => r.category.replace(/^I\./, ""));
        const platforms = groupSum(income, (r) => r.platform);
        const monthly = monthlySeries(income);

        return (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <KPICard label="Total Income" value={fmtINR(total)} tone="positive" />
              <KPICard label="Salary" value={fmtINR(get("I.Salary"))} />
              <KPICard label="Prop Firm Payout" value={fmtINR(get("I.Prop Firm Payout"))} />
              <KPICard label="Interest" value={fmtINR(get("I.Interest"))} />
              <KPICard label="Stock Profit" value={fmtINR(get("I.Stock Market Profit"))} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="Income Sources">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={sources} dataKey="total" nameKey="key" outerRadius={90} label>
                      {sources.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => fmtINR(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Monthly Income">
                <ResponsiveContainer>
                  <BarChart data={monthly}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(v: number) => fmtINR(v)} />
                    <Bar dataKey="income" fill="var(--chart-2)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Income by Platform">
                <ResponsiveContainer>
                  <BarChart data={platforms} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis type="number" fontSize={12} />
                    <YAxis dataKey="key" type="category" fontSize={12} width={90} />
                    <Tooltip formatter={(v: number) => fmtINR(v)} />
                    <Bar dataKey="total" fill="var(--chart-3)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Sources (Bar)">
                <ResponsiveContainer>
                  <BarChart data={sources}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="key" fontSize={11} />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(v: number) => fmtINR(v)} />
                    <Legend />
                    <Bar dataKey="total" fill="var(--chart-4)" name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <TransactionsTable rows={income} />
          </>
        );
      }}
    </PageShell>
  );
}
