import { Fragment, useEffect, useState } from "react";
import {
  X,
  Globe,
  FileText,
  TrendingUp,
  TrendingDown,
  Wallet,
  Copy,
  ExternalLink,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import type {
  SearchSupportedCryptoData,
  AdminCryptoWalletResponsePayload,
} from "../../../types/response.payload.types";

interface CoinDetailsModalProps {
  coin: SearchSupportedCryptoData | null;
  open: boolean;
  loading?: boolean;
  onClose: () => void;
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).catch(() => {});
};

const WalletCard = ({
  wallet,
}: {
  wallet: AdminCryptoWalletResponsePayload;
}) => {
  const isActive = Boolean(wallet.isActive);

  return (
    <div className="bg-[#F8F8FF] rounded-xl p-3 border border-[#ECECEC]">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-semibold text-[#03034D] uppercase tracking-wide">
          {wallet.network}
        </span>
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
            isActive
              ? "bg-[#ECFDF3] text-[#037847]"
              : "bg-[#F2F4F7] text-[#6C778B]"
          }`}
        >
          {isActive ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <XCircle className="w-3 h-3" />
          )}
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <code className="flex-1 text-[11px] text-[#667085] font-mono truncate">
          {wallet.walletAddress}
        </code>
        <button
          onClick={() => copyToClipboard(wallet.walletAddress)}
          className="p-1 rounded-lg hover:bg-[#D3D4F8] transition-colors flex-shrink-0"
          title="Copy address"
        >
          <Copy className="w-3.5 h-3.5 text-[#03034D]" />
        </button>
      </div>
    </div>
  );
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[#F5F5FF] last:border-0">
    <span className="text-[12px] text-[#9A9A9A] font-medium flex-shrink-0">
      {label}
    </span>
    <span className="text-[13px] text-[#0E0F0C] font-medium text-right">
      {value}
    </span>
  </div>
);

const SectionHeader = ({ label }: { label: string }) => (
  <h4 className="text-[11px] font-semibold text-[#9A9A9A] uppercase tracking-widest mb-3 mt-5 first:mt-0">
    {label}
  </h4>
);

export const CoinDetailsModal = ({
  coin,
  open,
  loading,
  onClose,
}: CoinDetailsModalProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(open);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [open, shouldRender]);

  if (!shouldRender) return null;

  const walletsByNetwork =
    coin?.adminCryptoWallets?.reduce<
      Record<string, AdminCryptoWalletResponsePayload[]>
    >((acc, w) => {
      const net = w.network || "Unknown";
      if (!acc[net]) acc[net] = [];
      acc[net].push(w);
      return acc;
    }, {}) ?? {};

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 ${
          isClosing ? "animate-modal-backdrop-out" : "animate-modal-backdrop-in"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-[520px] bg-white shadow-2xl flex flex-col overflow-hidden ${
          isClosing ? "animate-modal-slide-out" : "animate-modal-slide-in"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#ECECEC] bg-white sticky top-0">
          {loading ? (
            <div className="w-10 h-10 rounded-full bg-[#F5F5FF] animate-pulse" />
          ) : coin?.logoUrl ? (
            <img
              src={coin.logoUrl}
              alt={coin.symbol}
              className="w-10 h-10 rounded-full object-cover border border-[#ECECEC]"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#D3D4F8] flex items-center justify-center">
              <span className="text-[14px] font-bold text-[#03034D]">
                {coin?.symbol?.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 w-32 bg-[#F5F5FF] rounded animate-pulse" />
                <div className="h-3 w-20 bg-[#F5F5FF] rounded animate-pulse" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h2 className="text-[17px] font-bold text-[#0E0F0C] truncate">
                    {coin?.name}
                  </h2>
                  <span className="text-[11px] font-semibold text-[#948EEE] bg-[#F5F5FF] px-2 py-0.5 rounded-full">
                    {coin?.symbol}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      coin?.isActive
                        ? "bg-[#ECFDF3] text-[#037847]"
                        : "bg-[#F2F4F7] text-[#6C778B]"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        coin?.isActive ? "bg-[#14BA6D]" : "bg-[#6C778B]"
                      }`}
                    />
                    {coin?.isActive ? "Active" : "Inactive"}
                  </span>
                  {coin?.isStableCoin && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB]">
                      Stablecoin
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#F5F5FF] transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-[#9A9A9A]" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 text-[#948EEE] animate-spin" />
              <span className="text-[13px] text-[#9A9A9A]">
                Loading coin details…
              </span>
            </div>
          )}
          {!loading && !coin && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <span className="text-[14px] text-[#9A9A9A]">
                Failed to load coin details.
              </span>
            </div>
          )}
          {!loading && coin && (
            <>
              {/* Rates */}
              <SectionHeader label="Exchange Rates" />
              <div className="grid grid-cols-2 gap-3 mb-1">
                <div className="bg-[#F5F5FF] rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[#03034D]" />
                    <span className="text-[11px] font-semibold text-[#9A9A9A] uppercase tracking-wide">
                      Buy Rate
                    </span>
                  </div>
                  <span className="text-[20px] font-bold text-[#03034D]">
                    {coin.buyRate
                      ? `₦${Number(coin.buyRate).toLocaleString()}`
                      : "—"}
                  </span>
                </div>
                <div className="bg-[#F5F5FF] rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingDown className="w-3.5 h-3.5 text-[#03034D]" />
                    <span className="text-[11px] font-semibold text-[#9A9A9A] uppercase tracking-wide">
                      Sell Rate
                    </span>
                  </div>
                  <span className="text-[20px] font-bold text-[#03034D]">
                    {coin.sellRate
                      ? `₦${Number(coin.sellRate).toLocaleString()}`
                      : "—"}
                  </span>
                </div>
              </div>

              {/* Trade Limits */}
              <SectionHeader label="Trade Limits" />
              <div className="bg-white rounded-xl border border-[#ECECEC] px-4">
                <InfoRow
                  label="Authenticated — Min"
                  value={
                    coin.minTransactionLimit
                      ? `$${Number(coin.minTransactionLimit).toLocaleString()}`
                      : "—"
                  }
                />
                <InfoRow
                  label="Authenticated — Max"
                  value={
                    coin.maxTransactionLimit
                      ? `$${Number(coin.maxTransactionLimit).toLocaleString()}`
                      : "—"
                  }
                />
                <InfoRow
                  label="Anonymous — Min"
                  value={
                    coin.minTradeAmountForAnonymous
                      ? `$${Number(
                          coin.minTradeAmountForAnonymous
                        ).toLocaleString()}`
                      : "—"
                  }
                />
                <InfoRow
                  label="Anonymous — Max"
                  value={
                    coin.maxTradeAmountForAnonymous
                      ? `$${Number(
                          coin.maxTradeAmountForAnonymous
                        ).toLocaleString()}`
                      : "—"
                  }
                />
              </div>

              {/* Networks */}
              <SectionHeader label="Supported Networks" />
              {coin.networks && coin.networks.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-1">
                  {coin.networks.map((n) => (
                    <span
                      key={n}
                      className="inline-block px-3 py-1 rounded-full text-[12px] font-semibold bg-[#D3D4F8] text-[#03034D]"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-[#9A9A9A]">
                  No networks configured.
                </p>
              )}

              {/* Admin Wallets */}
              <SectionHeader label="Admin Wallet Addresses" />
              {Object.keys(walletsByNetwork).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(walletsByNetwork).map(
                    ([network, wallets]) => (
                      <div key={network}>
                        <div className="flex items-center gap-2 mb-2">
                          <Wallet className="w-3.5 h-3.5 text-[#948EEE]" />
                          <span className="text-[12px] font-semibold text-[#03034D]">
                            {network}
                          </span>
                          <span className="text-[11px] text-[#9A9A9A]">
                            ({wallets.length} address
                            {wallets.length !== 1 ? "es" : ""})
                          </span>
                        </div>
                        <div className="space-y-2">
                          {wallets.map((w) => (
                            <WalletCard key={w.id} wallet={w} />
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-[13px] text-[#9A9A9A]">
                  No admin wallets configured.
                </p>
              )}

              {/* Description */}
              {coin.description && (
                <>
                  <SectionHeader label="Description" />
                  <p className="text-[13px] text-[#667085] leading-relaxed bg-[#F8F8FF] rounded-xl p-3 border border-[#ECECEC]">
                    {coin.description}
                  </p>
                </>
              )}

              {/* Links */}
              {(coin.websiteUrl || coin.whitepaperUrl) && (
                <>
                  <SectionHeader label="Resources" />
                  <div className="flex flex-wrap gap-2">
                    {coin.websiteUrl && (
                      <a
                        href={coin.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F5FF] text-[12px] font-medium text-[#03034D] hover:bg-[#D3D4F8] transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Website
                        <ExternalLink className="w-3 h-3 text-[#9A9A9A]" />
                      </a>
                    )}
                    {coin.whitepaperUrl && (
                      <a
                        href={coin.whitepaperUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F5FF] text-[12px] font-medium text-[#03034D] hover:bg-[#D3D4F8] transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Whitepaper
                        <ExternalLink className="w-3 h-3 text-[#9A9A9A]" />
                      </a>
                    )}
                  </div>
                </>
              )}

              {/* Meta */}
              <SectionHeader label="Details" />
              <div className="bg-white rounded-xl border border-[#ECECEC] px-4">
                <InfoRow
                  label="Coin ID"
                  value={
                    <code className="text-[11px] font-mono">{coin.id}</code>
                  }
                />
                <InfoRow
                  label="Added"
                  value={
                    coin.createdAt
                      ? new Date(coin.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })
                      : "—"
                  }
                />
              </div>

              <div className="h-6" />
            </>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default CoinDetailsModal;
