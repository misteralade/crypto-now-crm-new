import { useState } from "react";
import { Zap, RefreshCw } from "lucide-react";
import type { SearchSupportedCryptoData } from "../../../types/response.payload.types";
import {
  useAdminGeneratePlatformFuelingWalletMutation,
  useAdminGetWalletBalanceMutation,
} from "../../../queries/crypto.querries";

interface FuelingWalletsSectionProps {
  cryptos: SearchSupportedCryptoData[];
}

const NETWORKS_REQUIRING_FUELING = new Set(["ERC20", "TRC20"]);

// Isolated card component for clean, premium state management and individual balance syncing
const FuelingWalletCard = ({
  row,
  onGenerate,
  isGenerating,
}: {
  row: {
    cryptoId: string;
    cryptoSymbol: string;
    cryptoName: string;
    network: string;
    fuelingWallet?: { id: string; walletAddress: string };
  };
  onGenerate: () => void;
  isGenerating: boolean;
}) => {
  const [balanceData, setBalanceData] = useState<{ balance: number; symbol: string } | null>(null);
  const balanceMutation = useAdminGetWalletBalanceMutation();

  const depositAsset = row.network === "ERC20" ? "ETH (Ethereum)" : "TRX (Tron)";
  const fuelsAsset = `${row.cryptoSymbol} (${row.network})`;

  const handleRefresh = () => {
    if (!row.fuelingWallet?.id) return;
    balanceMutation.mutate(row.fuelingWallet.id, {
      onSuccess: (data) => {
        setBalanceData(data);
      },
    });
  };

  return (
    <div
      className={`rounded-2xl border p-5 space-y-4 transition-all ${
        row.fuelingWallet
          ? "border-[#E4E7EC] bg-[#FCFCFE] shadow-sm"
          : "border-indigo-100 bg-indigo-50/15"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {row.network} Network
          </span>
          <h4 className="text-sm font-bold text-[#03034D] mt-2">
            Fuels sweeps for: <span className="text-indigo-600 font-extrabold">{fuelsAsset}</span>
          </h4>
        </div>
        {row.fuelingWallet ? (
          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-semibold">
            Active
          </span>
        ) : (
          <span className="text-[10px] bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-semibold">
            Inactive
          </span>
        )}
      </div>

      <div className="space-y-2 border-t border-[#ECECEC]/70 pt-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500 font-medium">Required Gas Asset</span>
          <span className="font-bold text-[#03034D] bg-indigo-50 px-2.5 py-0.5 rounded-lg text-[11px]">
            {depositAsset}
          </span>
        </div>

        <div className="rounded-xl bg-[#F4F4F7] p-3 border border-[#E4E7EC] space-y-1">
          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">
            Admin Deposit Wallet Address
          </span>
          <div className="font-mono text-xs text-gray-700 break-all select-all font-medium leading-relaxed mt-1">
            {row.fuelingWallet?.walletAddress ?? (
              <span className="italic text-indigo-600 font-medium">Not generated yet</span>
            )}
          </div>
        </div>

        {row.fuelingWallet && (
          <div className="flex justify-between items-center bg-[#F8F9FC] border border-[#E4E7EC] rounded-xl p-3 text-xs">
            <div>
              <span className="text-gray-500 font-medium block">Native Gas Balance</span>
              <span className="font-bold text-[#03034D] text-sm mt-0.5 block">
                {balanceData !== null ? `${balanceData.balance.toFixed(4)} ${balanceData.symbol}` : "—"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={balanceMutation.isPending}
              className="px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 disabled:bg-gray-100 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 font-semibold text-xs border border-indigo-100 bg-white"
              title="Refresh native balance"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${balanceMutation.isPending ? "animate-spin" : ""}`} />
              {balanceMutation.isPending ? "Syncing..." : "Sync Balance"}
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        {!row.fuelingWallet ? (
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            {isGenerating ? "Generating..." : "Generate Fueling Wallet"}
          </button>
        ) : (
          <div className="text-[11px] text-gray-500 leading-normal bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 w-full">
            ⚠️ <strong className="text-blue-800">Operational Note:</strong> Deposit <strong>{row.network === "ERC20" ? "ETH" : "TRX"}</strong> directly into this address to cover transaction gas fees for custodial sweeping.
          </div>
        )}
      </div>
    </div>
  );
};

const FuelingWalletsSection = ({ cryptos }: FuelingWalletsSectionProps) => {
  const generateFuelingWalletMutation = useAdminGeneratePlatformFuelingWalletMutation();

  const rows = cryptos.flatMap((crypto) => {
    // Check cryptocurrency's supported networks configuration
    const networksNeedingFuel = (crypto.networks ?? [])
      .filter((n) => NETWORKS_REQUIRING_FUELING.has(n));

    return networksNeedingFuel.map((network) => {
      const fuelingWallet = (crypto.adminCryptoWallets ?? []).find(
        (w) => w.network === network && w.walletType === "FUELING",
      );
      return {
        cryptoId: crypto.id,
        cryptoSymbol: crypto.symbol.toUpperCase(),
        cryptoName: crypto.name,
        network,
        fuelingWallet,
      };
    });
  });

  return (
    <div className="bg-white border border-[#E9E7E2] rounded-3xl p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-xl font-bold text-[#03034D]">Gas Funding (Fueling) Wallets</h3>
        <p className="text-xs text-gray-500 mt-1">
          System-derived wallets used exclusively to fund transaction fees (gas) for sweeping assets on
          native networks (ETH/TRX). These are read-only — generated directly from the platform's HD wallet seed.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No coins on ERC20/TRC20 networks yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {rows.map((row) => (
            <FuelingWalletCard
              key={`${row.cryptoId}-${row.network}`}
              row={row}
              onGenerate={() =>
                generateFuelingWalletMutation.mutate({ cryptoId: row.cryptoId, network: row.network })
              }
              isGenerating={generateFuelingWalletMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FuelingWalletsSection;
