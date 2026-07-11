import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useSweepQuery } from "../../../queries/sweep.querries.ts";
import { useCryptoQuery, useAdminGeneratePlatformFuelingWalletMutation } from "../../../queries/crypto.querries.ts";
import { toast } from "react-toastify";
import LabeledPillSelect from "../../global/LabeledPillSelect.tsx";
import { useNavigate } from "@tanstack/react-router";
import { LoadingSpinner } from "../../global/LoadingSpinner.tsx";

interface SweepConfigModalProps {
  open: boolean;
  onClose: () => void;
}

const NETWORK_OPTIONS = [
  { label: "Bitcoin", value: "BTC" },
  { label: "Solana", value: "SOLANA" },
  { label: "Tron (TRC-20)", value: "TRC20" },
  { label: "Ethereum (ERC-20)", value: "ERC20" },
];

// Must match backend `SWEEP_BTC_SUPPORTS_MAX_TOTAL_AMOUNT` in cryptonow-backend/src/util/constants.ts
const SWEEP_BTC_SUPPORTS_MAX_TOTAL_AMOUNT = true;

// Standardize error extraction across mutation paths.
function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return "Failed to initiate sweep";
}

// Short absolute local time (year omitted when it matches the current year).
function formatCacheTimestampLabel(iso: string): string {
  const m = moment(iso);
  if (!m.isValid()) return "";
  return m.isSame(moment(), "year")
    ? m.format("D MMM HH:mm")
    : m.format("D MMM YY HH:mm");
}

// Formats a suggested sweep amount (trims trailing zeros).
function formatSuggestedSweepAmount(value: number, network: string): string {
  if (!Number.isFinite(value) || value <= 0) return "";
  const decimals = network === "BTC" ? 8 : 6;
  let s = value.toFixed(decimals);
  while (s.includes(".") && (s.endsWith("0") || s.endsWith("."))) {
    s = s.slice(0, -1);
  }
  return s;
}

// Cached aggregate freshness line for the sweep preview panel.
function formatRefreshedAt(value: string | null, neverRefreshedCount: number) {
  if (!value) {
    return neverRefreshedCount > 0
      ? "Balances not yet refreshed"
      : "No balance data";
  }
  const ts = formatCacheTimestampLabel(value);
  return ts ? `As of ${ts}` : "Balances not yet refreshed";
}

function formatCountLabel(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function getZeroSweepReason(
  previewData: {
    walletsBlockedByFee: number;
    walletsWithoutSpendableBalance: number;
    walletsMissingSweepSetup: number;
    walletsSweepable: number;
    estimatedFeeAmount: number;
  },
  symbol: string
) {
  const reasons: string[] = [];

  if (previewData.walletsBlockedByFee > 0) {
    reasons.push(
      `${formatCountLabel(
        previewData.walletsBlockedByFee,
        "wallet is",
        "wallets are"
      )} blocked by network fees (insufficient gas or native balance)`
    );
  }

  if (previewData.walletsWithoutSpendableBalance > 0) {
    reasons.push(
      `${formatCountLabel(
        previewData.walletsWithoutSpendableBalance,
        "wallet has",
        "wallets have"
      )} no spendable balance`
    );
  }

  if (previewData.walletsMissingSweepSetup > 0) {
    reasons.push(
      `${formatCountLabel(
        previewData.walletsMissingSweepSetup,
        "wallet is",
        "wallets are"
      )} missing sweep configuration`
    );
  }

  if (reasons.length === 0) {
    return `No ${symbol || "BTC"} wallet is sweepable right now.`;
  }

  return `${reasons.join(", ")}.`;
}

export default function SweepConfigModal({
  open,
  onClose,
}: SweepConfigModalProps) {
  const navigate = useNavigate();
  const {
    useSweepPreview,
    initiateSweepMutation,
    refreshBalancesMutation,
    useBalanceSummary,
  } = useSweepQuery();
  const { allSupportedCrypto } = useCryptoQuery();

  const [network, setNetwork] = useState("");
  const [cryptocurrencyId, setCryptocurrencyId] = useState("");
  const [previewRequested, setPreviewRequested] = useState(false);
  const [maxAmountInput, setMaxAmountInput] = useState("");
  const [dustThresholdInput, setDustThresholdInput] = useState("");
  const [amountTouched, setAmountTouched] = useState(false);
  const [showDustThreshold, setShowDustThreshold] = useState(false);

  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(open);

  const { data: balanceSummaryRows = [] } = useBalanceSummary();

  const matchedSummaryRow = useMemo(
    () =>
      balanceSummaryRows.find(
        (r) => r.network === network && r.cryptocurrencyId === cryptocurrencyId
      ),
    [balanceSummaryRows, network, cryptocurrencyId]
  );

  // Crypto comes first — show all active cryptos regardless of network.
  const cryptoOptions = useMemo(() => {
    if (!allSupportedCrypto) return [];
    return allSupportedCrypto
      .filter((crypto) => crypto.isActive)
      .map((crypto) => ({
        value: crypto.id,
        label: `${crypto.name} (${crypto.symbol.toUpperCase()})`,
      }));
  }, [allSupportedCrypto]);

  const selectedCrypto = useMemo(
    () => allSupportedCrypto?.find((crypto) => crypto.id === cryptocurrencyId),
    [allSupportedCrypto, cryptocurrencyId]
  );

  // Network options are driven by the selected crypto's supported networks.
  const networkOptions = useMemo(() => {
    if (!selectedCrypto?.networks) return NETWORK_OPTIONS;
    return NETWORK_OPTIONS.filter((opt) =>
      selectedCrypto.networks!.includes(opt.value)
    );
  }, [selectedCrypto]);

  const generateFuelingWalletMutation = useAdminGeneratePlatformFuelingWalletMutation();

  const hasFuelingWallet = useMemo(() => {
    if (!cryptocurrencyId || !network || !selectedCrypto) return true;
    if (network === "SOLANA" || network === "BTC") return true;

    const fuelingWallet = selectedCrypto.adminCryptoWallets?.find(
      (w) => w.network === network && w.walletType === "FUELING" && w.isActive
    );
    return !!fuelingWallet;
  }, [selectedCrypto, network, cryptocurrencyId]);

  const handleGenerateFuelingWallet = async () => {
    if (!cryptocurrencyId || !network) return;
    try {
      await generateFuelingWalletMutation.mutateAsync({
        cryptoId: cryptocurrencyId,
        network: network,
      });
    } catch (e) {
      // handled
    }
  };

  useEffect(() => {
    if (!open) return;

    if (!cryptocurrencyId && cryptoOptions.length === 1) {
      setCryptocurrencyId(cryptoOptions[0].value);
    }
  }, [open, cryptocurrencyId, cryptoOptions]);

  useEffect(() => {
    if (!open || !selectedCrypto) return;

    if (!network && networkOptions.length === 1) {
      setNetwork(networkOptions[0].value);
    }
  }, [open, network, selectedCrypto, networkOptions]);

  const canPreview = Boolean(network && cryptocurrencyId);
  const showPreview = previewRequested && canPreview;
  const isBtcLimitedSweepUi =
    network === "BTC" && !SWEEP_BTC_SUPPORTS_MAX_TOTAL_AMOUNT;
  const parsedMaxAmount = (() => {
    const trimmed = maxAmountInput.trim();
    if (!trimmed) return undefined;
    const n = Number(trimmed);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  })();
  const parsedDustThresholdOverride = (() => {
    const trimmed = dustThresholdInput.trim();
    if (!trimmed) return undefined;
    const n = Number(trimmed);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  })();
  const maxAmountInvalid =
    !isBtcLimitedSweepUi &&
    maxAmountInput.trim().length > 0 &&
    parsedMaxAmount === undefined;
  const dustThresholdInvalid =
    !isBtcLimitedSweepUi &&
    dustThresholdInput.trim().length > 0 &&
    parsedDustThresholdOverride === undefined;
  const previewMaxTotalAmount =
    !isBtcLimitedSweepUi && parsedMaxAmount !== undefined
      ? parsedMaxAmount
      : undefined;
  const previewDustThresholdOverride =
    !isBtcLimitedSweepUi && parsedDustThresholdOverride !== undefined
      ? parsedDustThresholdOverride
      : undefined;

  // Preview includes cached totals plus live sweepability checks when requested.
  const {
    data: previewData,
    isLoading: isPreviewLoading,
    error: previewError,
    refetch: refetchPreview,
  } = useSweepPreview(
    showPreview
      ? {
          network,
          cryptocurrencyId,
          dustThresholdOverride: previewDustThresholdOverride,
          maxTotalAmount: previewMaxTotalAmount,
        }
      : null
  );

  // Auto-fill from the cached balance summary until the user edits the amount.
  // Keep the preview response read-only so it cannot feed its own query key.
  useEffect(() => {
    if (!network || !cryptocurrencyId) {
      setMaxAmountInput("");
      return;
    }
    if (!isBtcLimitedSweepUi && amountTouched) return;
    if (matchedSummaryRow) {
      const nextAmount = formatSuggestedSweepAmount(
        matchedSummaryRow.totalBalance,
        network
      );
      if (maxAmountInput !== nextAmount) {
        setMaxAmountInput(nextAmount);
      }
      return;
    }
    if (maxAmountInput !== "") {
      setMaxAmountInput("");
    }
  }, [
    amountTouched,
    isBtcLimitedSweepUi,
    maxAmountInput,
    matchedSummaryRow,
    network,
    cryptocurrencyId,
  ]);

  const requestClose = () => {
    if (isClosing) return;
    onClose();
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Reset flow whenever the modal closes; reopening applies fresh defaults from cached totals.
  useEffect(() => {
    if (open) {
      if (!shouldRender) {
        setShouldRender(true);
      }
      if (isClosing) {
        setIsClosing(false);
      }
    } else if (shouldRender) {
      setIsClosing(true);
      setPreviewRequested(false);
      setMaxAmountInput("");
      setDustThresholdInput("");
      setAmountTouched(false);
      setShowDustThreshold(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open, shouldRender]);

  // The backend computes fueling wallet balance vs. required gas using the exact same
  // estimate that determined walletsBlockedByFee, so we read it straight off the preview
  // instead of polling a separate balance endpoint client-side (which could disagree with
  // the numbers that actually decided the block).
  const fuelingWalletStatus = previewData?.fuelingWalletStatus ?? null;
  const insufficientFuelBalance = !!fuelingWalletStatus && !fuelingWalletStatus.sufficient;
  const showFuelingWalletCard = !!fuelingWalletStatus;

  if (!shouldRender) return null;
  const previewAmountToSweep = showPreview && previewData
    ? Math.max(
        0,
        Math.min(
          previewData.estimatedSweepableAmount,
          !isBtcLimitedSweepUi && parsedMaxAmount !== undefined
            ? parsedMaxAmount
            : Number.POSITIVE_INFINITY
        )
      )
    : 0;
  const zeroSweepReason =
    previewData && previewAmountToSweep === 0
      ? getZeroSweepReason(
          previewData,
          selectedCrypto?.symbol.toUpperCase() ?? ""
        )
      : "";
  const confirmSweepDisabled =
    initiateSweepMutation.isPending || previewAmountToSweep <= 0 || insufficientFuelBalance;

  const handlePreview = () => {
    if (!network || !cryptocurrencyId) {
      toast.error("Please select both network and cryptocurrency");
      return;
    }
    if (dustThresholdInvalid) {
      toast.error("Minimum wallet balance must be a positive number");
      return;
    }
    if (maxAmountInvalid) {
      toast.error("Amount must be a positive number");
      return;
    }
    setPreviewRequested(true);
  };

  const handleInitiate = async () => {
    if (dustThresholdInvalid) {
      toast.error("Minimum wallet balance must be a positive number");
      return;
    }
    if (maxAmountInvalid) {
      toast.error("Amount must be a positive number");
      return;
    }
    if (insufficientFuelBalance && fuelingWalletStatus && previewData) {
      toast.error(
        `Fueling wallet has insufficient balance. Required: ~${fuelingWalletStatus.requiredEstimate.toFixed(6)} ${previewData.feeAssetSymbol}, Available: ${fuelingWalletStatus.balance.toFixed(6)} ${previewData.feeAssetSymbol}`
      );
      return;
    }
    try {
      const sweepOptions =
        !isBtcLimitedSweepUi
          ? {
              ...(parsedDustThresholdOverride !== undefined
                ? {
                    dustThresholdOverride: parsedDustThresholdOverride,
                  }
                : {}),
              ...(parsedMaxAmount !== undefined
                ? { maxTotalAmount: parsedMaxAmount }
                : {}),
            }
          : undefined;
      const result = await initiateSweepMutation.mutateAsync({
        network,
        cryptocurrencyId,
        options:
          sweepOptions && Object.keys(sweepOptions).length > 0
            ? sweepOptions
            : undefined,
      });

      if (result.success && result.data?.sweepId) {
        toast.success("Sweep initiated successfully");
        onClose();
        void navigate({
          to: "/dashboard/treasury/$sweepId",
          params: { sweepId: result.data.sweepId },
        });
      } else {
        toast.error(result.message || "Sweep request was not accepted");
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const resetPreviewAndSetNetwork = (value: string) => {
    setNetwork(value);
    setPreviewRequested(false);
    setAmountTouched(false);

    // If current crypto is not supported on new network, clear it.
    if (cryptocurrencyId && allSupportedCrypto) {
      const selected = allSupportedCrypto.find(
        (c) => c.id === cryptocurrencyId
      );
      if (!selected?.networks?.includes(value)) {
        setCryptocurrencyId("");
      }
    }

    // Auto-select crypto if the new network has exactly one option.
    if (allSupportedCrypto) {
      const availableForNetwork = allSupportedCrypto.filter(
        (c) => c.isActive && c.networks?.includes(value)
      );
      if (availableForNetwork.length === 1) {
        setCryptocurrencyId(availableForNetwork[0].id);
      }
    }
  };

  const resetPreviewAndSetCrypto = (value: string) => {
    setCryptocurrencyId(value);
    setPreviewRequested(false);
    setAmountTouched(false);

    // Auto-select network if the new crypto supports exactly one network.
    if (allSupportedCrypto) {
      const selected = allSupportedCrypto.find((c) => c.id === value);
      if (selected && selected.networks) {
        // If current network not supported or no network selected, auto-select if only one option exists.
        if (!network || !selected.networks.includes(network)) {
          if (selected.networks.length === 1) {
            setNetwork(selected.networks[0]);
          } else if (network) {
            // Current network is not supported by new crypto, and multiple networks available: clear it.
            setNetwork("");
          }
        }
      }
    }
  };

  const handleRefreshBalances = async () => {
    if (!network || !cryptocurrencyId) return;
    await refreshBalancesMutation.mutateAsync({ network, cryptocurrencyId });
    // Pull the (now-invalidated) preview again so the modal reflects fresh totals.
    if (showPreview) await refetchPreview();
  };

  const symbol = selectedCrypto?.symbol.toUpperCase() ?? "";
  const refreshing = refreshBalancesMutation.isPending;
  const amountDecimals = network === "BTC" ? 8 : 6;

  // Format wallet address as xxx...xxx
  function formatWalletAddress(address: string, visible: number = 6): string {
    if (!address || address.length <= visible * 2) return address;
    return `${address.slice(0, visible)}...${address.slice(-visible)}`;
  }

  const previewFeeExplanation = previewData
    ? previewData.feeHandling === "deducted_from_swept_asset"
      ? `Fees are paid in ${previewData.feeAssetSymbol} and reduce the final amount moved when draining the source wallet.`
      : `Fees are paid in ${previewData.feeAssetSymbol} from the fueling wallet for gas, not from the ${symbol || "asset"} amount being swept.`
    : "";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm ${
        isClosing ? "animate-modal-backdrop-out" : "animate-modal-backdrop-in"
      }`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div
        className={`w-full max-w-lg overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white shadow-2xl ${
          isClosing ? "animate-modal-content-out" : "animate-modal-content-in"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[--color-border] px-6 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#667085]">
              Step-by-step flow
            </p>
            <h2 className="text-lg font-semibold text-[--color-text-primary]">
              Initiate Treasury Sweep
            </h2>
          </div>
          <button
            type="button"
            onClick={requestClose}
            className="rounded-lg p-1 transition-colors hover:bg-gray-100"
            aria-label="Close modal"
          >
            <svg
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="max-h-[calc(100vh-250px)] overflow-y-auto p-6 custom-scrollbar">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-[--color-bg-light] p-2">
              <div
                className={`rounded-lg px-3 py-2 text-center text-xs font-semibold ${
                  !previewRequested
                    ? "bg-white text-[#03034D] shadow-sm"
                    : "text-[#667085]"
                }`}
              >
                1. Configure
              </div>
              <div
                className={`rounded-lg px-3 py-2 text-center text-xs font-semibold ${
                  previewRequested
                    ? "bg-white text-[#03034D] shadow-sm"
                    : "text-[#667085]"
                }`}
              >
                2. Please & Confirm
              </div>
            </div>

            <div className="space-y-4">
              <LabeledPillSelect
                label="Select Cryptocurrency"
                value={cryptocurrencyId}
                placeholder="Select crypto to sweep"
                onValueChange={resetPreviewAndSetCrypto}
                options={cryptoOptions}
                disabled={cryptoOptions.length === 0}
              />
              <p className="text-[12px] leading-5 text-[#667085]">
                This chooses which asset balances will be collected into the admin sweep wallet.
              </p>

              <LabeledPillSelect
                label="Select Network"
                value={network}
                placeholder={
                  cryptocurrencyId ? "Select network to sweep" : "Select crypto first"
                }
                onValueChange={resetPreviewAndSetNetwork}
                options={networkOptions}
                disabled={!cryptocurrencyId || networkOptions.length === 0}
              />
              <p className="text-[12px] leading-5 text-[#667085]">
                This chooses the chain those balances live on. Preview only works after both fields are set.
              </p>

              {!hasFuelingWallet && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
                  <div className="flex gap-2.5 items-start">
                    <svg className="h-5 w-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h4 className="text-xs font-bold text-red-800">
                        Fueling Wallet Required
                      </h4>
                      <p className="text-[11px] text-red-700 leading-normal mt-1">
                        Sweeping {symbol} on {network} requires a platform-managed fueling wallet to fund gas/transaction fees. No active fueling wallet is currently configured.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateFuelingWallet}
                    disabled={generateFuelingWalletMutation.isPending}
                    className="w-full h-9 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-semibold text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {generateFuelingWalletMutation.isPending ? "Generating..." : "Generate Fueling Wallet"}
                  </button>
                </div>
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="sweep-max-amount"
                  className="block text-xs font-semibold text-[--color-text-primary]"
                >
                  {isBtcLimitedSweepUi
                    ? "Total to sweep (estimated)"
                    : "Amount to sweep"}
                </label>
                <div className="relative">
                  <input
                    id="sweep-max-amount"
                    type={isBtcLimitedSweepUi ? "text" : "number"}
                    min={isBtcLimitedSweepUi ? undefined : 0}
                    step={isBtcLimitedSweepUi ? undefined : "any"}
                    readOnly={isBtcLimitedSweepUi}
                    inputMode={isBtcLimitedSweepUi ? undefined : "decimal"}
                    placeholder={
                      isBtcLimitedSweepUi
                        ? "Select crypto and preview to load total"
                        : "Leave empty to sweep all (no cap)"
                    }
                    value={maxAmountInput}
                    onChange={(e) => {
                      if (isBtcLimitedSweepUi) return;
                      setAmountTouched(true);
                      setMaxAmountInput(e.target.value);
                    }}
                    className={`h-11 w-full rounded-xl border px-3 pr-14 text-sm text-[--color-text-primary] outline-none transition-all focus:ring-2 ${
                      isBtcLimitedSweepUi
                        ? "cursor-not-allowed border-[#E4E7EC] bg-[#F8F9FC]"
                        : maxAmountInvalid
                        ? "border-red-300 bg-white focus:border-red-400 focus:ring-red-100"
                        : "border-[--color-border-input] bg-white focus:border-[--color-accent-mid] focus:ring-[#DCDDFD]"
                    }`}
                  />
                  {symbol && (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#667085]">
                      {symbol}
                    </span>
                  )}
                </div>
                {isBtcLimitedSweepUi && (
                  <p className="text-xs text-[#667085]">
                    Custom amount caps are not supported for BTC yet.
                  </p>
                )}
                {maxAmountInvalid && (
                  <p className="text-xs text-red-500">
                    Amount must be a positive number.
                  </p>
                )}
              </div>

              {!isBtcLimitedSweepUi && (
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setShowDustThreshold((value) => !value)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#03034D] underline underline-offset-4 transition-colors hover:text-[#050568]"
                    aria-expanded={showDustThreshold}
                    aria-controls="sweep-dust-threshold-panel"
                  >
                    <span>
                      {showDustThreshold
                        ? "Hide minimum wallet balance"
                        : "Add minimum wallet balance"}
                    </span>
                    <svg
                      className={`h-3.5 w-3.5 transition-transform ${
                        showDustThreshold ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {showDustThreshold && (
                    <div
                      id="sweep-dust-threshold-panel"
                      className="space-y-1.5 pt-1"
                    >
                      <label
                        htmlFor="sweep-dust-threshold"
                        className="block text-xs font-semibold text-[--color-text-primary]"
                      >
                        Minimum wallet balance
                      </label>
                      <div className="relative">
                        <input
                          id="sweep-dust-threshold"
                          type="number"
                          min={0}
                          step="any"
                          inputMode="decimal"
                          placeholder="Leave empty to sweep every wallet"
                          value={dustThresholdInput}
                          onChange={(e) => setDustThresholdInput(e.target.value)}
                          className={`h-11 w-full rounded-xl border px-3 pr-14 text-sm text-[--color-text-primary] outline-none transition-all focus:ring-2 ${
                            dustThresholdInvalid
                              ? "border-red-300 bg-white focus:border-red-400 focus:ring-red-100"
                              : "border-[--color-border-input] bg-white focus:border-[--color-accent-mid] focus:ring-[#DCDDFD]"
                          }`}
                        />
                        {symbol && (
                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#667085]">
                            {symbol}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#667085]">
                        Wallets at or below this balance are skipped before fee checks and on-chain execution.
                      </p>
                      {dustThresholdInvalid && (
                        <p className="text-xs text-red-500">
                          Minimum wallet balance must be a positive number.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {showPreview && isPreviewLoading && (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            )}

            {showPreview && previewData && (
              <div className="space-y-3 rounded-xl border border-[#DDE0FF] bg-[--color-primary-taint] p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#667085]">Wallets in scope</span>
                  <span className="font-semibold text-[--color-text-primary]">
                    {previewData.totalWallets}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#667085]">Wallets sweepable now</span>
                  <span className="font-semibold text-[--color-text-primary]">
                    {previewData.walletsSweepable}
                  </span>
                </div>
                {previewData.walletsSkippedBelowThreshold > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#667085]">Below minimum balance</span>
                    <span className="font-semibold text-[#667085]">
                      {previewData.walletsSkippedBelowThreshold}
                    </span>
                  </div>
                )}
                {previewData.walletsBlockedByFee > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#667085]">Blocked by network fees</span>
                    <span className="font-semibold text-[#DC6803]">
                      {previewData.walletsBlockedByFee}
                    </span>
                  </div>
                )}
                {previewData.walletsWithoutSpendableBalance > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#667085]">
                      No spendable BTC UTXOs
                    </span>
                    <span className="font-semibold text-red-600">
                      {previewData.walletsWithoutSpendableBalance}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#667085]">
                    Cached total balance
                  </span>
                  <span className="font-semibold tabular-nums text-[--color-text-primary]">
                    {previewData.estimatedAmount.toFixed(
                      amountDecimals
                    )}{" "}
                    {symbol}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#667085]">Live on-chain balance</span>
                  <span className="font-semibold tabular-nums text-[--color-text-primary]">
                    {previewData.liveBalanceAmount.toFixed(amountDecimals)} {symbol}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#667085]">Estimated network fees</span>
                  <span className="font-semibold tabular-nums text-[#667085]">
                    {previewData.estimatedFeeAmount.toFixed(
                      previewData.feeAssetSymbol === "BTC" ? 8 : 6
                    )}{" "}
                    {previewData.feeAssetSymbol}
                  </span>
                </div>
                {previewAmountToSweep === 0 && (
                  <div className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
                    {zeroSweepReason}
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-[#ECEFFD] pt-2 text-sm">
                  <span className="font-semibold text-[--color-text-primary]">
                    Estimated amount to be swept
                  </span>
                  <span className="font-bold tabular-nums text-[#03034D]">
                    {previewAmountToSweep.toFixed(amountDecimals)}{" "}
                    {symbol}
                  </span>
                </div>
                <p className="text-[11px] leading-5 text-[#667085]">
                  {previewFeeExplanation}
                </p>

                <div className="border-t border-[#ECEFFD] pt-2 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-[--color-text-primary]">
                      Destination
                    </p>
                    <span className="rounded-full bg-[#DCDDFD] px-2 py-0.5 text-[10px] font-semibold text-[#03034D]">
                      Registered Admin Wallet
                    </span>
                  </div>
                  <p className="break-all font-mono text-[11px] text-[#03034D]">
                    {previewData.targetAdminWallet.address}
                  </p>
                </div>

                {showFuelingWalletCard && fuelingWalletStatus && (
                  <div className={`border-t border-[#ECEFFD] pt-2 space-y-1 px-2 py-2 rounded-lg ${insufficientFuelBalance ? 'bg-red-50 border border-red-200' : ''}`}>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-[--color-text-primary]">
                        Fueling Wallet
                      </p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${insufficientFuelBalance ? 'bg-red-100 text-red-700' : 'bg-[#DCDDFD] text-[#03034D]'}`}>
                        {insufficientFuelBalance ? 'No Gas' : 'Gas Fees'}
                      </span>
                    </div>
                    {fuelingWalletStatus.address && (
                      <p className="font-mono text-[11px] text-[#03034D]">
                        {formatWalletAddress(fuelingWalletStatus.address)}
                      </p>
                    )}
                    <div className="space-y-1 mt-2">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-[#667085]">Estimated required:</span>
                        <span className="text-[#03034D] font-semibold">
                          ~{fuelingWalletStatus.requiredEstimate.toFixed(6)} {previewData.feeAssetSymbol}
                        </span>
                      </div>
                      <div className={`flex justify-between text-[10px] ${insufficientFuelBalance ? 'text-red-600' : 'text-[#667085]'}`}>
                        <span>Available:</span>
                        <span className="font-semibold">
                          {fuelingWalletStatus.balance.toFixed(6)} {previewData.feeAssetSymbol}
                        </span>
                      </div>
                    </div>
                    {insufficientFuelBalance && (
                      <p className="text-[10px] text-red-700 font-semibold mt-2">
                        {fuelingWalletStatus.address
                          ? `No ${previewData.feeAssetSymbol} in the fueling wallet to cover gas — top it up before sweeping.`
                          : `No active fueling wallet configured for this network — gas cannot be funded.`}
                      </p>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-[#ECEFFD] pt-2 text-[10px] font-medium leading-tight text-[#667085]">
                  <span
                    className={
                      previewData.oldestRefreshedAt
                        ? "text-[#667085]"
                        : "text-amber-600"
                    }
                    title={
                      previewData.oldestRefreshedAt
                        ? moment(previewData.oldestRefreshedAt).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )
                        : undefined
                    }
                  >
                    {formatRefreshedAt(
                      previewData.oldestRefreshedAt,
                      previewData.neverRefreshedCount
                    )}
                    {previewData.neverRefreshedCount > 0 &&
                      previewData.oldestRefreshedAt && (
                        <span className="ml-1 text-amber-600">
                          ({previewData.neverRefreshedCount} not yet refreshed)
                        </span>
                      )}
                  </span>
                  <button
                    type="button"
                    onClick={handleRefreshBalances}
                    disabled={refreshing}
                    className="inline-flex items-center gap-1 font-semibold text-[#03034D] underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <svg
                      className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    {refreshing ? "Refreshing..." : "Refresh now"}
                  </button>
                </div>
              </div>
            )}

            {previewError && (
              <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-red-600">
                {previewError.message}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 border-t border-[--color-border] bg-[#FBFBFF] px-6 py-4">
          <button
            type="button"
            onClick={requestClose}
            className="flex-1 rounded-xl border border-[#E4E7EC] bg-white px-4 py-2.5 text-sm font-semibold text-[#03034D] transition-colors hover:bg-[#F8F8FF]"
          >
            Cancel
          </button>
          {!showPreview || !previewData ? (
            <button
              onClick={handlePreview}
              disabled={!canPreview || isPreviewLoading}
              className="flex-1 rounded-xl bg-[#03034D] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#050568] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPreviewLoading ? "Loading Preview..." : "Preview Sweep"}
            </button>
          ) : (
            <button
              onClick={handleInitiate}
              disabled={confirmSweepDisabled}
              className="flex-1 rounded-xl bg-[#03034D] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#050568] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {initiateSweepMutation.isPending
                ? "Starting..."
                : previewAmountToSweep <= 0
                ? "Nothing to Sweep"
                : "Confirm Sweep"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
