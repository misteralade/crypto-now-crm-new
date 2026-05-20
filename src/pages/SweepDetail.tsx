import { useNavigate, useParams } from '@tanstack/react-router';
import AuthenticatedLayout from '../layout/AuthenticatedLayout.tsx';
import PageHeader from '../components/global/pageHeader.tsx';
import { useSweepQuery } from '../queries/sweep.querries.ts';
import type { SweepWalletResult } from '../api/sweep.api.ts';
import { cn } from '../lib/utils.ts';
import { ArrowLeft, Clock, Globe, Target, Wallet, CheckCircle2, AlertCircle, RefreshCcw, ExternalLink } from 'lucide-react';
import Table, { type TableColumn } from '../components/table.tsx';

const SWEEP_STATUS = {
  COMPLETED: { label: 'Completed', color: '#037847', bg: 'bg-[#E8F8F0]', border: 'border-emerald-200', dot: 'bg-green-500' },
  FAILED: { label: 'Failed', color: '#EB5757', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500' },
  PARTIAL: { label: 'Partial', color: '#B45309', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' },
  IN_PROGRESS: { label: 'In Progress', color: '#575AE5', bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500 animate-pulse' },
  PENDING: { label: 'Pending', color: '#6B6E6B', bg: 'bg-gray-100', border: 'border-gray-200', dot: 'bg-gray-400' },
} as Record<string, { label: string; color: string; bg: string; border: string; dot: string }>;

function SweepStatusBadge({ status }: { status: string }) {
  const s = SWEEP_STATUS[status] ?? { label: status, color: '#6B6E6B', bg: 'bg-gray-100', border: 'border-gray-200', dot: 'bg-gray-400' };
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border tracking-wide uppercase", s.bg, s.border)} style={{ color: s.color }}>
      <span className={cn("w-2 h-2 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

const WALLET_STATUS = {
  success: { label: 'Success', color: 'text-emerald-600', dot: 'bg-emerald-500', bg: 'bg-emerald-50' },
  failed: { label: 'Failed', color: 'text-red-600', dot: 'bg-red-500', bg: 'bg-red-50' },
  skipped: { label: 'Skipped', color: 'text-amber-600', dot: 'bg-amber-500', bg: 'bg-amber-50' },
  pending: { label: 'Pending', color: 'text-gray-500', dot: 'bg-gray-400', bg: 'bg-gray-50' },
} as Record<string, { label: string; color: string; dot: string; bg: string }>;

function shortAddress(address: string) {
  if (!address) return '—';
  return `${address.slice(0, 10)}...${address.slice(-8)}`;
}

export default function SweepDetail() {
  const navigate = useNavigate();
  const { sweepId } = useParams({ strict: false }) as { sweepId: string };
  const { useSweepStatus } = useSweepQuery();
  const { data: sweep, isLoading } = useSweepStatus(sweepId);

  const isTerminal = sweep && ['COMPLETED', 'FAILED', 'PARTIAL'].includes(sweep.status);
  const results: SweepWalletResult[] = [...(sweep?.sweepResults ?? [])].sort(
    (a, b) => (Number(b.balance ?? 0)) - (Number(a.balance ?? 0))
  );

  const progress = sweep?.totalWalletsFound
    ? Math.round(((sweep.totalWalletsSwept + sweep.totalWalletsFailed + sweep.totalWalletsSkipped) / sweep.totalWalletsFound) * 100)
    : 0;
  const processedCount = sweep ? sweep.totalWalletsSwept + sweep.totalWalletsFailed + sweep.totalWalletsSkipped : 0;

  const columns: TableColumn<SweepWalletResult>[] = [
    {
      key: 'walletAddress',
      header: 'Wallet Address',
      render: (val) => (
        <div className="flex items-center gap-2 group">
          <Wallet size={14} className="text-gray-400 group-hover:text-[#575AE5] transition-colors" />
          <span className="font-mono text-xs font-medium text-gray-700">{shortAddress(val as string)}</span>
        </div>
      )
    },
    {
      key: 'balance',
      header: 'Balance',
      render: (val) => (
        <span className="font-mono text-xs font-semibold text-gray-900 tabular-nums">
          {val !== undefined ? Number(val).toFixed(6) : '—'}
        </span>
      )
    },
    {
      key: 'amount',
      header: 'Amount Swept',
      render: (val) => (
        <span className="font-mono text-xs font-bold text-[#575AE5] tabular-nums">
          {val ? Number(val).toFixed(6) : '—'}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Outcome',
      render: (val, row) => {
        const ws = WALLET_STATUS[val as string] ?? WALLET_STATUS.pending;
        return (
          <div className="space-y-1">
            <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase border", ws.bg, ws.color.replace('text-', 'border-').replace('600', '200'))}>
              <span className={cn("h-1.5 w-1.5 rounded-full", ws.dot)} />
              {ws.label}
            </span>
            {row.error && (
              <p className="text-[10px] text-red-500 font-medium max-w-[150px] truncate leading-tight" title={row.error}>
                {row.error}
              </p>
            )}
          </div>
        );
      }
    },
    {
      key: 'txHash',
      header: 'Transaction Hash',
      render: (val) => val ? (
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#575AE5] hover:underline cursor-pointer transition-all" title={val as string}>
          <span>{(val as string).slice(0, 10)}...</span>
          <ExternalLink size={10} />
        </div>
      ) : <span className="text-gray-400">—</span>
    }
  ];

  function openWalletDetails(row: SweepWalletResult) {
    void navigate({
      to: '/dashboard/custodial-wallet/$walletAddress',
      params: { walletAddress: row.walletAddress },
      search: { fromSweepId: sweepId },
    });
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate({ to: '/dashboard/treasury' });
    } else {
      navigate({ to: '/dashboard/treasury' });
    }
  };

  return (
    <AuthenticatedLayout>
      <PageHeader 
        title="Sweep Run Details" 
        subtitle="Real-time execution monitoring and wallet outcomes"
        onBack={handleBack}
      />

      <div className="mx-auto max-w-6xl space-y-8 p-6 pb-20">
        {/* Main Info Card */}
        <section className="relative overflow-hidden rounded-[2rem] border border-[#DDE0FF] bg-white p-1 shadow-[0_20px_50px_-20px_rgba(3,3,77,0.15)]">
          <div className="rounded-[1.8rem] bg-gradient-to-br from-[#F8F9FF] to-white p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-xl bg-[#575AE5]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#575AE5]">
                    <RefreshCcw size={12} className={cn(sweep?.status === 'IN_PROGRESS' && "animate-spin")} />
                    Sweep Execution
                  </div>
                  {sweep && <SweepStatusBadge status={sweep.status} />}
                </div>
                
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-[#03034D] md:text-3xl">
                    Run <span className="text-[#575AE5] font-mono text-lg opacity-80">#{sweep?.id.slice(0, 8) ?? '...'}</span>
                  </h1>
                  <p className="mt-1 text-sm font-medium text-gray-500 flex items-center gap-2">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{sweep?.id ?? sweepId}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:gap-12">
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <Globe size={12} /> Network
                  </p>
                  <p className="text-sm font-black text-[#03034D]">{sweep?.network ?? '—'}</p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <Clock size={12} /> Started
                  </p>
                  <p className="text-sm font-bold text-[#03034D]">
                    {sweep ? new Date(sweep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'}
                  </p>
                </div>
                <div className="col-span-2 space-y-1 sm:col-span-1">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <Target size={12} /> Target Wallet
                  </p>
                  <p className="font-mono text-[11px] font-bold text-[#575AE5] break-all">
                    {shortAddress(sweep?.targetAddress ?? '')}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Section integrated into the card */}
            {sweep && !isTerminal && (
              <div className="mt-8 space-y-3 rounded-2xl bg-[#575AE5]/5 p-4 border border-[#575AE5]/10">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#575AE5]">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[#575AE5]" />
                    Processing Wallets
                  </span>
                  <span className="tabular-nums">{progress}% Complete</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white border border-[#DDE0FF]">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[#575AE5] to-[#7C7FFF] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(87,90,229,0.3)]" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-medium text-gray-500">
                  <p>{processedCount} of {sweep.totalWalletsFound} wallets completed</p>
                  <p className="flex items-center gap-1"><RefreshCcw size={10} className="animate-spin" /> Live updates every 3s</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
          <StatMiniCard label="Total Found" value={sweep?.totalWalletsFound ?? '—'} icon={<Globe size={14} />} color="blue" />
          <StatMiniCard label="Swept" value={sweep?.totalWalletsSwept ?? '—'} icon={<CheckCircle2 size={14} />} color="green" />
          <StatMiniCard label="Failed" value={sweep?.totalWalletsFailed ?? '—'} icon={<AlertCircle size={14} />} color="red" />
          <StatMiniCard label="Skipped" value={sweep?.totalWalletsSkipped ?? '—'} icon={<Clock size={14} />} color="amber" />
          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
             <StatMiniCard 
                label="Amount Swept" 
                value={sweep ? Number(sweep.actualTotalAmount).toFixed(4) : '—'} 
                sub={sweep?.network} 
                icon={<Wallet size={14} />} 
                color="indigo" 
              />
          </div>
        </div>

        {/* Error Callout */}
        {sweep?.failureReason && (
          <div className="flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 shadow-sm">
            <AlertCircle className="mt-0.5 shrink-0" size={20} />
            <div className="space-y-1">
              <p className="font-bold leading-none">Execution Error</p>
              <p className="font-mono text-xs opacity-90">{sweep.failureReason}</p>
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className="space-y-4">
          <div className="flex items-end justify-between px-2">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#03034D]">Wallet Outomes</h3>
              <p className="text-xs font-medium text-gray-500">Detailed breakdown of each address processed in this run</p>
            </div>
            <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
              {results.length} results
            </span>
          </div>
          
          <Table<SweepWalletResult>
            data={results}
            columns={columns}
            loading={isLoading}
            onRowClick={openWalletDetails}
            emptyMessage="No wallet results found for this run"
            className="border border-[#F0F0FF] shadow-xl shadow-blue-500/5"
            theadClassName="bg-gray-50/50 border-b border-gray-100"
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

function StatMiniCard({ label, value, sub, icon, color }: { label: string; value: string | number; sub?: string; icon: React.ReactNode; color: 'blue' | 'green' | 'red' | 'amber' | 'indigo' }) {
  const themes = {
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600', border: 'border-blue-100' },
    green: { bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-100' },
    red: { bg: 'bg-red-50', icon: 'bg-red-100 text-red-600', border: 'border-red-100' },
    amber: { bg: 'bg-amber-50', icon: 'bg-amber-100 text-amber-600', border: 'border-amber-100' },
    indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-100 text-indigo-600', border: 'border-indigo-100' },
  };
  const theme = themes[color];

  return (
    <div className={cn("rounded-2xl border p-4 transition-all hover:shadow-md", theme.bg, theme.border)}>
      <div className="flex items-center justify-between mb-3">
        <div className={cn("p-2 rounded-xl", theme.icon)}>
          {icon}
        </div>
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
        <div className="flex items-baseline gap-1">
          <p className="text-xl font-black text-[#03034D] tabular-nums">{value}</p>
          {sub && <span className="text-[10px] font-bold text-gray-400 uppercase">{sub}</span>}
        </div>
      </div>
    </div>
  );
}
