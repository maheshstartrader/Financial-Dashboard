import type { Transaction } from "@/types/finance";
import { fmtNum, fmtINR } from "@/lib/analytics";

export function TransactionsTable({
  rows,
  limit,
}: {
  rows: Transaction[];
  limit?: number;
}) {
  const data = (limit ? rows.slice(0, limit) : rows).slice().sort((a, b) => {
    const ta = a.date?.getTime() ?? 0;
    const tb = b.date?.getTime() ?? 0;
    return tb - ta;
  });

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Event</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Platform</th>
              <th className="px-3 py-2 text-right">Amount</th>
              <th className="px-3 py-2">Cur</th>
              <th className="px-3 py-2 text-right">INR</th>
              <th className="px-3 py-2">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i} className="border-t border-border hover:bg-accent/40">
                <td className="px-3 py-2 whitespace-nowrap">
                  {r.date ? r.date.toLocaleDateString("en-GB") : "-"}
                </td>
                <td className="px-3 py-2">{r.eventType}</td>
                <td className="px-3 py-2">{r.category}</td>
                <td className="px-3 py-2">{r.platform}</td>
                <td className="px-3 py-2 text-right">{fmtNum(r.amount)}</td>
                <td className="px-3 py-2">{r.currency}</td>
                <td className="px-3 py-2 text-right">{fmtINR(r.inrValue)}</td>
                <td className="px-3 py-2 text-muted-foreground">{r.purpose}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">
                  No transactions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
