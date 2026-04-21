import { useMemo, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import AuthenticatedLayout from '../layout/AuthenticatedLayout.tsx';
import PageHeader from '../components/global/pageHeader.tsx';
import { useSweepQuery } from '../queries/sweep.querries.ts';
import type { SweepHistoryParams, SweepRequest, SweepStatus } from '../api/sweep.api.ts';
import SweepConfigModal from '../components/pages/treasury/SweepConfigModal.tsx';

const STATUS_MAP: Record<string, { label: string; classes: string }> = {
  COMPLETED: { label: 'Completed', classes: 'bg-[--color-success-bg] text-[--color-success] border border-emerald-200' },
  FAILED: { label: 'Failed', classes: 'bg-red-50 text-red-600 border border-red-200' },
  PARTIAL: { label: 'Partial', classes: 'bg-amber-50 text-amber-600 border border-amber-200' },
  IN_PROGRESS: { label: 'In Progress', classes: 'bg-blue-50 text-blue-600 border border-blue-200' },
  PENDING: { label: 'Pending', classes: 'bg-gray-100 text-gray-600 border border-gray-200' },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { label: status, classes: 'bg-gray-100 text-gray-500' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.classes}`}>
      {status === 'IN_PROGRESS' && (
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
      )}
      {s.label}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-3.5 bg-[--color-border] rounded w-24" />
        </td>
      ))}
    </tr>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="cn-card p-5 md:p-6 flex flex-col gap-1.5 shadow-[0_8px_28px_-20px_rgba(3,3,77,0.35)]">
      <p className="text-[11px] font-semibold text-[--color-text-muted] uppercase tracking-[0.08em]">{label}</p>
      <p className="text-2xl md:text-[30px] font-semibold leading-none text-[--color-text-primary]">{value}</p>
      {sub && <p className="text-xs text-[--color-text-muted]">{sub}</p>}
    </div>
  );
}

const NETWORK_LABELS: Record<string, string> = {
  BTC: 'Bitcoin',
  SOLANA: 'Solana',
  TRC20: 'Tron (TRC-20)',
  ERC20: 'Ethereum (ERC-20)',
};

const STATUS_OPTIONS: Array<{ label: string; value?: SweepStatus }> = [
  { label: 'All Statuses' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Partial', value: 'PARTIAL' },
  { label: 'Failed', value: 'FAILED' },
];

function formatWalletAddress(address: string) {
  return `${address.slice(0, 8)}...${address.slice(-8)}`;
}

export default function Treasury() {
  const navigate = useNavigate();
  const { useSweepHistory } = useSweepQuery();

  const [filters, setFilters] = useState<SweepHistoryParams>({ page: 1, size: 20 });
  const [modalOpen, setModalOpen] = useState(false);

  const { data: historyData, isLoading } = useSweepHistory(filters);

  const sweeps = useMemo(() => historyData?.data ?? [], [historyData]);
  const totalPages = useMemo(
    () => (historyData && filters.size ? Math.ceil(historyData.total / filters.size) : 1),
    [filters.size, historyData],
  );
  const totalSweeps = historyData?.total ?? 0;
  const totalSwept = useMemo(
    () => sweeps.reduce((sum, sweep) => sum + Number(sweep.actualTotalAmount), 0),
    [sweeps],
  );
  const successRate = useMemo(() => {
    if (sweeps.length === 0) return 0;
    const completedCount = sweeps.filter((sweep) => sweep.status === 'COMPLETED').length;
    return Math.round((completedCount / sweeps.length) * 100);
  }, [sweeps]);
  const inFlight = useMemo(
    () => sweeps.filter((sweep) => sweep.status === 'IN_PROGRESS' || sweep.status === 'PENDING').length,
    [sweeps],
  );

  function handleRowClick(sweep: SweepRequest) {
    void navigate({ to: '/dashboard/treasury/$sweepId', params: { sweepId: sweep.id } });
  }

  function updateStatusFilter(value: string) {
    const statusValue = value === '' ? undefined : (value as SweepStatus);
    setFilters((prev) => ({ ...prev, status: statusValue, page: 1 }));
  }

  return (
    <AuthenticatedLayout>
      <PageHeader title="Treasury Management" subtitle="Move custodial balances into admin treasury wallets" />

      <div className="p-6 mx-auto space-y-6">
        <section className="relative overflow-hidden rounded-2xl border border-[#DDDFFC] bg-gradient-to-r from-[#EBECFF] via-[#F3F4FF] to-white p-6 md:p-7 shadow-[0_18px_40px_-28px_rgba(3,3,77,0.45)]">
          <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[#D9DBFF]/60 blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 translate-x-8 translate-y-8 rounded-full bg-[#575AE5]/10 blur-xl" />

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-2">
              <p className="inline-flex items-center rounded-full border border-[#D8DBFF] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#575AE5]">
                Treasury Sweep
              </p>
              <h2 className="text-[22px] md:text-[28px] leading-tight font-semibold text-[#0E0F0C]">
                Sweep user wallet balances with full operational visibility
              </h2>
              <p className="text-[14px] leading-relaxed text-[#4C4F5D]">
                Preview eligible wallets, confirm the transfer scope, and monitor each sweep run from a single control panel.
              </p>
            </div>
            <button
              id="btn-initiate-sweep"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[--color-primary] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[--color-primary-hover] hover:shadow-[0_12px_25px_-18px_rgba(3,3,77,0.7)]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Initiate New Sweep
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Total Sweep Runs" value={totalSweeps} sub="all recorded treasury jobs" />
          <StatCard label="In Progress" value={inFlight} sub="currently pending or processing" />
          <StatCard label="Success Rate" value={`${successRate}%`} sub="based on visible sweep history" />
          <StatCard label="Total Amount Swept" value={totalSwept.toFixed(4)} sub="sum of actual swept amounts" />
        </div>

        <section className="cn-card overflow-hidden border-[#E4E7EC]">
          <div className="flex flex-col gap-4 border-b border-[--color-border] bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-[16px] font-semibold text-[--color-text-primary]">Sweep Activity</h3>
              <p className="text-xs text-[--color-text-muted] mt-1">
                Review every run, open details, and track completed vs failed wallet transfers.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                id="filter-network"
                value={filters.network ?? ''}
                onChange={(e) => setFilters((prev) => ({ ...prev, network: e.target.value || undefined, page: 1 }))}
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
                value={filters.status ?? ''}
                onChange={(e) => updateStatusFilter(e.target.value)}
                className="h-10 min-w-[160px] rounded-lg border border-[--color-border-input] bg-white px-3 text-sm text-[--color-text-primary] outline-none transition-all focus:border-[--color-accent-mid] focus:ring-2 focus:ring-[#DCDDFD]"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.label} value={option.value ?? ''}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[--color-border] bg-[--color-bg-light]">
                  {['Network', 'Target Wallet', 'Wallets Processed', 'Amount Swept', 'Status', 'Created', ''].map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[--color-text-muted] whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[--color-border]">
                {isLoading ? (
                  Array.from({ length: 6 }, (_, idx) => <SkeletonRow key={idx} />)
                ) : sweeps.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <div className="mx-auto max-w-sm space-y-2">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#ECECFF]">
                          <svg className="h-5 w-5 text-[#575AE5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-[--color-text-primary]">No sweep history yet</p>
                        <p className="text-xs text-[--color-text-muted]">Start your first treasury sweep to populate this table.</p>
                        <button
                          onClick={() => setModalOpen(true)}
                          className="mt-2 inline-flex items-center gap-1 rounded-lg border border-[#D7DAFF] bg-white px-3 py-2 text-xs font-semibold text-[#575AE5] hover:bg-[#F6F6FF]"
                        >
                          Initiate Sweep
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sweeps.map((sweep) => (
                    <tr
                      key={sweep.id}
                      onClick={() => handleRowClick(sweep)}
                      className="group cursor-pointer transition-colors hover:bg-[--color-bg-light]"
                    >
                      <td className="px-4 py-3.5">
                        <span className="rounded-full bg-[--color-accent-light] px-2.5 py-1 font-mono text-[11px] font-semibold text-[--color-primary]">
                          {sweep.network}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs text-[--color-text-secondary]" title={sweep.targetAddress}>
                          {formatWalletAddress(sweep.targetAddress)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-[--color-text-primary]">{sweep.totalWalletsSwept}</span>
                        <span className="text-[--color-text-muted]"> / {sweep.totalWalletsFound}</span>
                      </td>
                      <td className="px-4 py-3.5 font-semibold tabular-nums text-[--color-text-primary]">
                        {Number(sweep.actualTotalAmount).toFixed(6)}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={sweep.status} />
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[--color-text-muted] whitespace-nowrap">
                        {new Date(sweep.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5">
                        <Link
                          to="/dashboard/treasury/$sweepId"
                          params={{ sweepId: sweep.id }}
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-semibold text-[--color-primary] transition-all group-hover:border-[#D8DAFF] group-hover:bg-white"
                        >
                          Open
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[--color-border] px-4 py-3">
              <p className="text-xs text-[--color-text-muted]">
                Page {filters.page ?? 1} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={(filters.page ?? 1) <= 1}
                  onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, (prev.page ?? 1) - 1) }))}
                  className="rounded-lg border border-[--color-border] px-3 py-1.5 text-xs font-medium text-[--color-text-secondary] transition-colors hover:bg-[--color-bg-light] disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={(filters.page ?? 1) >= totalPages}
                  onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))}
                  className="rounded-lg border border-[--color-border] px-3 py-1.5 text-xs font-medium text-[--color-text-secondary] transition-colors hover:bg-[--color-bg-light] disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      <SweepConfigModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </AuthenticatedLayout>
  );
}
