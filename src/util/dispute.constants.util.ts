import type { DisputeResolution, DisputeStatus } from "../types/dispute.types";

export const getDisputeStatusColor = (status: | 'OPEN' | 'UNDER_REVIEW' | 'AWAITING_EVIDENCE' | 'AWAITING_USER_RESPONSE' | 'AWAITING_ADMIN_RESPONSE' | 'ESCALATED' | 'RESOLVED' | 'REJECTED' | 'CLOSED' ): string => {
  switch (status) {
    case 'OPEN':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'UNDER_REVIEW':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'AWAITING_EVIDENCE':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'AWAITING_USER_RESPONSE':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'AWAITING_ADMIN_RESPONSE':
      return 'bg-teal-100 text-teal-800 border-teal-200';
    case 'ESCALATED':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'RESOLVED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'REJECTED':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'CLOSED':
      return 'bg-gray-50 text-gray-600 border-gray-100';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const DISPUTE_RESOLUTIONS: DisputeResolution[] = [
  'APPROVED',
  'REJECTED',
  'REFUNDED',
  'PARTIALLY_REFUNDED',
  'TRANSACTION_CORRECTED',
  'NO_ACTION_REQUIRED',
  // 'ESCALATED_TO_MANAGEMENT',
];

export const disputePriorityStyles: Record<
  string,
  { text: string; bg: string; dot: string; textColor: string }
> = {
  LOW: {
    text: "Low",
    bg: "bg-gray-50",
    dot: "bg-gray-400",
    textColor: "text-gray-700",
  },
  MEDIUM: {
    text: "Medium",
    bg: "bg-blue-50",
    dot: "bg-blue-400",
    textColor: "text-blue-700",
  },
  HIGH: {
    text: "High",
    bg: "bg-orange-50",
    dot: "bg-orange-400",
    textColor: "text-orange-700",
  },
  URGENT: {
    text: "Urgent",
    bg: "bg-red-50",
    dot: "bg-red-500",
    textColor: "text-red-700",
  },
};

export const disputeResolutionStyles: Record<
  string,
  { text: string; bg: string; dot: string; textColor: string }
> = {
  APPROVED: {
    text: "Approved",
    bg: "bg-green-50",
    dot: "bg-green-500",
    textColor: "text-green-700",
  },
  REJECTED: {
    text: "Rejected",
    bg: "bg-red-50",
    dot: "bg-red-400",
    textColor: "text-red-700",
  },
  REFUNDED: {
    text: "Refunded",
    bg: "bg-blue-50",
    dot: "bg-blue-400",
    textColor: "text-blue-700",
  },
  PARTIALLY_REFUNDED: {
    text: "Partially Refunded",
    bg: "bg-yellow-50",
    dot: "bg-yellow-400",
    textColor: "text-yellow-700",
  },
  TRANSACTION_CORRECTED: {
    text: "Transaction Corrected",
    bg: "bg-purple-50",
    dot: "bg-purple-400",
    textColor: "text-purple-700",
  },
  NO_ACTION_REQUIRED: {
    text: "No Action Required",
    bg: "bg-gray-50",
    dot: "bg-gray-400",
    textColor: "text-gray-700",
  },
  ESCALATED_TO_MANAGEMENT: {
    text: "Escalated to Management",
    bg: "bg-red-50",
    dot: "bg-red-500",
    textColor: "text-red-700",
  },
};

export const disputeStatusStyles: Record<
  string,
  { text: string; bg: string; dot: string; textColor: string }
> = {
  OPEN: {
    text: "Open",
    bg: "bg-yellow-50",
    dot: "bg-yellow-400",
    textColor: "text-yellow-700",
  },
  UNDER_REVIEW: {
    text: "Under Review",
    bg: "bg-blue-50",
    dot: "bg-blue-400",
    textColor: "text-blue-700",
  },
  AWAITING_EVIDENCE: {
    text: "Awaiting Evidence",
    bg: "bg-purple-50",
    dot: "bg-purple-400",
    textColor: "text-purple-700",
  },
  AWAITING_USER_RESPONSE: {
    text: "Awaiting User Response",
    bg: "bg-orange-50",
    dot: "bg-orange-400",
    textColor: "text-orange-700",
  },
  AWAITING_ADMIN_RESPONSE: {
    text: "Awaiting Admin Response",
    bg: "bg-teal-50",
    dot: "bg-teal-400",
    textColor: "text-teal-700",
  },
  ESCALATED: {
    text: "Escalated",
    bg: "bg-red-50",
    dot: "bg-red-400",
    textColor: "text-red-700",
  },
  RESOLVED: {
    text: "Resolved",
    bg: "bg-green-50",
    dot: "bg-green-400",
    textColor: "text-green-700",
  },
  REJECTED: {
    text: "Rejected",
    bg: "bg-gray-100",
    dot: "bg-gray-500",
    textColor: "text-gray-700",
  },
  CLOSED: {
    text: "Closed",
    bg: "bg-gray-50",
    dot: "bg-gray-400",
    textColor: "text-gray-700",
  },
};


export const getStatusMessage = (status: DisputeStatus): string => {
  const messages: Record<DisputeStatus, string> = {
    OPEN: "Mark this dispute as open and ready for review.",
    UNDER_REVIEW: "Move this dispute to under review status. Your team will investigate the issue.",
    AWAITING_EVIDENCE: "Request additional evidence from the user to proceed with this dispute.",
    AWAITING_USER_RESPONSE: "Mark as awaiting user response. The user will be notified to provide more information.",
    AWAITING_ADMIN_RESPONSE: "Mark as awaiting admin response. This indicates that admin action is required.",
    ESCALATED: "Escalate this dispute to management for immediate attention and further review.",
    RESOLVED: "Mark this dispute as resolved. Select a resolution type and provide detailed notes.",
    REJECTED: "Reject this dispute. Provide a clear reason for rejection.",
    CLOSED: "Close this dispute. Provide closing notes for documentation purposes.",
  };
  return messages[status] || "Update the status of this dispute.";
};