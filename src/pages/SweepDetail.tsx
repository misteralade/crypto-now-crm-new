import { useParams } from '@tanstack/react-router';
import AuthenticatedLayout from '../layout/AuthenticatedLayout.tsx';
import PageHeader from '../components/global/pageHeader.tsx';
import { useSweepQuery } from '../queries/sweep.querries.ts';
import type { SweepWalletResult } from '../api/sweep.api.ts';

const SWEEP_STATUS = {
  COMPLETED: { label: 'Completed', dot: 'bg-green-500', badge: 'bg-[--color-success-bg] text-[--color-success] border border-emerald-200' },
  FAILED: { label: 'Failed', dot: 'bg-red-500', badge: 'bg-red-50 text-red-600 border border-red-200' },
  PARTIAL: { label: 'Partial', dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-600 border border-amber-200' },
  IN_PROGRESS: { label: 'In Progress', dot: 'bg-blue-500 animate-pulse', badge: 'bg-blue-50 text-blue-600 border border-blue-200' },
  PENDING: { label: 'Pending', dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-500 border border-gray-200' },
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

const WALLET_STATUS = {
  success: { label: 'Success', classes: 'text-[--color-success]', dot: 'bg-emerald-500' },
  failed: { label: 'Failed', classes: 'text-red-600', dot: 'bg-red-500' },
  skipped: { label: 'Skipped', classes: 'text-amber-600', dot: 'bg-amber-500' },
  pending: { label: 'Pending', classes: 'text-gray-500', dot: 'bg-gray-400' },
} as Record<string, { label: string; classes: string; dot: string }>;

function StatSkeleton() {
  return <div className="h-20 rounded-xl bg-[--color-border] animate-pulse" />;
}

function shortAddress(address: string) {
  return `${address.slice(0, 10)}...${address.slice(-8)}`;
}

export default function SweepDetail() {
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
    { label: 'Target Wallet', value: sweep ? sweep.targetAddress.slice(0, 8) + '...' + sweep.targetAddress.slice(-6) : '-' },
  ];

  const progress = sweep?.totalWalletsFound
    ? Math.round(((sweep.totalWalletsSwept + sweep.totalWalletsFailed + sweep.totalWalletsSkipped) / sweep.totalWalletsFound) * 100)
    : 0;
  const processedCount = sweep ? sweep.totalWalletsSwept + sweep.totalWalletsFailed + sweep.totalWalletsSkipped : 0;

  return (
    <AuthenticatedLayout>
      <PageHeader title="Sweep Details" subtitle="Monitor status, progress, and individual wallet transfer outcomes" />

      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <section className="rounded-2xl border border-[#DDE0FF] bg-gradient-to-r from-[#ECECFF] via-[#F5F6FF] to-white p-5 shadow-[0_18px_40px_-30px_rgba(3,3,77,0.45)] md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <p className="inline-flex rounded-full border border-[#D6D9FF] bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#575AE5]">
                Sweep Run
              </p>
              <h2 className="text-xl font-semibold text-[--color-text-primary]">Run ID: <span className="font-mono text-sm text-[#575AE5]">{sweep?.id ?? sweepId}</span></h2>
              <p className="text-sm text-[#4B4E60]">
                Review execution progress and inspect wallet-level outcomes in real time.
              </p>
            </div>
            {sweep && <SweepStatusBadge status={sweep.status} />}
          </div>

          {sweep && (
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="text-xs text-[#667085]">Network</p>
                <p className="mt-1 inline-flex rounded-full bg-[--color-accent-light] px-2.5 py-1 text-xs font-mono font-semibold text-[--color-primary]">
                  {sweep.network}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#667085]">Target wallet</p>
                <p className="mt-1 font-mono text-[12px] text-[--color-text-primary]" title={sweep.targetAddress}>
                  {shortAddress(sweep.targetAddress)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#667085]">Created</p>
                <p className="mt-1 text-sm font-medium text-[--color-text-primary]">
                  {new Date(sweep.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#667085]">Completed</p>
                <p className="mt-1 text-sm font-medium text-[--color-text-primary]">
                  {sweep.completedAt ? new Date(sweep.completedAt).toLocaleString() : 'Not yet completed'}
                </p>
              </div>
            </div>
          )}
        </section>

        {sweep && !isTerminal && (
          <section className="cn-card space-y-3 border-[#E4E7EC] p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-[--color-text-primary]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                Sweep is currently processing wallets
              </span>
              <span className="font-semibold tabular-nums text-[--color-primary]">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[--color-border]">
              <div className="h-full rounded-full bg-[--color-accent-mid] transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-[--color-text-muted]">
              {processedCount} of {sweep.totalWalletsFound} wallets processed. This page refreshes automatically every 3 seconds.
            </p>
          </section>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <StatSkeleton key={i} />)
            : stats.map(({ label, value, highlight, danger }) => (
                <div key={label} className={`cn-card border p-4 ${highlight ? 'border-emerald-200 bg-emerald-50/40' : ''} ${danger ? 'border-red-200 bg-red-50/40' : ''}`}>
                  <p className="mb-1 text-xs text-[--color-text-muted]">{label}</p>
                  <p className={`text-lg font-semibold ${highlight ? 'text-[--color-success]' : danger ? 'text-red-600' : 'text-[--color-text-primary]'}`}>
                    {value}
                  </p>
                </div>
              ))
          }
        </div>

        {sweep?.failureReason && (
          <div className="cn-card border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="mb-1 font-semibold">Sweep failed</p>
            <p className="font-mono text-xs">{sweep.failureReason}</p>
          </div>
        )}

        {results.length > 0 && (
          <section className="cn-card overflow-hidden border-[#E4E7EC]">
            <div className="flex items-center justify-between border-b border-[--color-border] px-5 py-3.5">
              <h3 className="text-sm font-semibold text-[--color-text-primary]">Wallet Results</h3>
              <span className="text-xs text-[--color-text-muted]">{results.length} wallets</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[--color-border] bg-[--color-bg-light]">
                    {['Wallet Address', 'Balance', 'Amount', 'Status', 'Tx Hash'].map((header) => (
                      <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[--color-text-muted] whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[--color-border]">
                  {results.map((r: SweepWalletResult, i: number) => {
                    const ws = WALLET_STATUS[r.status] ?? { label: r.status, classes: 'text-gray-500', dot: 'bg-gray-400' };
                    return (
                      <tr key={i} className="transition-colors hover:bg-[--color-bg-light]">
                        <td className="px-4 py-3 font-mono text-xs text-[--color-text-secondary] max-w-[200px] truncate" title={r.walletAddress}>
                          {shortAddress(r.walletAddress)}
                        </td>
                        <td className="px-4 py-3 tabular-nums text-[--color-text-secondary]">
                          {r.balance !== undefined ? r.balance.toFixed(6) : '—'}
                        </td>
                        <td className="px-4 py-3 tabular-nums font-semibold">
                          {r.amount ? r.amount.toFixed(6) : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 font-semibold ${ws.classes}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${ws.dot}`} />
                            {ws.label}
                          </span>
                          {r.error && (
                            <p className="text-xs text-[--color-text-muted] mt-0.5 max-w-[200px] truncate" title={r.error}>
                              {r.error}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          {r.txHash
                            ? <span className="cursor-pointer text-[--color-accent-mid] hover:underline" title={r.txHash}>{r.txHash.slice(0, 12)}...</span>
                            : <span className="text-[--color-text-muted]">—</span>
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {isLoading && (
          <div className="flex animate-pulse flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-[--color-border]" style={{ animationDelay: `${i * 40}ms` }} />
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
