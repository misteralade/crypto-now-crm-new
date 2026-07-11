import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import ConfirmModal from "../../global/ConfirmModal";
import type { SearchSupportedCryptoData } from "../../../types/response.payload.types";
import {
  useAdminDeletePlatformWalletMutation,
} from "../../../queries/crypto.querries";

type FlattenedWallet = {
  id: string;
  cryptoId: string;
  cryptoSymbol: string;
  cryptoName: string;
  network: string;
  walletAddress: string;
  blockchainEnvironment: "testnet" | "mainnet";
};

interface WalletCardSectionProps {
  walletType: "SENDING" | "RECEIVING";
  cryptos: SearchSupportedCryptoData[];
  defaultCryptoId?: string;
}

const WalletCardSection = ({ walletType, cryptos, defaultCryptoId: _defaultCryptoId }: WalletCardSectionProps) => {
  const navigate = useNavigate();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const deleteWalletMutation = useAdminDeletePlatformWalletMutation();

  const handleEditWallet = (walletId: string) => {
    navigate({ to: `/dashboard/admin-wallets/edit/$walletId`, params: { walletId } });
  };

  const handleAddWallet = () => {
    navigate({ to: `/dashboard/admin-wallets/add/$walletType`, params: { walletType } });
  };

  const wallets: FlattenedWallet[] = cryptos.flatMap((crypto) =>
    (crypto.adminCryptoWallets ?? [])
      .filter((w) => w.walletType === walletType)
      .map((w) => ({
        id: w.id,
        cryptoId: crypto.id,
        cryptoSymbol: crypto.symbol,
        cryptoName: crypto.name,
        network: w.network,
        walletAddress: w.walletAddress,
        blockchainEnvironment: w.blockchainEnvironment,
      })),
  );

  const heading = walletType === "SENDING" ? "Buy Payout (Sending) Wallets" : "Sweep Target (Receiving) Wallets";
  const description = walletType === "SENDING"
    ? "Funds used by the platform to complete user Buy Orders."
    : "External target addresses where swept user deposits are transferred.";
  const addLabel = walletType === "SENDING" ? "Add Sending Wallet" : "Add Receiving Wallet";
  const emptyLabel = walletType === "SENDING" ? "No sending wallets configured yet." : "No receiving wallets configured yet.";

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteWalletMutation.mutate(pendingDeleteId, { onSuccess: () => setPendingDeleteId(null) });
  };

  return (
    <div className="bg-white border border-[#E9E7E2] rounded-3xl p-6 shadow-sm space-y-6">
      <div className="flex justify-between items-start gap-4 flex-wrap sm:flex-nowrap">
        <div>
          <h3 className="text-xl font-bold text-[#03034D]">{heading}</h3>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <button
          type="button"
          onClick={handleAddWallet}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl transition-all whitespace-nowrap"
        >
          <Plus className="h-3.5 w-3.5" />
          {addLabel}
        </button>
      </div>

      {wallets.length === 0 ? (
        <p className="text-sm text-gray-400 italic">{emptyLabel}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {wallets.map((w) => (
            <div
              key={w.id}
              onClick={() => handleEditWallet(w.id)}
              className="rounded-2xl border border-[#ECECEC] bg-[#FCFCFE] p-4 space-y-3 cursor-pointer hover:border-[#D0D0D0] hover:shadow-md transition-all group"
            >
              {/* Header with coin info and actions */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#03034D]">{w.cryptoSymbol}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditWallet(w.id);
                    }}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    aria-label="Edit wallet"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingDeleteId(w.id);
                    }}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Delete wallet"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                  {w.network}
                </span>
                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  {w.blockchainEnvironment}
                </span>
              </div>

              {/* Wallet Address */}
              <div className="font-mono text-xs text-gray-600 break-all leading-relaxed">
                {w.walletAddress}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={pendingDeleteId !== null}
        actionType="delete"
        onClose={() => setPendingDeleteId(null)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this wallet? This cannot be undone."
        confirmText="Delete Wallet"
      />
    </div>
  );
};

export default WalletCardSection;
