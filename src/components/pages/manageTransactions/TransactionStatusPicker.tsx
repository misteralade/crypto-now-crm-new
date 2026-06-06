import type { TransactionAction, TransactionStatusType } from "../../../schemas/enum.schema";
import {
  TRANSACTION_STATUS_UPDATE_OPTIONS,
  transactionStatusStyles,
} from "../../../util/constants.util.ts";

interface TransactionStatusPickerProps {
  transactionType: TransactionAction;
  currentStatus: string;
  selectedStatus?: TransactionStatusType;
  onSelectStatus: (status: TransactionStatusType) => void;
}

const STATUS_GROUP_ORDER: Record<TransactionAction, Array<"BUY" | "BOTH" | "SELL">> =
  {
    BUY: ["BUY", "SELL", "BOTH"],
    SELL: ["SELL", "BUY", "BOTH"],
  };

const STATUS_GROUP_META: Record<
  "BUY" | "SELL" | "BOTH",
  { title: string }
> = {
  BUY: {
    title: "Buy-only statuses",
  },
  SELL: {
    title: "Sell-only statuses",
  },
  BOTH: {
    title: "Shared statuses",
  },
};

const STATUS_DISPLAY_ORDER: Record<
  "BUY" | "SELL" | "BOTH",
  Array<TransactionStatusType>
> = {
  BUY: [
    "AWAITING_PAYMENT",
    "IN_REVIEW",
    "COMPLETED",
    "FAILED",
    "EXPIRED",
    "CANCELLED",
    "DISPUTED",
    "REFUNDED",
  ],
  SELL: [
    "INITIATED",
    "AWAITING_CRYPTO",
    "DEPOSIT_DETECTED",
    "DEPOSIT_PENDING_MINIMUM",
    "DEPOSIT_CONFIRMED",
    "PAYOUT_INITIATED",
    "PROCESSING",
    "PENDING_PAYOUT",
    "PAYOUT_FAILED",
  ],
  BOTH: [
    "COMPLETED",
    "FAILED",
    "CANCELLED",
    "DISPUTED",
  ],
};

const TransactionStatusPicker = ({
  transactionType,
  currentStatus,
  selectedStatus,
  onSelectStatus,
}: TransactionStatusPickerProps) => {
  const renderStatusCard = (
    option: (typeof TRANSACTION_STATUS_UPDATE_OPTIONS)[number]
  ) => {
    const isCurrent = currentStatus === option.value;
    const isSelected = selectedStatus === option.value;
    const colorObj = transactionStatusStyles[option.value] ?? {
      text: option.label,
      bg: "bg-gray-50",
      dot: "bg-gray-400",
      textColor: "text-gray-700",
    };

    return (
      <button
        key={option.value}
        className={`min-h-[84px] rounded-xl border px-3 py-2 text-left transition-all duration-200 ${
          isCurrent
            ? "opacity-55 cursor-not-allowed border-transparent"
            : "hover:shadow-sm cursor-pointer active:scale-[0.99]"
        } ${
          isSelected
            ? `ring-2 ring-[#03034D] ring-offset-1 border-transparent ${colorObj.bg} ${colorObj.textColor}`
            : `border-transparent ${colorObj.bg} ${colorObj.textColor}`
        }`}
        type="button"
        aria-pressed={isSelected}
        onClick={
          !isCurrent ? () => onSelectStatus(option.value) : undefined
        }
        disabled={isCurrent}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="text-[12px] font-semibold leading-tight md:text-[13px]">
            {option.label}
          </div>
          <span className="shrink-0 rounded-full bg-white/70 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-current md:text-[10px]">
            {option.scope}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-5">
      {STATUS_GROUP_ORDER[transactionType].map((scope) => {
        const items = TRANSACTION_STATUS_UPDATE_OPTIONS.filter(
          (option) => option.scope === scope
        ).sort(
          (left, right) =>
            STATUS_DISPLAY_ORDER[scope].indexOf(left.value) -
            STATUS_DISPLAY_ORDER[scope].indexOf(right.value)
        );

        if (items.length === 0) return null;

        const group = STATUS_GROUP_META[scope];

        return (
          <section key={scope}>
            <div className="mb-2">
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#828282]">
                {group.title}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {items.map(renderStatusCard)}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default TransactionStatusPicker;
