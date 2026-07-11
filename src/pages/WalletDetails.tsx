import { useMemo } from "react";
import {
  Copy,
  ExternalLink,
  RotateCcw,
  Wallet,
} from "lucide-react";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Switch } from "../components/ui/switch.tsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import PageHeader from "../components/global/pageHeader.tsx";
import {
  useAdminCustodialWalletDetailsQuery,
  useAdminRefreshCustodialWalletBalanceMutation,
  useAdminToggleCustodialWalletActiveMutation,
} from "../queries/crypto.querries.ts";
import { useSweepQuery } from "../queries/sweep.querries.ts";
import { ROUTES } from "../util/constants.util.ts";
import { cn } from "../lib/utils.ts";

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "Not available";
  return new Date(value).toLocaleString();
}

function formatAmount(value: string | number | null | undefined) {
  if (value == null || value === "") return "0.000000";
  return Number(value).toFixed(6).replace(/\.?0+$/, "");
}

function DetailCard({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 text-sm font-medium text-gray-900",
          mono && "font-mono break-all"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function getEnvironmentMeta(
  environment: "testnet" | "mainnet" | undefined
) {
  if (!environment) {
    return null;
  }

  if (environment === "mainnet") {
    return {
      label: "Mainnet",
      sectionClass:
        "border-[#CFE8D8] bg-[linear-gradient(180deg,#F6FFF9_0%,#FFFFFF_100%)] shadow-[0_18px_40px_-30px_rgba(3,120,71,0.25)]",
      badgeClass:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  return {
    label: "Testnet",
    sectionClass:
      "border-amber-200 bg-[linear-gradient(180deg,#FFFDF4_0%,#FFFFFF_100%)] shadow-[0_18px_40px_-30px_rgba(160,112,0,0.25)]",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
  };
}

export default function WalletDetails() {
  const navigate = useNavigate();
  const { walletAddress } = useParams({ strict: false }) as {
    walletAddress: string;
  };
  const { fromSweepId } = useSearch({
    from: "/dashboard/custodial-wallet/$walletAddress",
  }) as {
    fromSweepId?: string;
  };

  const { data: walletDetails, isLoading } =
    useAdminCustodialWalletDetailsQuery(walletAddress);
  const refreshMutation =
    useAdminRefreshCustodialWalletBalanceMutation(walletAddress);
  const toggleActiveMutation =
    useAdminToggleCustodialWalletActiveMutation(walletAddress);
  const { useSweepStatus } = useSweepQuery();
  const { data: sweep } = useSweepStatus(fromSweepId);

  const sweepResult = useMemo(
    () =>
      sweep?.sweepResults?.find(
        (result) => result.walletAddress === walletAddress
      ) ?? null,
    [sweep, walletAddress]
  );
  const cachedBalanceUpdatedAt = walletDetails?.wallet.cachedBalanceUpdatedAt;
  const isWalletBalanceStale = !cachedBalanceUpdatedAt
    ? true
    : Date.now() - new Date(cachedBalanceUpdatedAt).getTime() >
      6 * 60 * 60 * 1000;
  const env = getEnvironmentMeta(walletDetails?.wallet.blockchainEnvironment);

  const copyAddress = async () => {
    if (!walletDetails?.wallet.walletAddress) return;
    await navigator.clipboard.writeText(walletDetails.wallet.walletAddress);
  };

  const refreshBalance = () => {
    void refreshMutation.mutateAsync();
  };

  const goBack = () => {
    if (fromSweepId) {
      void navigate({
        to: "/dashboard/treasury/$sweepId",
        params: { sweepId: fromSweepId },
      });
      return;
    }

    void navigate({ to: ROUTES.TREASURY });
  };

  return (
    <AuthenticatedLayout>
      <PageHeader
        title="Wallet Details"
        subtitle="Inspect the wallet, owner context, and sweep outcome from one admin view"
        onBack={goBack}
      />

      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <section
          className={`rounded-2xl border p-5 md:p-6 ${
            env?.sectionClass ?? "border-[#DDE0FF] bg-[--color-primary-taint] shadow-[0_18px_40px_-30px_rgba(3,3,77,0.35)]"
          }`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#D6D9FF] bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#575AE5]">
                <Wallet className="h-3.5 w-3.5" />
                Custodial Wallet
              </p>
              <h2 className="text-balance text-2xl font-semibold text-gray-900">
                {walletDetails?.cryptocurrency?.symbol ?? "Wallet"} on{" "}
                {walletDetails?.wallet.network ?? "network"}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                 {env && (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${env.badgeClass}`}
                  >
                    {env.label}
                  </span>
                )}
                <p className="text-pretty text-xs text-[#667085]">
                  Review the wallet balance, ownership details, and the sweep
                  row that led here.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {walletDetails && (
                <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-gray-700 shadow-sm">
                  <span className="text-gray-400">Status:</span>
                  <Switch
                    checked={walletDetails.wallet.isActive}
                    onCheckedChange={(checked) => {
                      toggleActiveMutation.mutate(checked);
                    }}
                    disabled={toggleActiveMutation.isPending}
                    className="scale-[0.7] -mx-1"
                  />
                  <span className={walletDetails.wallet.isActive ? "text-emerald-600" : "text-red-500"}>
                    {walletDetails.wallet.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              )}

              {fromSweepId && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D6D9FF] bg-white px-2.5 py-1 text-xs font-semibold text-[#575AE5]">
                  From sweep run
                </span>
              )}

              {isWalletBalanceStale && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  Balance may be stale
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/60 bg-white/75 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
                    Current balance
                  </p>
                  <p className="mt-2 text-2xl font-semibold tabular-nums text-gray-900">
                    {isLoading
                      ? "..."
                      : formatAmount(walletDetails?.wallet.cachedBalance)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={refreshBalance}
                  disabled={refreshMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#DDE0FF] px-2.5 py-1 text-xs font-semibold text-[#03034D] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  title="Refresh this wallet's cached balance"
                  aria-label="Refresh this wallet's cached balance"
                >
                  <RotateCcw
                    className={cn(
                      "h-3.5 w-3.5",
                      refreshMutation.isPending && "animate-spin"
                    )}
                  />
                  Refresh
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {walletDetails?.wallet.cachedBalanceUpdatedAt
                  ? `Last refreshed ${formatDate(
                      walletDetails.wallet.cachedBalanceUpdatedAt
                    )}`
                  : "This wallet has not been refreshed yet."}
              </p>
            </div>

            <div className="rounded-2xl border border-white/60 bg-white/75 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
                Sweep amount
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-gray-900">
                {sweepResult ? formatAmount(sweepResult.amount) : "—"}
              </p>
              <p className="text-xs text-gray-500">
                Amount moved in the selected sweep
              </p>
            </div>

            <div className="rounded-2xl border border-white/60 bg-white/75 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
                Sweep status
              </p>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {sweepResult?.status ?? sweep?.status ?? "—"}
              </p>
              <p className="text-xs text-gray-500">
                {sweepResult?.error
                  ? "Review failure details below"
                  : "Wallet row outcome"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/60 bg-white/75 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
                Deposits
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-gray-900">
                {walletDetails?.wallet.totalDepositsCount ?? "—"}
              </p>
              <p className="text-xs text-gray-500">
                Confirmed deposits to this wallet
              </p>
            </div>
          </div>
        </section>

        {walletDetails?.wallet && (
          <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Wallet Address
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Full address, ready for copy and review.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={copyAddress}
                    className="inline-flex items-center gap-2 rounded-full border border-[#DDE0FF] px-3 py-1.5 text-xs font-semibold text-[#03034D] transition-colors hover:bg-[#F8F8FF]"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </button>
                </div>
                <p className="mt-4 break-all rounded-2xl border border-[#EEF0FF] bg-[#FAFAFF] p-4 font-mono text-sm text-gray-900">
                  {walletDetails.wallet.walletAddress}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailCard
                  label="User Email"
                  value={walletDetails.user?.email ?? "Unknown"}
                />
                <DetailCard
                  label="User Name"
                  value={
                    `${walletDetails.user?.profile?.firstName ?? ""} ${
                      walletDetails.user?.profile?.lastName ?? ""
                    }`.trim() || "Unavailable"
                  }
                />
                <DetailCard
                  label="User ID"
                  value={walletDetails.wallet.userId}
                  mono
                />
                <DetailCard
                  label="Wallet ID"
                  value={walletDetails.wallet.id}
                  mono
                />
                <DetailCard
                  label="Derivation Path"
                  value={walletDetails.wallet.derivationPath ?? "Not available"}
                  mono
                />
                <DetailCard
                  label="Webhook Provider"
                  value={walletDetails.wallet.webhookProvider}
                />
                <DetailCard
                  label="Network"
                  value={walletDetails.wallet.network}
                />
                <DetailCard
                  label="Cached Balance Source"
                  value={walletDetails.wallet.cachedBalanceSource}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900">
                  Asset Summary
                </h3>
                <div className="mt-4 space-y-3">
                  <DetailCard
                    label="Crypto"
                    value={`${
                      walletDetails.cryptocurrency?.name ?? "Unknown"
                    } (${walletDetails.cryptocurrency?.symbol ?? "-"})`}
                  />
                  <DetailCard
                    label="Crypto ID"
                    value={walletDetails.wallet.cryptocurrencyId}
                    mono
                  />
                  <DetailCard
                    label="Current Buy Rate"
                    value={walletDetails.cryptocurrency?.buyRate ?? "-"}
                  />
                  <DetailCard
                    label="Current Sell Rate"
                    value={walletDetails.cryptocurrency?.sellRate ?? "-"}
                  />
                  <DetailCard
                    label="Created"
                    value={formatDate(walletDetails.wallet.createdAt)}
                  />
                  <DetailCard
                    label="Updated"
                    value={formatDate(walletDetails.wallet.updatedAt)}
                  />
                  <DetailCard
                    label="Last Deposit"
                    value={formatDate(walletDetails.wallet.lastDepositAt)}
                  />
                  <DetailCard
                    label="Cached Balance Updated"
                    value={formatDate(
                      walletDetails.wallet.cachedBalanceUpdatedAt
                    )}
                  />
                </div>
              </div>

              {sweepResult && (
                <div className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Sweep Outcome
                  </h3>
                  <div className="mt-4 space-y-3">
                    <DetailCard label="Status" value={sweepResult.status} />
                    <DetailCard
                      label="Amount Swept"
                      value={formatAmount(sweepResult.amount)}
                    />
                    <DetailCard
                      label="Transaction Hash"
                      value={sweepResult.txHash ?? "Not available"}
                      mono
                    />
                    <DetailCard
                      label="Balance at Sweep Time"
                      value={formatAmount(sweepResult.balance)}
                    />
                    <DetailCard
                      label="Error"
                      value={sweepResult.error ?? "No error recorded"}
                    />
                  </div>
                </div>
              )}

              {fromSweepId && sweep && (
                <div className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Sweep Run Context
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        navigate({
                          to: "/dashboard/treasury/$sweepId",
                          params: { sweepId: fromSweepId },
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-xs font-semibold text-[#575AE5] transition-colors hover:bg-[#F8F8FF]"
                    >
                      Open run
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    <DetailCard label="Run ID" value={sweep.id} mono />
                    <DetailCard label="Run Status" value={sweep.status} />
                    <DetailCard
                      label="Target Address"
                      value={sweep.targetAddress}
                      mono
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {!isLoading && !walletDetails && (
          <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6 text-sm text-gray-600 shadow-sm">
            Wallet details are unavailable for this address.
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
