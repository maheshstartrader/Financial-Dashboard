import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid,
} from "recharts";
import { PageShell } from "@/components/PageShell";
import { KPICard, ChartCard } from "@/components/cards";
import { TransactionsTable } from "@/components/TransactionsTable";
import { byEvent, fmtINR, groupSum, monthlySeries, sumINR } from "@/lib/analytics";

const PIE = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export const Route = createFileRoute("/investments")({
  head: () => ({ meta: [{ title: "Investments · Finance HQ" }] }),
  component: InvestmentsPage,
});

function InvestmentsPage() {
  return (
    <PageShell title="Investments">
      {(rows) => {
        const inv = byEvent(rows, "Investment");
        const get = (cat: string) => sumINR(inv.filter((r) => r.category === cat));
        const alloc = groupSum(inv, (r) => r.category.replace(/^I\./, ""));
        const monthly = monthlySeries(inv);

        return (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <KPICard label="Total Invested" value={fmtINR(sumINR(inv))} tone="info" />
              <KPICard label="Stocks" value={fmtINR(get("I.Stocks"))} />
              <KPICard label="Mutual Funds" value={fmtINR(get("I.MutualFunds"))} />
              <KPICard label="Crypto" value={fmtINR(get("I.Crypto"))} />
              <KPICard label="Options/Forex" value={fmtINR(get("I.Options") + get("I.Forex"))} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="Investment Allocation">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={alloc} dataKey="total" nameKey="key" outerRadius={90} label>
                      {alloc.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => fmtINR(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Monthly Investments">
                <ResponsiveContainer>
                  <BarChart data={monthly}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(v: number) => fmtINR(v)} />
                    <Bar dataKey="income" fill="var(--chart-2)" name="Invested" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <TransactionsTable rows={inv} />
          </>
        );
      }}
    </PageShell>
  );
}
