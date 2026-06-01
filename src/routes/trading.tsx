import { createFileRoute } from "@tanstack/react-router";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { PageShell } from "@/components/PageShell";
import { KPICard, ChartCard } from "@/components/cards";
import { TransactionsTable } from "@/components/TransactionsTable";
import { fmtINR, monthlySeries, sumINR } from "@/lib/analytics";

export const Route = createFileRoute("/trading")({
  head: () => ({ meta: [{ title: "Trading · Finance HQ" }] }),
  component: TradingPage,
});

function TradingPage() {
  return (
    <PageShell title="Trading">
      {(rows) => {
        const propPayout = rows.filter((r) => r.category === "I.Prop Firm Payout");
        const stockProfit = rows.filter((r) => r.category === "I.Stock Market Profit");
        const challenge = rows.filter((r) => r.category === "E.Challenge Fee");
        const brokerExp = rows.filter((r) => r.eventType === "Expenses" && r.platform === "Broker");

        const tradingIncome = sumINR(propPayout) + sumINR(stockProfit);
        const tradingCosts = sumINR(challenge) + sumINR(brokerExp);
        const net = tradingIncome - tradingCosts;

        const tradingRows = [...propPayout, ...stockProfit, ...challenge, ...brokerExp];
        const monthly = monthlySeries(tradingRows);

        return (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <KPICard label="Trading Income" value={fmtINR(tradingIncome)} tone="positive" />
              <KPICard label="Challenge Fees" value={fmtINR(sumINR(challenge))} tone="negative" />
              <KPICard label="Broker Costs" value={fmtINR(sumINR(brokerExp))} tone="negative" />
              <KPICard label="Prop Firm Payouts" value={fmtINR(sumINR(propPayout))} />
              <KPICard label="Net Trading" value={fmtINR(net)} tone={net >= 0 ? "positive" : "negative"} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="Monthly Trading Performance">
                <ResponsiveContainer>
                  <BarChart data={monthly}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(v: number) => fmtINR(v)} />
                    <Legend />
                    <Bar dataKey="income" fill="var(--chart-2)" name="Payouts/Profit" />
                    <Bar dataKey="expense" fill="var(--chart-1)" name="Fees/Costs" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Net Trading Profit Trend">
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
            </div>

            <TransactionsTable rows={tradingRows} />
          </>
        );
      }}
    </PageShell>
  );
}
