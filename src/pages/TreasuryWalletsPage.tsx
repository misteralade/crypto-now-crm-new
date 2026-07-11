import { useMemo } from "react";
import { ExternalLink, ArrowLeft, RefreshCw, Copy } from "lucide-react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "react-toastify";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import PageHeader from "../components/global/pageHeader.tsx";
import Table, { type TableColumn } from "../components/table.tsx";
import { useAdminTreasuryWalletsQuery, useAdminRefreshCustodialWalletBalanceMutation } from "../queries/crypto.querries.ts";
import type { AdminCustodialWalletDetailsResponsePayload } from "../types/response.payload.types.ts";

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function formatAmount(value: string | number | null | undefined, symbol: string) {
  const upper = (symbol || "").trim().toUpperCase();
  if (value == null || value === "") {
    return upper === "BTC" ? "0.00000000" : "0.0000";
  }
  const num = Number(value);
  if (upper === "BTC") {
    return num.toFixed(8);
  }
  if (upper === "SOL") {
    return num.toFixed(5);
  }
  if (upper === "USDT" || upper === "USDC") {
    return num.toFixed(4);
  }
  return num.toFixed(6);
}

function getOwnerLabel(wallet: AdminCustodialWalletDetailsResponsePayload["wallet"], user: AdminCustodialWalletDetailsResponsePayload["user"]) {
  if (wallet.walletPurpose === "GUEST") {
    return "Guest pool";
  }

  if (!user) {
    return "Unassigned";
  }

  const profileName = [user.profile?.firstName, user.profile?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return profileName || user.email || "User";
}

function getUsageLabel(wallet: AdminCustodialWalletDetailsResponsePayload["wallet"]) {
  if (wallet.walletPurpose === "GUEST") {
    return wallet.leasedTransactionId ? "Leased guest wallet" : "Reusable guest wallet";
  }

  return "User deposit wallet";
}

function shortAddress(address: string) {
  if (!address) return "—";
  return `${address.slice(0, 8)}...${address.slice(-8)}`;
}

function RefreshWalletButton({ walletAddress }: { walletAddress: string }) {
  const mutation = useAdminRefreshCustodialWalletBalanceMutation(walletAddress);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        mutation.mutate();
      }}
      disabled={mutation.isPending}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E4E7EC] bg-white text-[#475467] transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
      title="Refresh balance from chain"
    >
      <RefreshCw className={`h-4 w-4 ${mutation.isPending ? "animate-spin" : ""}`} />
    </button>
  );
}

export default function TreasuryWalletsPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/dashboard/treasury/wallets" }) as {
    cryptocurrencyId: string;
    network: string;
    symbol: string;
    name: string;
  };

  const { cryptocurrencyId, network, symbol, name } = search;

  const { data: wallets, isLoading } = useAdminTreasuryWalletsQuery(
    cryptocurrencyId || undefined,
    network || undefined
  );

  const rows = useMemo(() => wallets ?? [], [wallets]);

  const columns: TableColumn<AdminCustodialWalletDetailsResponsePayload>[] =
    useMemo(
      () => [
        {
          key: "wallet",
          header: "Wallet Address",
          render: (_, row) => (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <p className="font-mono text-xs font-semibold text-[#03034D] block md:hidden">
                  {shortAddress(row.wallet.walletAddress)}
                </p>
                <p className="font-mono text-xs font-semibold text-[#03034D] hidden md:block break-all max-w-xs md:max-w-md">
                  {row.wallet.walletAddress}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(row.wallet.walletAddress);
                    toast.success("Wallet address copied!");
                  }}
                  className="inline-flex items-center justify-center rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-[#03034D] transition-colors"
                  title="Copy address"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-gray-500">
                Created: {formatDate(row.wallet.createdAt)}
              </p>
            </div>
          ),
        },
        {
          key: "owner",
          header: "Owner Details",
          render: (_, row) => {
            const label = getOwnerLabel(row.wallet, row.user);
            const usage = getUsageLabel(row.wallet);

            return (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#03034D]">{label}</p>
                <p className="text-[11px] text-gray-500 font-medium">{usage}</p>
                {row.user?.email && row.user.email !== label && (
                  <p className="text-[11px] text-gray-400 font-mono">{row.user.email}</p>
                )}
              </div>
            );
          },
        },
        {
          key: "walletPurpose",
          header: "Purpose / Status",
          render: (_, row) => (
            <div className="space-y-1">
              <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
                {row.wallet.walletPurpose}
              </span>
              <div>
                {row.wallet.isActive ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                    Inactive
                  </span>
                )}
              </div>
            </div>
          ),
        },
        {
          key: "cachedBalance",
          header: "Balance",
          render: (_, row) => (
            <div className="space-y-1">
              <p className="font-mono text-sm font-semibold text-[#03034D] tabular-nums">
                {formatAmount(row.wallet.cachedBalance, symbol)}
              </p>
              <p className="text-[11px] text-gray-500">{symbol ?? row.wallet.network}</p>
            </div>
          ),
        },

        {
          key: "refresh",
          header: "Sync",
          render: (_, row) => (
            <RefreshWalletButton walletAddress={row.wallet.walletAddress} />
          ),
        },
        {
          key: "action",
          header: "",
          render: (_, row) => (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                void navigate({
                  to: "/dashboard/custodial-wallet/$walletAddress",
                  params: { walletAddress: row.wallet.walletAddress },
                  search: { fromSweepId: "" },
                });
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-semibold text-indigo-600 transition-all hover:border-indigo-100 hover:bg-indigo-50"
            >
              Open
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          ),
        },
      ],
      [navigate, symbol]
    );

  return (
    <AuthenticatedLayout>
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard/treasury" })}
            className="flex items-center gap-1 hover:text-[#03034D] transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Treasury
          </button>
        </div>

        <PageHeader
          title={`${symbol} Custodial Wallets`}
          subtitle={`Viewing all generated custodial wallets for ${name} on ${network} network.`}
        />

        <div className="rounded-2xl border border-[#EEF1FF] bg-[linear-gradient(180deg,#F8F9FF_0%,#FFFFFF_100%)] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#575AE5]">
              Asset Profile
            </span>
            <h2 className="text-xl font-bold text-[#03034D] mt-1">{name} ({symbol})</h2>
            <p className="text-xs text-gray-500 mt-1">Network: {network}</p>
          </div>
          <div className="bg-white px-4 py-3 rounded-xl border border-[#DDE0FF] shadow-sm flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Wallets Count</p>
              <p className="text-lg font-bold text-[#03034D] tabular-nums mt-0.5">{rows.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#EEF1FF] p-4 md:p-6 shadow-sm">
          <Table<AdminCustodialWalletDetailsResponsePayload>
            data={rows}
            columns={columns}
            loading={isLoading}
            onRowClick={(row) => {
              void navigate({
                to: "/dashboard/custodial-wallet/$walletAddress",
                params: { walletAddress: row.wallet.walletAddress },
                search: { fromSweepId: "" },
              });
            }}
            emptyMessage="No active custodial wallets found for this token and network."
            className="border border-[#EEF1FF]"
            theadClassName="bg-gray-50/70 border-b border-gray-100"
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
