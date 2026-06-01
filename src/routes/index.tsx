import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { PageShell } from "@/components/PageShell";
import { KPICard, ChartCard } from "@/components/cards";
import { TransactionsTable } from "@/components/TransactionsTable";
import {
  byEvent,
  fmtINR,
  groupSum,
  monthlySeries,
  sumINR,
} from "@/lib/analytics";

const PIE = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview · Finance HQ" },
      { name: "description", content: "Live financial overview from your Google Sheet." },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  return (
    <PageShell title="Overview">
      {(rows) => {
        const income = sumINR(byEvent(rows, "Income"));
        const expense = sumINR(byEvent(rows, "Expenses"));
        const invest = sumINR(byEvent(rows, "Investment"));
        const transfers = sumINR(byEvent(rows, "Transfer"));
        const net = income - expense;
        const monthly = monthlySeries(rows);
        const expenseBreak = groupSum(byEvent(rows, "Expenses"), (r) => r.category);

        return (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
              <KPICard label="Total Income" value={fmtINR(income)} tone="positive" />
              <KPICard label="Total Expenses" value={fmtINR(expense)} tone="negative" />
              <KPICard label="Net Profit" value={fmtINR(net)} tone={net >= 0 ? "positive" : "negative"} />
              <KPICard label="Investments" value={fmtINR(invest)} tone="info" />
              <KPICard label="Transfers" value={fmtINR(transfers)} />
              <KPICard label="Transactions" value={rows.length.toString()} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="Monthly Income vs Expense">
                <ResponsiveContainer>
                  <BarChart data={monthly}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(v: number) => fmtINR(v)} />
                    <Legend />
                    <Bar dataKey="income" fill="var(--chart-2)" name="Income" />
                    <Bar dataKey="expense" fill="var(--chart-1)" name="Expense" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Net Savings Trend">
                <ResponsiveContainer>
                  <LineChart data={monthly}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(v: number) => fmtINR(v)} />
                    <Line type="monotone" dataKey="net" stroke="var(--chart-3)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Expense Breakdown">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={expenseBreak} dataKey="total" nameKey="key" outerRadius={90} label>
                      {expenseBreak.map((_, i) => (
                        <Cell key={i} fill={PIE[i % PIE.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => fmtINR(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Transactions per Month">
                <ResponsiveContainer>
                  <BarChart data={monthly}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="income" stackId="a" fill="var(--chart-2)" name="Income" />
                    <Bar dataKey="expense" stackId="a" fill="var(--chart-1)" name="Expense" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <div>
              <h2 className="text-sm font-medium mb-2">Latest Transactions</h2>
              <TransactionsTable rows={rows} limit={10} />
            </div>
          </>
        );
      }}
    </PageShell>
  );
}
