import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CalendarRange, Layers3, SlidersHorizontal, X } from "lucide-react";
import { TRANSACTION_STATUS_OPTIONS } from "../../../util/constants.util.ts";
import type { SearchSupportedCryptoData } from "../../../types/response.payload.types";
import type { TransactionStatus } from "../../../schemas/enum.schema";
import { DateInput } from "../../ui/date-input";
import { Input } from "../../ui/input";
import { LabeledSelect } from "../../ui/select";
import { cn } from "../../../lib/utils";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  fromDate: Date | undefined;
  toDate: Date | undefined;
  minAmountRange: number | undefined;
  maxAmountRange: number | undefined;
  handleFromDate: (date: Date) => void;
  handleToDate: (date: Date) => void;
  handleMinAmountRange: (amount: number) => void;
  handleMaxAmountRange: (amount: number) => void;
  supportedCryptos: Array<SearchSupportedCryptoData> | null | undefined;
  selectedCryptoId: string | undefined;
  handleSelectedCryptoId: (selectedCryptoId: string) => void;
  selectedStatus: TransactionStatus | undefined | "ALL";
  handleSelectedStatus: (status: TransactionStatus | "ALL") => void;
}

const moneyFormatter = new Intl.NumberFormat("en-NG", {
  maximumFractionDigits: 2,
});

const formatDateLabel = (date: Date | undefined) => {
  if (!date) return "Any date";
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatMoneyLabel = (amount: number | undefined) => {
  if (amount === undefined) return "Any amount";
  return `₦${moneyFormatter.format(amount)}`;
};

const SectionCard = ({
  icon,
  eyebrow,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) => (
  <section className="rounded-[26px] border border-[#E7EAF4] bg-[#FBFCFF] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#EEF1FF] text-[#03034D]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#8A91A8]">
          {eyebrow}
        </p>
        <h3 className="mt-1 text-[16px] font-semibold text-[#0B1027]">
          {title}
        </h3>
        <p className="mt-1 text-[13px] leading-5 text-[#667085]">
          {description}
        </p>
      </div>
    </div>
    <div className="mt-4">{children}</div>
  </section>
);

const ManageTransactionFilterModal = ({
  isOpen,
  onClose,
  onReset,
  fromDate,
  toDate,
  minAmountRange,
  maxAmountRange,
  handleFromDate,
  handleToDate,
  handleMinAmountRange,
  handleMaxAmountRange,
  supportedCryptos,
  selectedCryptoId,
  handleSelectedCryptoId,
  selectedStatus,
  handleSelectedStatus,
}: FilterModalProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = window.setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 200);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const cryptoOptions = useMemo(
    () => [
      { value: "", label: "All cryptocurrencies" },
      ...(supportedCryptos?.map((crypto) => ({
        value: crypto.id,
        label: `${crypto.name} (${crypto.symbol.toUpperCase()})`,
      })) ?? []),
    ],
    [supportedCryptos],
  );

  const selectedCrypto = supportedCryptos?.find(
    (crypto) => crypto.id === selectedCryptoId,
  );

  const selectedStatusLabel =
    TRANSACTION_STATUS_OPTIONS.find((option) => option.value === selectedStatus)
      ?.label ?? "All statuses";

  const summaryItems = [
    {
      label: "Date",
      value: `${formatDateLabel(fromDate)} → ${formatDateLabel(toDate)}`,
    },
    {
      label: "Amount",
      value: `${formatMoneyLabel(minAmountRange)} → ${formatMoneyLabel(maxAmountRange)}`,
    },
    {
      label: "Crypto",
      value: selectedCrypto
        ? `${selectedCrypto.name} (${selectedCrypto.symbol.toUpperCase()})`
        : "All cryptocurrencies",
    },
    {
      label: "Status",
      value: selectedStatusLabel,
    },
  ];

  const activeFilterCount = [
    fromDate || toDate,
    minAmountRange !== undefined || maxAmountRange !== undefined,
    selectedCryptoId,
    selectedStatus !== "ALL",
  ].filter(Boolean).length;

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[1000]" role="dialog" aria-modal="true">
      <div
        className={cn(
          "absolute inset-0 bg-[#050816]/55 backdrop-blur-md",
          isClosing ? "animate-modal-backdrop-out" : "animate-modal-backdrop-in",
        )}
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-end justify-center overflow-y-auto sm:items-center">
        <div className="flex min-h-full w-full items-end justify-center px-0 sm:min-h-0 sm:px-4 sm:py-6">
          <div
            className={cn(
              "relative w-full max-h-[92vh] overflow-y-auto rounded-t-[28px] border border-white/70 bg-white shadow-[0_30px_120px_rgba(11,15,42,0.22)] sm:max-w-[760px] sm:rounded-[32px]",
              isClosing ? "animate-modal-content-out" : "animate-modal-content-in",
            )}
          >
            <div className="px-5 pb-5 pt-6 sm:px-8 sm:pb-8 sm:pt-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8A91A8]">
                    Transaction filters
                  </p>
                  <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.03em] text-[#03034D]">
                    Filter Transactions
                  </h2>
                  <p className="mt-1 max-w-[54ch] text-sm leading-6 text-[#667085]">
                    Use date, amount, crypto, and status to narrow the table
                    without losing the ledger context.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#E6E9F4] bg-[#F7F8FF] px-3 py-2 text-[12px] text-[#344054]">
                    <span className="font-semibold text-[#667085]">
                      Active filters
                    </span>
                    <span className="text-[#03034D]">
                      {activeFilterCount}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close filter modal"
                  className="rounded-full border border-[#E8EBF5] bg-white p-2 text-[#667085] transition-colors hover:border-[#CFD5EA] hover:text-[#03034D]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {summaryItems.map((item) => (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-2 rounded-full border border-[#E6E9F4] bg-[#F7F8FF] px-3 py-2 text-[12px] text-[#344054]"
                  >
                    <span className="font-semibold text-[#667085]">
                      {item.label}
                    </span>
                    <span className="text-[#03034D]">{item.value}</span>
                  </span>
                ))}
              </div>

              <div className="mt-6 grid gap-4">
                <SectionCard
                  icon={<CalendarRange className="h-5 w-5" />}
                  eyebrow="Temporal range"
                  title="Date window"
                  description="Pin the exact period you want to inspect. This applies before pagination, so the table stays focused."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <DateInput
                      value={fromDate}
                      onChange={handleFromDate}
                      placeholder="From"
                      className="rounded-2xl border-[#D8DDF0] bg-[#FBFCFF] px-4 py-3 pr-10 text-[14px] shadow-sm focus:border-[#03034D] focus:shadow-[0_0_0_3px_rgba(3,3,77,0.08)]"
                    />
                    <DateInput
                      value={toDate}
                      onChange={handleToDate}
                      placeholder="To"
                      className="rounded-2xl border-[#D8DDF0] bg-[#FBFCFF] px-4 py-3 pr-10 text-[14px] shadow-sm focus:border-[#03034D] focus:shadow-[0_0_0_3px_rgba(3,3,77,0.08)]"
                    />
                  </div>
                </SectionCard>

                <SectionCard
                  icon={<SlidersHorizontal className="h-5 w-5" />}
                  eyebrow="Value band"
                  title="Amount range"
                  description="Use a minimum and maximum fiat band to collapse noisy outliers out of the view."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Minimum"
                      placeholder="Min"
                      type="number"
                      value={minAmountRange !== undefined ? minAmountRange : ""}
                      onChange={(event) =>
                        handleMinAmountRange(Number(event.target.value))
                      }
                      className={cn(
                        "border-[#D8DDF0] bg-[#FBFCFF] px-4 text-[14px] shadow-sm placeholder:text-[#98A2B3]",
                        "focus:border-[#03034D] focus:ring-[#03034D]/10",
                      )}
                    />
                    <Input
                      label="Maximum"
                      placeholder="Max"
                      type="number"
                      value={maxAmountRange !== undefined ? maxAmountRange : ""}
                      onChange={(event) =>
                        handleMaxAmountRange(Number(event.target.value))
                      }
                      className={cn(
                        "border-[#D8DDF0] bg-[#FBFCFF] px-4 text-[14px] shadow-sm placeholder:text-[#98A2B3]",
                        "focus:border-[#03034D] focus:ring-[#03034D]/10",
                      )}
                    />
                  </div>
                </SectionCard>

                <SectionCard
                  icon={<Layers3 className="h-5 w-5" />}
                  eyebrow="Market scope"
                  title="Asset and status"
                  description="Choose the exact instrument and state to isolate a slice of the ledger."
                >
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                    <LabeledSelect
                      label="Cryptocurrency"
                      value={selectedCryptoId ?? ""}
                      onValueChange={(value) =>
                        handleSelectedCryptoId(value === "__empty__" ? "" : value)
                      }
                      options={cryptoOptions}
                      className="mb-0"
                    />
                    <LabeledSelect
                      label="Status"
                      value={selectedStatus ?? "ALL"}
                      onValueChange={(value) =>
                        handleSelectedStatus(value as TransactionStatus | "ALL")
                      }
                      options={TRANSACTION_STATUS_OPTIONS.map((status) => ({
                        value: status.value || "ALL",
                        label: status.label,
                      }))}
                      className="mb-0"
                    />
                  </div>
                </SectionCard>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#EEF1F7] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-transparent px-4 py-2.5 text-sm font-medium text-[#667085] transition-colors hover:bg-[#F5F7FF] hover:text-[#03034D]"
                  onClick={() => {
                    onReset();
                    onClose();
                  }}
                >
                  Reset filters
                </button>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#03034D] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(3,3,77,0.18)] transition-transform hover:bg-[#0A0A63] active:scale-[0.99]"
                  onClick={onClose}
                >
                  Apply filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTransactionFilterModal;
