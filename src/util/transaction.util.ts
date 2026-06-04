import type {TransactionStatus} from "../schemas/enum.schema.ts";

const MANUAL_PAYOUT_RETRY_STATUSES = new Set<TransactionStatus>([
  "PENDING_PAYOUT",
  "PAYOUT_FAILED",
]);

export enum StatusCategory {
  INITIAL = 'initial',
  IN_PROGRESS = 'in_progress',
  AWAITING = 'awaiting',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

// Status configuration with colors and metadata
const statusConfig: Record<TransactionStatus, {
  category: StatusCategory;
  bgColor: string;
  textColor: string;
  dotColor: string;
  displayName: string;
  description: string;
  isActionable: boolean;
}> = {
  // Initial statuses
  INITIATED: {
    category: StatusCategory.INITIAL,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    dotColor: 'bg-blue-500',
    displayName: 'Initiated',
    description: 'Transaction has been started',
    isActionable: false,
  },

  // In progress statuses
  PROCESSING: {
    category: StatusCategory.IN_PROGRESS,
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    dotColor: 'bg-indigo-500',
    displayName: 'Processing',
    description: 'Transaction is currently being processed',
    isActionable: false,
  },
  // Awaiting statuses
  AWAITING_PAYMENT: {
    category: StatusCategory.AWAITING,
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    dotColor: 'bg-yellow-500',
    displayName: 'Awaiting Payment',
    description: 'Waiting for payment to be received',
    isActionable: true,
  },
  IN_REVIEW: {
    category: StatusCategory.AWAITING,
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    dotColor: 'bg-amber-500',
    displayName: 'In Review',
    description: 'Receipt has been uploaded and is awaiting review',
    isActionable: false,
  },
  AWAITING_CRYPTO: {
    category: StatusCategory.AWAITING,
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    dotColor: 'bg-orange-500',
    displayName: 'Awaiting Crypto',
    description: 'Waiting for cryptocurrency transaction',
    isActionable: false,
  },

  // Success statuses
  COMPLETED: {
    category: StatusCategory.SUCCESS,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    dotColor: 'bg-green-600',
    displayName: 'Completed',
    description: 'Transaction completed successfully',
    isActionable: true,
  },
  // Failed statuses
  FAILED: {
    category: StatusCategory.FAILED,
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    dotColor: 'bg-red-600',
    displayName: 'Failed',
    description: 'Transaction failed',
    isActionable: true,
  },
  EXPIRED: {
    category: StatusCategory.FAILED,
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    dotColor: 'bg-red-500',
    displayName: 'Expired',
    description: 'Transaction has expired',
    isActionable: true,
  },
  DISPUTED: {
    category: StatusCategory.FAILED,
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    dotColor: 'bg-rose-500',
    displayName: 'Disputed',
    description: 'Transaction is under dispute',
    isActionable: true,
  },
  REFUNDED: {
    category: StatusCategory.SUCCESS,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    dotColor: 'bg-green-600',
    displayName: 'Refunded',
    description: 'Transaction refund completed successfully',
    isActionable: true,
  },

  // Cancelled statuses
  CANCELLED: {
    category: StatusCategory.CANCELLED,
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    dotColor: 'bg-gray-500',
    displayName: 'Cancelled',
    description: 'Transaction was cancelled',
    isActionable: true,
  },
  DEPOSIT_DETECTED: {
    category: StatusCategory.AWAITING,
    bgColor: 'bg-sky-50',
    textColor: 'text-sky-700',
    dotColor: 'bg-sky-500',
    displayName: 'Deposit Detected',
    description: 'Blockchain deposit seen, awaiting confirmations',
    isActionable: false,
  },
  DEPOSIT_CONFIRMED: {
    category: StatusCategory.IN_PROGRESS,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    dotColor: 'bg-blue-500',
    displayName: 'Deposit Confirmed',
    description: 'Required confirmations reached, triggering payout',
    isActionable: false,
  },
  PAYOUT_INITIATED: {
    category: StatusCategory.IN_PROGRESS,
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    dotColor: 'bg-indigo-500',
    displayName: 'Payout Initiated',
    description: 'NGN payout instruction sent to fiat rail',
    isActionable: false,
  },
  PAYOUT_FAILED: {
    category: StatusCategory.FAILED,
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    dotColor: 'bg-red-500',
    displayName: 'Payout Failed',
    description: 'Payout attempt failed, will retry',
    isActionable: true,
  },
  PENDING_PAYOUT: {
    category: StatusCategory.AWAITING,
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    dotColor: 'bg-yellow-600',
    displayName: 'Pending Payout',
    description: 'Transaction is awaiting payout due to low platform balance or other non-critical issues',
    isActionable: true,
  },
};

// Utility functions
export const getStatusConfig = (status: string): typeof statusConfig[TransactionStatus] => {
  const normalizedStatus = status.toUpperCase() as TransactionStatus;
  return statusConfig[normalizedStatus] || {
    category: StatusCategory.IN_PROGRESS,
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    dotColor: 'bg-gray-500',
    displayName: status,
    description: 'Unknown status',
    isActionable: false,
  };
};

export const getStatusColors = (status: string) => {
  const config = getStatusConfig(status);
  return {
    background: config.bgColor,
    text: config.textColor,
    dot: config.dotColor,
  };
};

export const getStatusDisplayName = (status: string): string => {
  return getStatusConfig(status).displayName;
};

export const getStatusDescription = (status: string): string => {
  return getStatusConfig(status).description;
};

export const isStatusActionable = (status: string): boolean => {
  return getStatusConfig(status).isActionable;
};

export const getStatusCategory = (status: string): StatusCategory => {
  return getStatusConfig(status).category;
};

// Filter functions for different status categories
export const isSuccessStatus = (status: string): boolean => {
  return getStatusCategory(status) === StatusCategory.SUCCESS;
};

export const isFailedStatus = (status: string): boolean => {
  return getStatusCategory(status) === StatusCategory.FAILED;
};

export const isPendingStatus = (status: string): boolean => {
  const category = getStatusCategory(status);
  return category === StatusCategory.IN_PROGRESS || category === StatusCategory.AWAITING;
};

export const isFinalStatus = (status: string): boolean => {
  const category = getStatusCategory(status);
  return category === StatusCategory.SUCCESS ||
    category === StatusCategory.FAILED ||
    category === StatusCategory.CANCELLED;
};

// Get icon color for download button
export const getDownloadIconColor = (status: string): string => {
  if (isSuccessStatus(status) || isFailedStatus(status)) {
    return "text-accent1 cursor-pointer";
  }
  return "text-grey4 cursor-not-allowed";
};

// Check if download should be disabled
export const isDownloadDisabled = (status: string): boolean => {
  return !isFinalStatus(status);
};

// Simple function to get status colors (compatible with Material Tailwind)
export const getStatusColor = (status: string): string => {
  const config = getStatusConfig(status);
  return `${config.textColor} ${config.bgColor}`;
};

// Simple function to get status dot colors
export const getStatusDot = (status: string): string => {
  const config = getStatusConfig(status);
  return config.dotColor;
};

export const canManuallyRetryPayout = (status: string): boolean => {
  return MANUAL_PAYOUT_RETRY_STATUSES.has(status.toUpperCase() as TransactionStatus);
};
