export type EventType = "Income" | "Expenses" | "Transfer" | "Investment";
export type Direction = "Money In" | "Money Out" | "Internal Transfer";
export type Currency = "INR" | "USDT" | "ETH" | "BTC";

export interface Transaction {
  timestamp: Date | null;
  date: Date | null;
  time: string;
  eventType: EventType | string;
  category: string;
  platform: string;
  amount: number;
  currency: Currency | string;
  direction: Direction | string;
  purpose: string;
  proof: string;
  /** Amount normalized to INR for cross-currency aggregation */
  inrValue: number;
  month: string; // e.g. "May-2026"
  year: number;
  week: number;
}
