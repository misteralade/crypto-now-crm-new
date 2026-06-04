import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import PageHeader from "../components/global/pageHeader.tsx";
import { useCryptoQuery } from "../queries/crypto.querries.ts";
import { useSweepQuery } from "../queries/sweep.querries.ts";
import type {
  BalanceSummaryRow,
  SweepHistoryParams,
  SweepRequest,
  SweepStatus,
} from "../api/sweep.api.ts";
import SweepConfigModal from "../components/pages/treasury/SweepConfigModal.tsx";
import BalanceSummaryGrid from "../components/pages/treasury/BalanceSummaryGrid.tsx";
import TreasuryWalletsModal from "../components/pages/treasury/TreasuryWalletsModal.tsx";
import Table, { type TableColumn } from "../components/table.tsx";

const STATUS_MAP: Record<string, { label: string; classes: string }> = {
  COMPLETED: {
    label: "Completed",
    classes:
      "bg-[--color-success-bg] text-[--color-success] border border-emerald-200",
  },
  FAILED: {
    label: "Failed",
    classes: "bg-red-50 text-red-600 border border-red-200",
  },
  PARTIAL: {
    label: "Partial",
    classes: "bg-amber-50 text-amber-600 border border-amber-200",
  },
  IN_PROGRESS: {
    label: "In Progress",
    classes: "bg-blue-50 text-blue-600 border border-blue-200",
  },
  PENDING: {
    label: "Pending",
    classes: "bg-gray-100 text-gray-600 border border-gray-200",
  },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? {
    label: status,
    classes: "bg-gray-100 text-gray-500",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.classes}`}
    >
      {status === "IN_PROGRESS" && (
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
      )}
      {s.label}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  className = "",
}: {
  label: string;
  value: string | number;
  sub?: string;
  className?: string;
}) {
  return (
    <div
      className={`bg-[--color-primary-taint] rounded-2xl p-5 md:p-6 flex flex-col gap-1.5 border border-[#DDE0FF] ${className}`}
    >
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.08em]">
        {label}
      </p>
      <p className="text-2xl md:text-[30px] font-semibold leading-none text-gray-900">
        {value}
      </p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

type TokenSweepSummary = {
  cryptocurrencyId: string;
  symbol: string;
  name: string;
  totalAmount: number;
  sweepCount: number;
};

function getAmountDecimals(symbol: string): number {
  switch (symbol.toUpperCase()) {
    case "BTC":
      return 8;
    case "ETH":
    case "SOL":
      return 6;
    case "USDT":
    case "USDC":
      return 2;
    default:
      return 6;
  }
}

function formatTokenAmount(symbol: string, value: number): string {
  if (!Number.isFinite(value) || value === 0) return "0";
  return value.toFixed(getAmountDecimals(symbol));
}

function TokenSummaryCard({
  tokenTotals,
  className = "",
}: {
  tokenTotals: TokenSweepSummary[];
  className?: string;
}) {
  const visibleTokens = tokenTotals.slice(0, 4);
  const hiddenCount = Math.max(0, tokenTotals.length - visibleTokens.length);

  return (
    <div
      className={`bg-[--color-primary-taint] rounded-2xl p-5 md:p-6 flex flex-col gap-4 border border-[#DDE0FF] ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.08em]">
            TOTAL AMOUNT SWEPT
          </p>
          <p className="text-xs text-gray-500">
            Visible history grouped by token
          </p>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500 whitespace-nowrap">
          {tokenTotals.length} token{tokenTotals.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {visibleTokens.map((token) => (
          <div
            key={token.cryptocurrencyId}
            className="rounded-xl border border-white/70 bg-white/75 px-3 py-2 shadow-[0_1px_0_rgba(255,255,255,0.8)]"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-600">
                {token.symbol}
              </p>
              <p className="text-[10px] font-medium text-gray-500 tabular-nums whitespace-nowrap">
                {token.sweepCount} run{token.sweepCount === 1 ? "" : "s"}
              </p>
            </div>
            <p className="mt-1 font-mono text-sm font-semibold tabular-nums leading-none text-gray-900">
              {formatTokenAmount(token.symbol, token.totalAmount)}{" "}
              <span className="text-[11px] font-medium text-gray-500">
                {token.symbol}
              </span>
            </p>
            <p className="mt-1 truncate text-[10px] text-gray-500">
              {token.name}
            </p>
          </div>
        ))}

        {hiddenCount > 0 && (
          <div className="rounded-xl border border-dashed border-[#C7CAFB] bg-white/50 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-600">
              +{hiddenCount} more
            </p>
            <p className="mt-1 text-[10px] text-gray-500">
              Additional tokens are included in the page totals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const NETWORK_LABELS: Record<string, string> = {
  BTC: "Bitcoin",
  SOLANA: "Solana",
  TRC20: "Tron (TRC-20)",
  ERC20: "Ethereum (ERC-20)",
};

const STATUS_OPTIONS: Array<{ label: string; value?: SweepStatus }> = [
  { label: "All Statuses" },
  { label: "Pending", value: "PENDING" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Partial", value: "PARTIAL" },
  { label: "Failed", value: "FAILED" },
];

function formatWalletAddress(address: string) {
  return `${address.slice(0, 8)}...${address.slice(-8)}`;
}

export default function Treasury() {
  const navigate = useNavigate();
  const { allSupportedCrypto } = useCryptoQuery();
  const { useSweepHistoryInfinite } = useSweepQuery();

  const [filters, setFilters] = useState<Omit<SweepHistoryParams, "page">>({
    size: 20,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWalletScope, setSelectedWalletScope] =
    useState<BalanceSummaryRow | null>(null);

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useSweepHistoryInfinite(filters);

  const sweeps = useMemo(
    () => infiniteData?.pages.flatMap((page) => page.data) ?? [],
    [infiniteData],
  );

  const totalSweeps = infiniteData?.pages[0]?.total ?? 0;
  const completedRuns = useMemo(
    () =>
      sweeps.filter(
        (sweep) => sweep.status === "COMPLETED" || sweep.status === "PARTIAL",
      ).length,
    [sweeps],
  );
  const failedRuns = useMemo(
    () => sweeps.filter((sweep) => sweep.status === "FAILED").length,
    [sweeps],
  );
  const tokenTotals = useMemo(() => {
    const cryptoById = new Map(
      (allSupportedCrypto ?? []).map((crypto) => [crypto.id, crypto] as const),
    );
    const totals = new Map<string, TokenSweepSummary>();

    for (const sweep of sweeps) {
      const amount = Number(sweep.actualTotalAmount);
      if (!Number.isFinite(amount)) continue;

      const crypto = cryptoById.get(sweep.cryptocurrencyId);
      const symbol = crypto?.symbol?.toUpperCase() ?? sweep.network;
      const name = crypto?.name ?? "Unknown token";
      const current = totals.get(sweep.cryptocurrencyId) ?? {
        cryptocurrencyId: sweep.cryptocurrencyId,
        symbol,
        name,
        totalAmount: 0,
        sweepCount: 0,
      };

      current.totalAmount += amount;
      current.sweepCount += 1;
      totals.set(sweep.cryptocurrencyId, current);
    }

    return Array.from(totals.values()).sort(
      (a, b) => b.totalAmount - a.totalAmount || a.symbol.localeCompare(b.symbol),
    );
  }, [allSupportedCrypto, sweeps]);

  function handleRowClick(sweep: SweepRequest) {
    void navigate({
      to: "/dashboard/treasury/$sweepId",
      params: { sweepId: sweep.id },
    });
  }

  function handleWalletCountClick(row: BalanceSummaryRow) {
    setSelectedWalletScope(row);
  }

  const columns: TableColumn<SweepRequest>[] = useMemo(
    () => [
      {
        key: "network",
        header: "Network",
        render: (value) => (
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-indigo-700">
            {String(value)}
          </span>
        ),
      },
      {
        key: "targetAddress",
        header: "Target Wallet",
        render: (value) => (
          <span
            className="font-mono text-xs text-gray-500 whitespace-nowrap"
            title={String(value)}
          >
            {formatWalletAddress(String(value))}
          </span>
        ),
      },
      {
        key: "wallets",
        header: "Wallets Processed",
        render: (_, row) => (
          <span className="whitespace-nowrap tabular-nums">
            <span className="font-semibold text-gray-900">
              {row.totalWalletsSwept + row.totalWalletsFailed + row.totalWalletsSkipped}
            </span>
            <span className="text-gray-500"> / {row.totalWalletsFound}</span>
          </span>
        ),
      },
      {
        key: "actualTotalAmount",
        header: "Amount Swept",
        render: (value) => (
          <span className="font-semibold tabular-nums text-gray-900 whitespace-nowrap">
            {Number(value as string | number).toFixed(6)}
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (value) => <StatusBadge status={String(value)} />,
      },
      {
        key: "createdAt",
        header: "Created",
        render: (value) => (
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {new Date(String(value)).toLocaleString()}
          </span>
        ),
      },
      {
        key: "action",
        header: "",
        render: (_, row) => (
          <Link
            to="/dashboard/treasury/$sweepId"
            params={{ sweepId: row.id }}
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-semibold text-indigo-600 transition-all hover:bg-indigo-50 hover:border-indigo-100"
          >
            Open
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        ),
      },
    ],
    [],
  );

  function updateStatusFilter(value: string) {
    const statusValue = value === "" ? undefined : (value as SweepStatus);
    setFilters((prev) => ({ ...prev, status: statusValue }));
  }

  return (
    <AuthenticatedLayout>
      <PageHeader
        title="Treasury Management"
        subtitle="Move custodial balances into admin treasury wallets"
      />

      <div className="p-6 mx-auto space-y-6">
        <section className="relative overflow-hidden rounded-2xl border border-[#DDE0FF] bg-[--color-primary-taint] p-6 md:p-7 shadow-sm">
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-2">
              <p className="inline-flex items-center rounded-full bg-white/85 border border-[#D6D9FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#575AE5]">
                Treasury Sweep
              </p>
              <h2 className="text-[22px] md:text-[28px] leading-tight font-semibold text-gray-900">
                Sweep user wallet balances with full operational visibility
              </h2>
              <p className="text-[14px] leading-relaxed text-gray-500">
                Preview eligible wallets, confirm the transfer scope, and
                monitor each sweep run from a single control panel.
              </p>
            </div>
            <button
              id="btn-initiate-sweep"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-700"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              Sweep Wallets
            </button>
          </div>
        </section>

        <BalanceSummaryGrid onWalletCountClick={handleWalletCountClick} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
          <StatCard
            className="xl:col-span-3"
            label="Total Sweep Runs"
            value={totalSweeps}
            sub="all recorded treasury jobs"
          />
          <TokenSummaryCard className="xl:col-span-6" tokenTotals={tokenTotals} />
          <StatCard
            className="xl:col-span-3"
            label="Completed Runs"
            value={completedRuns}
            sub={`${failedRuns} failed in visible history`}
          />
        </div>

        <section className="cn-card overflow-hidden border-[#E4E7EC]">
          <div className="flex flex-col gap-4 border-b border-[--color-border] bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-[16px] font-semibold text-[--color-text-primary]">
                Sweep Activity
              </h3>
              <p className="text-xs text-[--color-text-muted] mt-1">
                Review every run, open details, and track completed vs failed
                wallet transfers.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                id="filter-network"
                value={filters.network ?? ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    network: e.target.value || undefined,
                  }))
                }
                className="h-10 min-w-[160px] rounded-lg border border-[--color-border-input] bg-white px-3 text-sm text-[--color-text-primary] outline-none transition-all focus:border-[--color-accent-mid] focus:ring-2 focus:ring-[#DCDDFD]"
              >
                <option value="">All Networks</option>
                {Object.entries(NETWORK_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                id="filter-status"
                value={filters.status ?? ""}
                onChange={(e) => updateStatusFilter(e.target.value)}
                className="h-10 min-w-[160px] rounded-lg border border-[--color-border-input] bg-white px-3 text-sm text-[--color-text-primary] outline-none transition-all focus:border-[--color-accent-mid] focus:ring-2 focus:ring-[#DCDDFD]"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.label} value={option.value ?? ""}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table
              data={sweeps}
              columns={columns}
              loading={isLoading}
              onRowClick={handleRowClick}
              emptyTitle="No sweep history yet"
              emptyMessage="Start your first treasury sweep to populate this table."
              emptyIllustrationSrc="/empty.svg"
            />
          </div>

          {hasNextPage && (
            <div className="flex items-center justify-center border-t border-[--color-border] px-4 py-6 bg-gray-50/30">
              <button
                disabled={isFetchingNextPage}
                onClick={() => void fetchNextPage()}
                className="inline-flex items-center gap-2 rounded-full bg-white border border-[#DDE0FF] px-8 py-2.5 text-sm font-bold text-[#575AE5] shadow-sm transition-all hover:bg-[#F5F5FF] active:scale-95 disabled:opacity-50"
              >
                {isFetchingNextPage ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-[#575AE5]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading more...
                  </span>
                ) : (
                  "Load More Activity"
                )}
              </button>
            </div>
          )}
        </section>
      </div>

      <TreasuryWalletsModal
        open={!!selectedWalletScope}
        scope={selectedWalletScope}
        onClose={() => setSelectedWalletScope(null)}
      />

      <SweepConfigModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </AuthenticatedLayout>
  );
}
