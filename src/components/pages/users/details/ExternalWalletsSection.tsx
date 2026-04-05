import { useMemo } from "react";
import { toast } from "react-toastify";
import { useAdminUserCustodialWalletsQuery } from "../../../../queries/crypto.querries";

interface ExternalWalletsSectionProps {
  userId: string | undefined;
}

// Copy text to clipboard with toast feedback.
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard.");
  } catch {
    toast.error("Failed to copy.");
  }
};

// Render a compact skeleton card while wallets are loading.
const WalletSkeleton = () => {
  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <div className="h-6 w-56 bg-[#F2F4F7] rounded animate-pulse mb-3" />
      <div className="h-4 w-[70%] bg-[#F2F4F7] rounded animate-pulse mb-6" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="h-4 w-44 bg-[#F2F4F7] rounded animate-pulse" />
                <div className="h-3 w-72 bg-[#F2F4F7] rounded animate-pulse mt-2" />
              </div>
              <div className="h-9 w-20 bg-[#F2F4F7] rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sort wallets by network then address for stable UI.
const sortWallets = (wallets: any[]) => {
  return [...wallets].sort((a, b) => {
    // Sort deterministically using network first, then address.
    const netCmp = (a.network || "").localeCompare(b.network || "");
    if (netCmp !== 0) return netCmp;
    return (a.walletAddress || "").localeCompare(b.walletAddress || "");
  });
};

const ExternalWalletsSection = ({ userId }: ExternalWalletsSectionProps) => {
  const { data: wallets, isLoading } =
    useAdminUserCustodialWalletsQuery(userId);

  const sortedWallets = useMemo(
    () => (wallets ? sortWallets(wallets) : []),
    [wallets]
  );

  if (isLoading) return <WalletSkeleton />;

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <div className="flex items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#0E0F0C]">
            External Receiving Wallets
          </h2>
          <p className="text-sm text-[#667085] mt-1">
            These are the crypto addresses the user added for receiving BUY
            payouts.
          </p>
        </div>
      </div>

      {!sortedWallets || sortedWallets.length === 0 ? (
        <div className="text-center py-8 text-[#667085]">
          No external wallets yet.
        </div>
      ) : (
        <div className="space-y-3">
          {sortedWallets.map((wallet) => {
            const title =
              wallet.walletLabel ||
              wallet.cryptocurrency?.symbol ||
              wallet.cryptocurrency?.name ||
              "Receiving Wallet";

            return (
              <div key={wallet.id} className="p-4 border rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-medium text-[#0E0F0C] truncate">
                        {title}
                      </div>
                      <span className="text-[12px] px-2 py-1 rounded-full bg-[#F2F4F7] text-[#344054]">
                        {wallet.network}
                      </span>
                      {wallet.isPrimary ? (
                        <span className="text-[12px] px-2 py-1 rounded-full bg-[#E8F8F0] text-[#037847]">
                          PRIMARY
                        </span>
                      ) : null}
                      {wallet.isVerified ? (
                        <span className="text-[12px] px-2 py-1 rounded-full bg-[#E0ECFF] text-[#1D4ED8]">
                          VERIFIED
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-2 font-mono text-[13px] text-[#475467] break-all">
                      {wallet.walletAddress}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => copyToClipboard(wallet.walletAddress)}
                      className="px-3 py-2 rounded-full bg-[#EAE9FC] text-[#3B37A1] text-sm font-medium cursor-pointer hover:opacity-80"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExternalWalletsSection;
