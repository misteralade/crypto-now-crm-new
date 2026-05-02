import { useMemo } from "react";
import moment from "moment";
import { useSweepQuery } from "../../../queries/sweep.querries.ts";
import type { BalanceSummaryRow } from "../../../api/sweep.api.ts";

const NETWORK_LABELS: Record<string, string> = {
  BTC: "Bitcoin",
  SOLANA: "Solana",
  TRC20: "Tron (TRC-20)",
  ERC20: "Ethereum (ERC-20)",
};

// Short absolute local time for cache freshness (year omitted when it matches the current year).
function formatCachedAt(iso: string): string {
  const m = moment(iso);
  if (!m.isValid()) return "";
  return m.isSame(moment(), "year")
    ? m.format("D MMM HH:mm")
    : m.format("D MMM YY HH:mm");
}

// Footer label for oldest balance refresh in this row.
function formatRefreshedAt(value: string | null, walletCount: number) {
  if (walletCount === 0) return "No wallets yet";
  if (!value) return "Never refreshed";
  const label = formatCachedAt(value);
  return label || "Never refreshed";
}

// Trim the displayed total to a sensible number of significant decimals per asset.
function formatTotalBalance(symbol: string, value: number): string {
  if (value === 0) return "0";
  const upper = symbol.toUpperCase();
  if (upper === "USDT" || upper === "USDC") return value.toFixed(2);
  if (upper === "BTC") return value.toFixed(8);
  if (upper === "ETH" || upper === "SOL") return value.toFixed(6);
  return value.toFixed(6);
}

interface BalanceCardProps {
  row: BalanceSummaryRow;
  onRefresh: (row: BalanceSummaryRow) => void;
  refreshing: boolean;
}

// Single asset card with totals + refresh action.
function BalanceCard({ row, onRefresh, refreshing }: BalanceCardProps) {
  const networkLabel = NETWORK_LABELS[row.network] ?? row.network;
  const freshness = formatRefreshedAt(row.oldestRefreshedAt, row.walletCount);
  const everRefreshed = !!row.oldestRefreshedAt;
  const freshnessTitle =
    row.oldestRefreshedAt && moment(row.oldestRefreshedAt).isValid()
      ? moment(row.oldestRefreshedAt).format("YYYY-MM-DD HH:mm:ss")
      : undefined;

  return (
    <div className="group relative rounded-2xl border border-[#E4E7EC] bg-white p-5 transition-all hover:border-[#C7CAFB] hover:shadow-[0_8px_24px_-12px_rgba(3,3,77,0.18)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[--color-primary-taint] text-[13px] font-bold text-[#03034D]">
            {row.symbol.toUpperCase().slice(0, 4)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[--color-text-primary]">
              {row.name}
            </p>
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#667085]">
              {networkLabel}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRefresh(row)}
          disabled={refreshing || row.walletCount === 0}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E4E7EC] bg-white text-[#475467] transition-all hover:border-[#C7CAFB] hover:bg-[--color-primary-taint] hover:text-[#03034D] disabled:cursor-not-allowed disabled:opacity-50"
          title="Refresh balances from chain"
          aria-label="Refresh balances"
        >
          <svg
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      <div className="mt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#667085]">
          Total Balance
        </p>
        <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[--color-text-primary]">
          {formatTotalBalance(row.symbol, row.totalBalance)}{" "}
          <span className="text-base font-medium text-[#475467]">
            {row.symbol.toUpperCase()}
          </span>
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#F2F4F7] pt-3">
        <div className="flex items-center gap-1.5 text-xs text-[#667085]">
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="tabular-nums">
            {row.walletCount} wallet{row.walletCount === 1 ? "" : "s"}
          </span>
        </div>
        <span
          className={`flex min-w-0 shrink items-center justify-end gap-1 text-[10px] font-medium tabular-nums leading-tight tracking-tight ${everRefreshed ? "text-[#667085]" : "text-amber-600"}`}
          title={freshnessTitle}
        >
          {!everRefreshed && (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
          )}
          <span className="truncate">{freshness}</span>
        </span>
      </div>

      {row.neverRefreshedCount > 0 && everRefreshed && (
        <p className="mt-2 text-[11px] text-amber-600">
          {row.neverRefreshedCount} wallet
          {row.neverRefreshedCount === 1 ? "" : "s"} not yet refreshed
        </p>
      )}
    </div>
  );
}

// Skeleton placeholder while the summary query loads.
function BalanceCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#E4E7EC] bg-white p-5">
      <div className="flex items-center gap-2.5">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-[#F2F4F7]" />
        <div className="space-y-1.5">
          <div className="h-3 w-24 animate-pulse rounded bg-[#F2F4F7]" />
          <div className="h-2.5 w-16 animate-pulse rounded bg-[#F2F4F7]" />
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-2.5 w-32 animate-pulse rounded bg-[#F2F4F7]" />
        <div className="h-7 w-40 animate-pulse rounded bg-[#F2F4F7]" />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-[#F2F4F7] pt-3">
        <div className="h-3 w-20 animate-pulse rounded bg-[#F2F4F7]" />
        <div className="h-3 w-24 animate-pulse rounded bg-[#F2F4F7]" />
      </div>
    </div>
  );
}

export default function BalanceSummaryGrid() {
  const { useBalanceSummary, refreshBalancesMutation } = useSweepQuery();
  const { data, isLoading, isError, refetch } = useBalanceSummary();

  // Track which (cryptocurrencyId+network) pair is currently refreshing for per-card spinner state.
  const refreshingKey = useMemo(() => {
    if (!refreshBalancesMutation.isPending) return null;
    const vars = refreshBalancesMutation.variables;
    return vars ? `${vars.cryptocurrencyId}:${vars.network}` : null;
  }, [refreshBalancesMutation.isPending, refreshBalancesMutation.variables]);

  const handleRefresh = (row: BalanceSummaryRow) => {
    refreshBalancesMutation.mutate({
      cryptocurrencyId: row.cryptocurrencyId,
      network: row.network,
    });
  };

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-[16px] font-semibold text-[--color-text-primary]">
            Custodial Balances
          </h3>
          <p className="mt-1 text-xs text-[--color-text-muted]">
            Cached totals per supported asset. Refresh to reconcile against the
            chain on demand.
          </p>
        </div>
        {!isLoading && data && data.length > 0 && (
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs font-medium text-[#03034D] underline-offset-4 hover:underline"
          >
            Reload summary
          </button>
        )}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <BalanceCardSkeleton key={idx} />
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          Failed to load balance summary.{" "}
          <button
            type="button"
            onClick={() => refetch()}
            className="font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && data && data.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#D0D5DD] bg-white p-6 text-center text-sm text-[#667085]">
          No supported wallets configured yet.
        </div>
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {data.map((row) => {
            const key = `${row.cryptocurrencyId}:${row.network}`;
            return (
              <BalanceCard
                key={key}
                row={row}
                onRefresh={handleRefresh}
                refreshing={refreshingKey === key}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
