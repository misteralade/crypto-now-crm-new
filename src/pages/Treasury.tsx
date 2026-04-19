import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import AuthenticatedLayout from '../layout/AuthenticatedLayout.tsx';
import PageHeader from '../components/global/pageHeader.tsx';
import { useSweepQuery } from '../queries/sweep.querries.ts';
import type { SweepRequest, SweepHistoryParams } from '../api/sweep.api.ts';
import SweepConfigModal from '../components/pages/treasury/SweepConfigModal.tsx';

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, { label: string; classes: string }> = {
  COMPLETED: { label: 'Completed', classes: 'bg-[--color-success-bg] text-[--color-success]' },
  FAILED: { label: 'Failed', classes: 'bg-red-50 text-red-600' },
  PARTIAL: { label: 'Partial', classes: 'bg-amber-50 text-amber-600' },
  IN_PROGRESS: { label: 'In Progress', classes: 'bg-blue-50 text-blue-600' },
  PENDING: { label: 'Pending', classes: 'bg-gray-100 text-gray-500' },
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

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-3.5 bg-[--color-border] rounded w-24" />
        </td>
      ))}
    </tr>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="cn-card p-5 flex flex-col gap-1">
      <p className="text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-[--color-text-primary]">{value}</p>
      {sub && <p className="text-xs text-[--color-text-muted]">{sub}</p>}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const NETWORK_LABELS: Record<string, string> = {
  BTC: 'Bitcoin',
  SOLANA: 'Solana',
  TRC20: 'Tron (TRC-20)',
  ERC20: 'Ethereum (ERC-20)',
};

export default function Treasury() {
  const navigate = useNavigate();
  const { useSweepHistory } = useSweepQuery();

  const [filters, setFilters] = useState<SweepHistoryParams>({ page: 1, size: 20 });
  const [modalOpen, setModalOpen] = useState(false);

  const { data: historyData, isLoading } = useSweepHistory(filters);

  const sweeps = historyData?.data ?? [];
  const totalPages = historyData ? Math.ceil(historyData.total / filters.size!) : 1;

  // Derive summary stats from history
  const totalSwept = sweeps.reduce((sum, s) => sum + Number(s.actualTotalAmount), 0);
  const completed = sweeps.filter(s => s.status === 'COMPLETED').length;
  const inProgress = sweeps.filter(s => s.status === 'IN_PROGRESS' || s.status === 'PENDING').length;

  function handleRowClick(sweep: SweepRequest) {
    // @ts-ignore
    void navigate({ to: '/dashboard/treasury/$sweepId', params: { sweepId: sweep.id } });
  }

  return (
    <AuthenticatedLayout>
      <div className="p-6 mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <PageHeader title="Treasury Management" />
            <p className="text-sm text-[--color-text-muted] -mt-4">
              Sweep custodial wallet balances into admin target wallets
            </p>
          </div>
          <button
            id="btn-initiate-sweep"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[--color-primary] text-white text-sm font-semibold hover:bg-[--color-primary-hover] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Initiate Sweep
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Sweeps" value={historyData?.total ?? 0} />
          <StatCard label="Completed" value={completed} />
          <StatCard label="In Progress" value={inProgress} />
          <StatCard label="Total Swept (all-time)" value={totalSwept.toFixed(4)} sub="across all networks" />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            id="filter-network"
            value={filters.network ?? ''}
            onChange={e => setFilters(f => ({ ...f, network: e.target.value || undefined, page: 1 }))}
            className="text-sm border border-[--color-border-input] rounded-lg px-3 py-2 bg-white text-[--color-text-primary] outline-none focus:ring-2 focus:ring-[--color-accent]"
          >
            <option value="">All Networks</option>
            {Object.entries(NETWORK_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>

          <select
            id="filter-status"
            value={filters.status ?? ''}
            onChange={e => setFilters(f => ({ ...f, status: (e.target.value || undefined) as any, page: 1 }))}
            className="text-sm border border-[--color-border-input] rounded-lg px-3 py-2 bg-white text-[--color-text-primary] outline-none focus:ring-2 focus:ring-[--color-accent]"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="PARTIAL">Partial</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        {/* History Table */}
        <div className="cn-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[--color-border] bg-[--color-bg-light]">
                  {['Network', 'Target Wallet', 'Wallets', 'Amount Swept', 'Status', 'Date', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[--color-text-muted] uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[--color-border]">
                {isLoading
                  ? Array.from({ length: 6 }, (_, i) => (
                      <SkeletonRow key={i} />
                    ))
                  : sweeps.length === 0
                    ? (
                      <tr>
                        <td colSpan={7} className="text-center py-16 text-[--color-text-muted]">
                          <div className="flex flex-col items-center gap-3">
                            <svg className="w-10 h-10 text-[--color-accent-light]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <p className="font-medium">No sweep history yet</p>
                            <p className="text-xs">Initiate your first sweep to get started</p>
                          </div>
                        </td>
                      </tr>
                    )
                    : sweeps.map((sweep) => (
                      <tr
                        key={sweep.id}
                        onClick={() => handleRowClick(sweep)}
                        className="hover:bg-[--color-bg-light] cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-[--color-accent-light] text-[--color-primary]">
                            {sweep.network}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-[--color-text-secondary] max-w-[180px] truncate">
                          {sweep.targetAddress}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="font-semibold">{sweep.totalWalletsSwept}</span>
                          <span className="text-[--color-text-muted]">/{sweep.totalWalletsFound}</span>
                        </td>
                        <td className="px-4 py-3.5 font-semibold tabular-nums">
                          {Number(sweep.actualTotalAmount).toFixed(6)}
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={sweep.status} />
                        </td>
                        <td className="px-4 py-3.5 text-[--color-text-muted] text-xs whitespace-nowrap">
                          {new Date(sweep.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5">
                          <svg className="w-4 h-4 text-[--color-text-muted]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[--color-border]">
              <p className="text-xs text-[--color-text-muted]">
                Page {filters.page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={filters.page === 1}
                  onClick={() => setFilters(f => ({ ...f, page: (f.page ?? 1) - 1 }))}
                  className="px-3 py-1.5 text-xs rounded-lg border border-[--color-border] disabled:opacity-40 hover:bg-[--color-bg-light] transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={filters.page === totalPages}
                  onClick={() => setFilters(f => ({ ...f, page: (f.page ?? 1) + 1 }))}
                  className="px-3 py-1.5 text-xs rounded-lg border border-[--color-border] disabled:opacity-40 hover:bg-[--color-bg-light] transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sweep Config Modal */}
      <SweepConfigModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </AuthenticatedLayout>
  );
}
