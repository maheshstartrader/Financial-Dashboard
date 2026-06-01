import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid,
} from "recharts";
import { PageShell } from "@/components/PageShell";
import { KPICard, ChartCard } from "@/components/cards";
import { TransactionsTable } from "@/components/TransactionsTable";
import { fmtNum, fmtINR, groupSum, sumINR } from "@/lib/analytics";

const PIE = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export const Route = createFileRoute("/crypto")({
  head: () => ({ meta: [{ title: "Crypto · Finance HQ" }] }),
  component: CryptoPage,
});

function CryptoPage() {
  return (
    <PageShell title="Crypto">
      {(rows) => {
        const transfers = rows.filter((r) => r.eventType === "Transfer");
        const inrToUsdt = transfers.filter((r) => /Bank->Binance|Bank->Giottus/i.test(r.category));
        const usdtToInr = transfers.filter((r) => /Binance->Bank|Giottus->Bank|TrustWallet->INR/i.test(r.category));
        const usdtBought = inrToUsdt.filter((r) => r.currency === "USDT").reduce((a, r) => a + r.amount, 0);
        const usdtSold = usdtToInr.filter((r) => r.currency === "USDT").reduce((a, r) => a + r.amount, 0);
        const inrInvested = sumINR(inrToUsdt);

        const platformFlow = groupSum(transfers, (r) => r.platform);
        const categoryFlow = groupSum(transfers, (r) => r.category.replace(/^T\./, ""));

        return (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <KPICard label="USDT Bought" value={fmtNum(usdtBought)} tone="info" />
              <KPICard label="USDT Sold" value={fmtNum(usdtSold)} />
              <KPICard label="INR Invested" value={fmtINR(inrInvested)} />
              <KPICard label="Internal Transfers" value={transfers.length.toString()} />
              <KPICard label="Total Flow (INR)" value={fmtINR(sumINR(transfers))} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="Transfer Flow by Platform">
                <ResponsiveContainer>
                  <BarChart data={platformFlow}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="key" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(v: number) => fmtINR(v)} />
                    <Bar dataKey="total" fill="var(--chart-3)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Transfer Categories">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={categoryFlow} dataKey="total" nameKey="key" outerRadius={90} label>
                      {categoryFlow.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => fmtINR(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <TransactionsTable rows={transfers} />
          </>
        );
      }}
    </PageShell>
  );
}
