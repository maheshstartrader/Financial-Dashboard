import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "@/lib/sheets";

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
}
