import { z } from "zod";

export const TransactionAction = z.preprocess(
  (val) => {
    if (typeof val === "string") return val.toUpperCase();

    return val;
  },
  z.enum(['BUY', 'SELL'])
);

export const TransactionStatus = z.preprocess(
  (val) => {
    if (typeof val === "string") return val.toUpperCase();

    return val;
  },
  z.enum(['INITIATED', 'PENDING', 'AWAITING_PAYMENT', 'PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED', 'PROCESSING', 'AWAITING_CRYPTO', 'CRYPTO_SENT', 'CRYPTO_RECEIVED', 'CRYPTO_CONFIRMED', 'COMPLETED', 'FAILED', 'EXPIRED', 'CANCELLED', 'DISPUTED', 'REFUNDING', 'REFUNDED', 'PAYMENT_ACCOUNT_CONFIRMED']),
);

export const TransactionPriority = z.preprocess(
  (val) => {
    if (typeof val === "string") return val.toUpperCase();

    return val;
  },
  z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
);

export const BankType = z.preprocess(
  (val) => {
    if (typeof val === "string") return val.toUpperCase();

    return val;
  },
  z.enum([
    "COMMERCIAL",
    "COOPERATIVE",
    "MICROFINANCE",
    "INVESTMENT",
    "SAVINGS",
    "DIGITAL",
    "CREDIT_UNION",
    "CENTRAL",
    "DEVELOPMENT",
    "ISLAMIC",
    "OTHER",
  ]),
);

export const BankAndCryptoType = z.preprocess((val) => {
  if (typeof val === "string") return val.toUpperCase();

  return val;
}, z.enum(["RECEIVING", "SENDING", "BOTH"]));

export const CryptoNetworkType = z.preprocess((val) => {
  if (typeof val === "string") return val.toUpperCase();
  return val;
}, z.enum([
  "BTC",
  "ERC20",
  "TRC20",
  "BEP20",
  "SOLANA",
  "POLYGON",
  "ARBITRUM",
  "OPTIMISM",
  "AVALANCHE",
  "FANTOM",
  "BSC",
  "CARDANO",
  "POLKADOT",
  "COSMOS",
  "TERRA",
  "NEAR",
  "HARMONY",
  "MOONBEAM",
  "CRONOS",
  "KCC",
  "HECO",
  "XDAI",
  "CELO",
  "ALGORAND",
  "TEZOS",
  "ELROND",
  "KLAYTN",
  "OKEX"
]));

export const TimelineEnumType = z.preprocess((val) => {
  if (typeof val === "string") return val.toUpperCase();

  return val;
}, z.enum(["WEEK", "MONTH", "YEAR", "ALL"]));

export const UserStatus = z.preprocess(
  (val) => {
    if (typeof val === "string") return val.toUpperCase();

    return val;
  },
  z.enum(['ACTIVE', 'PENDING', 'SUSPENDED', 'BANNED', 'DELETED']),
)

export const RequestTypeEnum = z.preprocess((val) => {
  if (typeof val === "string") return val.toUpperCase();

  return val;
}, z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]));

export const UserTypeEnum = z.preprocess((val) => {
  if (typeof val === "string") return val.toUpperCase();

  return val;
}, z.enum(["ADMIN", "USER", "ANONYMOUS"]));

export const NotificationTypeEnum = z.preprocess((val) => {
  if (typeof val === "string") return val.toUpperCase();

  return val;
}, z.enum([
  'USER_INITIATED_TRANSACTION',
  'ANONYMOUS_USER_INITIATED_TRANSACTION',
  'ADMIN_UPDATED_TRANSACTION_STATUS',
  'ANONYMOUS_USER_INITIATES_TRANSACTION_RECEIPT_UPLOAD',
  'ANONYMOUS_USER_COMPLETED_TRANSACTION_RECEIPT_UPLOAD',
  'USER_INITIATES_TRANSACTION_RECEIPT_UPLOAD',
  'USER_COMPLETED_TRANSACTION_RECEIPT_UPLOAD',
  'USER_CONFIRMS_RECEIVING_ACCOUNT',
]));

export const AttachmentTypeEnum = z.preprocess((val) => {
  if (typeof val === "string") return val.toUpperCase();
  
  return val;
}, z.enum(["IMAGE", "VIDEO", "DOCUMENT", "PDF", "AUDIO", "SPREADSHEET", "OTHER"]));

export const DisputeStatusEnum = z.preprocess((val) => {
  if (typeof val === "string") return val.toUpperCase();
  
  return val;
}, z.enum(["OPEN", "UNDER_REVIEW", "AWAITING_EVIDENCE", "AWAITING_USER_RESPONSE", "AWAITING_ADMIN_RESPONSE", "ESCALATED", "RESOLVED", "REJECTED", "CLOSED"]));

export const DisputeResolutionEnum = z.preprocess((val) => {
  if (typeof val === "string") return val.toUpperCase();
  
  return val;
}, z.enum(["APPROVED", "REJECTED", "REFUNDED", "PARTIALLY_REFUNDED", "TRANSACTION_CORRECTED", "NO_ACTION_REQUIRED", "ESCALATED_TO_MANAGEMENT"]) )

export const DisputePriorityEnum = z.preprocess((val) => {
  if (typeof val === "string") return val.toUpperCase();
  
  return val;
}, z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]));

export const TestimonialContentTypeEnum = z.preprocess((val) => {
  if (typeof val === "string") return val.toUpperCase();
  
  return val;
}, z.enum(["VIDEO", "IMAGE", "TEXT"]));

export type TimelineEnumType = z.infer<typeof TimelineEnumType>;
export type CryptoNetworkType = z.infer<typeof CryptoNetworkType>;
export type TransactionAction = z.infer<typeof TransactionAction>;
export type TransactionStatus = z.infer<typeof TransactionStatus>;
export type TransactionStatusType = z.infer<typeof TransactionStatus>;
export type TransactionPriority = z.infer<typeof TransactionPriority>;
export type UserStatusType = z.infer<typeof UserStatus>;
export type RequestTypeEnumType = z.infer<typeof RequestTypeEnum>;
export type UserTypeEnumType = z.infer<typeof UserTypeEnum>;
export type DisputeStatusEnumType = z.infer<typeof DisputeStatusEnum>;
export type DisputeResolutionEnumType = z.infer<typeof DisputeResolutionEnum>;
export type DisputePriorityEnumType = z.infer<typeof DisputePriorityEnum>;
export type AttachmentTypeEnumType = z.infer<typeof AttachmentTypeEnum>;
export type TestimonialContentTypeEnumType = z.infer<typeof TestimonialContentTypeEnum>;
