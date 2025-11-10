import clsx from "clsx";
import {disputePriorityStyles, disputeResolutionStyles, disputeStatusStyles, transactionStatusStyles} from "../../util/constants.util.ts";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const variant = transactionStatusStyles[status.toUpperCase()] ?? {
    text: status,
    bg: "bg-gray-50",
    dot: "bg-gray-400",
    textColor: "text-gray-700",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
        variant.bg,
        variant.textColor
      )}
    >
      <span className={clsx("h-2 w-2 rounded-full", variant.dot)} />
      {variant.text}
    </span>
  );
};

export const DisputeStatusBadge = ({ status }: StatusBadgeProps) => {
  const variant = disputeStatusStyles[status.toUpperCase()] ?? {
    text: status,
    bg: "bg-gray-50",
    dot: "bg-gray-400",
    textColor: "text-gray-700",
  };
  
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
        variant.bg,
        variant.textColor
      )}
    >
      <span className={clsx("h-2 w-2 rounded-full", variant.dot)} />
      {variant.text}
    </span>
  );
};

export const DisputeResolutionBadge = ({ resolution }: { resolution: string }) => {
  const variant = disputeResolutionStyles[resolution.toUpperCase()] ?? {
    text: resolution,
    bg: "bg-gray-50",
    dot: "bg-gray-400",
    textColor: "text-gray-700",
  };
  
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
        variant.bg,
        variant.textColor
      )}
    >
      <span className={clsx("h-2 w-2 rounded-full", variant.dot)} />
      {variant.text}
    </span>
  );
};

export const DisputePriorityBadge = ({ priority }: { priority: string }) => {
  const variant = disputePriorityStyles[priority.toUpperCase()] ?? {
    text: priority,
    bg: "bg-gray-50",
    dot: "bg-gray-400",
    textColor: "text-gray-700",
  };
  
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
        variant.bg,
        variant.textColor
      )}
    >
      <span className={clsx("h-2 w-2 rounded-full", variant.dot)} />
      {variant.text}
    </span>
  );
};
