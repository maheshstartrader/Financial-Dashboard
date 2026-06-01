import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { KPICard } from "@/components/cards";
import { TransactionsTable } from "@/components/TransactionsTable";
import { fmtINR, sumINR } from "@/lib/analytics";

export const Route = createFileRoute("/tax")({
  head: () => ({ meta: [{ title: "Tax · Finance HQ" }] }),
  component: TaxPage,
});

// Simple Indian slab (new regime FY25-26 illustrative)
function estimateTax(income: number) {
  let tax = 0;
  const slabs = [
    [300000, 0],
    [600000, 0.05],
    [900000, 0.1],
    [1200000, 0.15],
    [1500000, 0.2],
    [Infinity, 0.3],
  ] as const;
  let prev = 0;
  for (const [limit, rate] of slabs) {
    if (income > limit) {
      tax += (limit - prev) * rate;
      prev = limit;
    } else {
      tax += (income - prev) * rate;
      break;
    }
  }
  return Math.max(0, tax);
}

function TaxPage() {
  return (
    <PageShell title="Tax">
      {(rows) => {
        const salary = sumINR(rows.filter((r) => r.category === "I.Salary"));
        const tradingIncome =
          sumINR(rows.filter((r) => r.category === "I.Prop Firm Payout")) +
          sumINR(rows.filter((r) => r.category === "I.Stock Market Profit"));

        const cryptoBuys = rows.filter((r) => r.eventType === "Transfer" && /Bank->/.test(r.category));
        const cryptoSells = rows.filter((r) => r.eventType === "Transfer" && /->Bank|->INR/.test(r.category));
        const cryptoBuyINR = sumINR(cryptoBuys);
        const cryptoSellINR = sumINR(cryptoSells);
        const cryptoProfit = Math.max(0, cryptoSellINR - cryptoBuyINR);

        const taxable = salary + tradingIncome + cryptoProfit;
        const incomeTax = estimateTax(salary + tradingIncome);
        const cryptoTax = cryptoProfit * 0.3; // flat 30% in India
        const totalTax = incomeTax + cryptoTax;

        return (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <KPICard label="Salary Income" value={fmtINR(salary)} />
              <KPICard label="Trading Income" value={fmtINR(tradingIncome)} />
              <KPICard label="Crypto Profit (est.)" value={fmtINR(cryptoProfit)} />
              <KPICard label="Taxable Income" value={fmtINR(taxable)} tone="info" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <KPICard label="Crypto Buys (INR)" value={fmtINR(cryptoBuyINR)} />
              <KPICard label="Crypto Sells (INR)" value={fmtINR(cryptoSellINR)} />
              <KPICard label="Est. Income Tax" value={fmtINR(incomeTax)} tone="negative" />
              <KPICard
                label="Est. Crypto Tax (30%)"
                value={fmtINR(cryptoTax)}
                tone="negative"
                hint={`Total estimated tax: ${fmtINR(totalTax)}`}
              />
            </div>

            <div>
              <h2 className="text-sm font-medium mb-2">Crypto Buy Transactions</h2>
              <TransactionsTable rows={cryptoBuys} />
            </div>
            <div>
              <h2 className="text-sm font-medium mb-2">Crypto Sell Transactions</h2>
              <TransactionsTable rows={cryptoSells} />
            </div>
          </>
        );
      }}
    </PageShell>
  );
}
