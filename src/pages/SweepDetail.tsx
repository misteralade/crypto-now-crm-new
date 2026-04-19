import { useParams } from '@tanstack/react-router';
import AuthenticatedLayout from '../layout/AuthenticatedLayout.tsx';
import PageHeader from '../components/global/pageHeader.tsx';
import { useSweepQuery } from '../queries/sweep.querries.ts';
import type { SweepWalletResult } from '../api/sweep.api.ts';

// ─── Status badge ─────────────────────────────────────────────────────────────

const SWEEP_STATUS = {
  COMPLETED: { label: 'Completed', dot: 'bg-green-500', badge: 'bg-[--color-success-bg] text-[--color-success]' },
  FAILED: { label: 'Failed', dot: 'bg-red-500', badge: 'bg-red-50 text-red-600' },
  PARTIAL: { label: 'Partial', dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-600' },
  IN_PROGRESS: { label: 'In Progress', dot: 'bg-blue-500 animate-pulse', badge: 'bg-blue-50 text-blue-600' },
  PENDING: { label: 'Pending', dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-500' },
} as Record<string, { label: string; dot: string; badge: string }>;

function SweepStatusBadge({ status }: { status: string }) {
  const s = SWEEP_STATUS[status] ?? { label: status, dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-500' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${s.badge}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ─── Wallet Result Row status ─────────────────────────────────────────────────

const WALLET_STATUS = {
  success: { label: 'Success', classes: 'text-[--color-success]' },
  failed: { label: 'Failed', classes: 'text-red-600' },
  skipped: { label: 'Skipped', classes: 'text-amber-600' },
  pending: { label: 'Pending', classes: 'text-gray-400' },
} as Record<string, { label: string; classes: string }>;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function StatSkeleton() {
  return <div className="h-16 rounded-xl bg-[--color-border] animate-pulse" />;
}

// ─── Detail Page ──────────────────────────────────────────────────────────────

export default function SweepDetail() {
  // sweepId comes from route param
  const { sweepId } = useParams({ strict: false }) as { sweepId: string };
  const { useSweepStatus } = useSweepQuery();
  const { data: sweep, isLoading } = useSweepStatus(sweepId);

  const isTerminal = sweep && ['COMPLETED', 'FAILED', 'PARTIAL'].includes(sweep.status);
  const results: SweepWalletResult[] = sweep?.sweepResults ?? [];

  const stats = [
    { label: 'Wallets Found', value: sweep?.totalWalletsFound ?? '-' },
    { label: 'Swept', value: sweep?.totalWalletsSwept ?? '-', highlight: true },
    { label: 'Skipped', value: sweep?.totalWalletsSkipped ?? '-' },
    { label: 'Failed', value: sweep?.totalWalletsFailed ?? '-', danger: true },
    { label: 'Amount Swept', value: sweep ? `${Number(sweep.actualTotalAmount).toFixed(6)}` : '-' },
    { label: 'Target Wallet', value: sweep ? sweep.targetAddress.slice(0, 8) + '…' + sweep.targetAddress.slice(-6) : '-' },
  ];

  const progress = sweep?.totalWalletsFound
    ? Math.round(((sweep.totalWalletsSwept + sweep.totalWalletsFailed + sweep.totalWalletsSkipped) / sweep.totalWalletsFound) * 100)
    : 0;

  return (
    <AuthenticatedLayout>
      <div className="p-6 mx-auto space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <PageHeader title="Sweep Details" />
            {sweep && (
              <p className="text-xs font-mono text-[--color-text-muted] -mt-4">{sweep.id}</p>
            )}
          </div>
          {sweep && <SweepStatusBadge status={sweep.status} />}
        </div>

        {/* Info strip */}
        {sweep && (
          <div className="cn-card p-4 flex flex-wrap gap-6 text-sm">
            <div>
              <p className="text-xs text-[--color-text-muted] mb-0.5">Network</p>
              <span className="font-mono px-2 py-0.5 rounded bg-[--color-accent-light] text-[--color-primary] text-xs font-semibold">
                {sweep.network}
              </span>
            </div>
            <div>
              <p className="text-xs text-[--color-text-muted] mb-0.5">Initiated</p>
              <p className="font-medium">{new Date(sweep.createdAt).toLocaleString()}</p>
            </div>
            {sweep.startedAt && (
              <div>
                <p className="text-xs text-[--color-text-muted] mb-0.5">Started</p>
                <p className="font-medium">{new Date(sweep.startedAt).toLocaleString()}</p>
              </div>
            )}
            {sweep.completedAt && (
              <div>
                <p className="text-xs text-[--color-text-muted] mb-0.5">Completed</p>
                <p className="font-medium">{new Date(sweep.completedAt).toLocaleString()}</p>
              </div>
            )}
          </div>
        )}

        {/* Progress bar */}
        {sweep && !isTerminal && (
          <div className="cn-card p-4 space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[--color-text-primary] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Processing wallets…
              </span>
              <span className="font-semibold tabular-nums">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-[--color-border] overflow-hidden">
              <div
                className="h-full rounded-full bg-[--color-accent-mid] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-[--color-text-muted]">
              {sweep.totalWalletsSwept + sweep.totalWalletsFailed + sweep.totalWalletsSkipped} of {sweep.totalWalletsFound} wallets processed — auto-refreshing every 3s
            </p>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <StatSkeleton key={i} />)
            : stats.map(({ label, value, highlight, danger }) => (
                <div key={label} className={`cn-card p-4 ${highlight ? 'border-[--color-success] border' : ''} ${danger ? 'border-red-200 border' : ''}`}>
                  <p className="text-xs text-[--color-text-muted] mb-1">{label}</p>
                  <p className={`text-lg font-bold ${highlight ? 'text-[--color-success]' : danger ? 'text-red-600' : 'text-[--color-text-primary]'}`}>
                    {value}
                  </p>
                </div>
              ))
          }
        </div>

        {/* Failure banner */}
        {sweep?.failureReason && (
          <div className="cn-card border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold mb-1">Sweep failed</p>
            <p className="font-mono text-xs">{sweep.failureReason}</p>
          </div>
        )}

        {/* Per-wallet results table */}
        {results.length > 0 && (
          <div className="cn-card overflow-hidden">
            <div className="px-4 py-3.5 border-b border-[--color-border] flex items-center justify-between">
              <h3 className="font-semibold text-sm text-[--color-text-primary]">Wallet Results</h3>
              <span className="text-xs text-[--color-text-muted]">{results.length} wallets</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[--color-border] bg-[--color-bg-light]">
                    {['Wallet Address', 'Balance', 'Amount', 'Status', 'Tx Hash'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[--color-text-muted] uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[--color-border]">
                  {results.map((r: SweepWalletResult, i: number) => {
                    const ws = WALLET_STATUS[r.status] ?? { label: r.status, classes: 'text-gray-500' };
                    return (
                      <tr key={i} className="hover:bg-[--color-bg-light] transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-[--color-text-secondary] max-w-[200px] truncate" title={r.walletAddress}>
                          {r.walletAddress.slice(0, 10)}…{r.walletAddress.slice(-8)}
                        </td>
                        <td className="px-4 py-3 tabular-nums text-[--color-text-secondary]">
                          {r.balance !== undefined ? r.balance.toFixed(6) : '—'}
                        </td>
                        <td className="px-4 py-3 tabular-nums font-semibold">
                          {r.amount ? r.amount.toFixed(6) : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-semibold ${ws.classes}`}>{ws.label}</span>
                          {r.error && (
                            <p className="text-xs text-[--color-text-muted] mt-0.5 max-w-[200px] truncate" title={r.error}>
                              {r.error}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          {r.txHash
                            ? <span className="text-[--color-accent-mid] hover:underline cursor-pointer" title={r.txHash}>{r.txHash.slice(0, 12)}…</span>
                            : <span className="text-[--color-text-muted]">—</span>
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col gap-3 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-[--color-border]" style={{ animationDelay: `${i * 40}ms` }} />
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
