import type { AxiosError } from 'axios'
import type {
  TransactionAction,
  TransactionPriority,
  TransactionStatus,
  UserStatusType,
  UserTypeEnumType
} from "../schemas/enum.schema";
import type {DisputePriority, DisputeResolution, DisputeStatus} from "./dispute.types.ts";

export interface StandardizedServerError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type AxiosServerError = AxiosError<StandardizedServerError>;

export type BaseApiResponse<T> = {
  success: boolean;
  message: string;
  error: any;
  data: T;
};

// Start Auth
export type AuthAPIResponse = BaseApiResponse<null>
// End Auth

// Transaction Start
export type GetTransactionVolumeAPIResponse = BaseApiResponse<WeeklyTransactionVolume>

export type GetTransactionVolumeTrendAPIResponse = BaseApiResponse<Array<WeeklyTransactionVolumeTrend>>

export type GetTransactionCountAPIResponse = BaseApiResponse<number>

export type GetTransactionTypeByPercentageAPIResponse = BaseApiResponse<Array<TransactionTypeByPercentage>>

export type GetUsersWithTopTransactionVolumeAPIResponse = BaseApiResponse<Array<UsersWithTopTransactionVolume>>

export type SearchTransactionsAPIResponse = BaseApiResponse<{
  transactions: Array<SearchTransactionsResponse>;
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}>;

export type GetTransactionDetailsAPIResponse = BaseApiResponse<SearchTransactionsResponse>

export type SearchTransactionsResponse = {
  adminPaymentReceiptUrl: string | undefined;
  id: string;
  userId: string;
  sessionId: string;
  cryptocurrencyId: string;
  rateSnapshot: Record<string, any> | null;
  type: TransactionAction;
  amountCrypto: string;
  amountFiat: string;
  amountFiatNGN: number;
  cryptoToStableRate: string;
  stableToFiatRate: string;
  stableToCryptoRate: string;
  currency: string;
  status: TransactionStatus;
  email: string | undefined;
  priority: TransactionPriority;
  transactionActivities: TransactionActivities[];


  userBankAccountId: string;
  adminBankAccountId: string;
  userCryptoWalletId: string;
  bankTransferReference: string;
  receiptImageUrl: string;
  adminCryptoWalletId: string;
  cryptoTxHash: string;
  depositAddress?: string | null;
  adminNotes: string;
  userNotes: string;
  internalNotes: string;
  failureReason: string;
  processedBy: string;
  processedAt: Date;
  usdAmount: number;
  createdAt: Date;
  updatedAt: Date;
  

  // Relations
  user?: UserResponsePayload;
  profile?: UserProfileResponsePayload;
  cryptocurrency?: SearchSupportedCryptoData;
  exchangeRate?: ExchangeRateResponsePayload;
  adminBankAccount?: AdminBankAccountResponsePayload;
  adminCryptoWallet?: AdminCryptoWalletResponsePayload;
  userBankAccount?: UserBankAccountResponsePayload;
  userCryptoWallet?: UserCryptoWalletResponsePayload;
  processor?: AdminResponsePayload;
  dispute?: DisputeDetailsResponse;
  ledgerEntries?: LedgerEntryResponsePayload[];
}

export type AdminRetryPendingPayoutsResponse = {
  retriedCount: number;
  skippedCount: number;
  warnings: string[];
  requiresConfirmation: boolean;
  forceProceed: boolean;
};

export type PayoutAutoApprovalLimitResponsePayload = {
  thresholdNgn: number;
  isFallback: boolean;
};

export type PayoutAutoApprovalLimitAPIResponse =
  BaseApiResponse<PayoutAutoApprovalLimitResponsePayload>;

export type AdminTransactionStatsResponse = {
  totalOrders: number;
  payoutsSent: number;
  completed: number;
  payoutFailed: number;
  inReview: number;
  pendingPayout: number;
  critical: number;
};

export type WeeklyTransactionVolume = {
  totalFiatVolume: string;
  totalUsdVolume: string;
  transactionCount: string;
};

export type TransactionActivities = {
  id: string;
  transactionId: string;
  adminId: string;
  action: string;
  message: string;
  createdAt: Date;
}

export type LedgerEntryResponsePayload = {
  id: string;
  transactionId: string;
  accountType: string;
  entryType: string;
  amount: string;
  currency: string;
  description: string;
  userId: string | null;
  referenceId: string | null;
  referenceType: string | null;
  runningBalance: string | null;
  createdAt: Date;
}

export type WeeklyTransactionVolumeTrend = {
  totalFiatVolume: string;
  totalUsdVolume: string;
  transactionCount: string;
  dateLabel: string;
};

export type TransactionTypeByPercentage = {
  type: string;
  count: number;
  percentage: string;
}

export type UsersWithTopTransactionVolume = {
  id: string;
  sessionId: string;
  type: string;
  currency: string;
  amountFiat: string;
  amountCrypto: string;
  stableToFiatRate: string;
  usdEquivalent: string;
  status: string;
  createdAt: Date;
  cryptoSymbol: string;
  cryptoName: string;
  cryptoLogoUrl: string;
  userEmail: string;
  userFirstName: string;
  userLastName: string;
}

export type TransactionSummaryResponsePayload = {
  cryptoCurrencySymbol: string;
  cryptoCurrencyName: string;
  cryptoCurrencyId: string;
  cryptoCurrencyImageUrl: string;
  transactionCount: string;
  totalFiatAmount: string;
  totalCryptoAmount: string;
  totalUsdAmount: string;
  cryptoBought: string;
  cryptoSold: string;
  usdSpentOnBuying: string;
  usdReceivedFromSelling: string;
  fiatSpentOnBuying: string;
  fiatReceivedFromSelling: string;
  buyTransactionCount: string;
  sellTransactionCount: string;
  currency: string;
}
// Transaction End

// Start User
export type GetDashboardUserStatsSummaryAPIResponse = BaseApiResponse<DashboardUserStatsSummary>

export type GetSummarisedUserProfileAPIResponse = BaseApiResponse<SummarisedUserProfileResponsePayload>

export type GetUserProfileAPIResponse = BaseApiResponse<UserResponsePayload>

export type AdminSearchUsersAPIResponse = BaseApiResponse<{
  users: Array<AdminSearchUsersResponsePayload>;
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}>

export type AdminSearchUsersResponsePayload = {
  user: UserResponsePayload;
  profile: UserProfileResponsePayload;
  bankAccounts: Array<UserBankAccountResponsePayload>;
  cryptoWallets: Array<UserCryptoWalletResponsePayload>;
  transactions: Array<SearchTransactionsResponse>;
  notifications: Array<NotificationResponsePayload>;
  totalVolume: number;
  totalVolumeUsd: number;
}

export type UserResponsePayload = {
  id: string;
  email: string;
  status: UserStatusType;
  isVerified: boolean;
  lastLogin: Date;
  createdAt: Date;
  profile?: UserProfileResponsePayload;
}

export type DashboardUserStatsSummary = {
  newUsersCount: number;
  activeUsersCount: number;
  pendingPayoutsCount?: number;
};

export type SummarisedUserProfileResponsePayload = {
  user: UserResponsePayload;
  bankDetails: Array<UserBankAccountResponsePayload>;
  transactionSummary: Array<TransactionSummaryResponsePayload>
}
// End User

// Start Notification
export type NotificationResponsePayload = {
  id: string;
  userId: string;
  title: string;
  message: string;
  createdAt: Date;
}
// End Notification

// Start Profile
export type UserProfileResponsePayload = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  profileImg: string;
  createdAt: Date;
  phoneNumber: string | null;
  dateOfBirth: Date | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
}
// End Profile

// Start Crypto
export type SearchSupportedCryptoAPIResponse = BaseApiResponse<SearchSupportedCryptoResponse>

export type GetAllSupportedCryptoAPIResponse = BaseApiResponse<Array<SearchSupportedCryptoData>>

export type GetSupportedCryptoAPIResponse = BaseApiResponse<SearchSupportedCryptoData>;

export type SearchSupportedCryptoResponse = {
  supportedCryptos: Array<SearchSupportedCryptoData>;
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type SearchSupportedCryptoData = {
  id: string;
  name: string;
  description: string;
  symbol: string;
  maxTransactionLimit: string;
  minTransactionLimit: string;
  maxTradeAmountForAnonymous: string;
  minTradeAmountForAnonymous: string;
  isStableCoin: boolean;
  logoUrl: string;
  createdAt: Date;
  buyRate: string;
  sellRate: string;
  isActive: boolean;
  websiteUrl: string;
  whitepaperUrl: string;
  networks: string[];
  blockchainEnvironment: "testnet" | "mainnet";
  adminCryptoWallets: Array<AdminCryptoWalletResponsePayload>;
};

export type SupportedExchangeRateResponse = {
  fiatRate: number;
  coinGeckoRate: number;
  currency: string;
  platformRate: number;
  usdRate: number;
};

export type AdminCryptoWalletResponsePayload = {
  id: string;
  createdBy: string;
  walletAddress: string;
  isActive: string;
  network: string;
  blockchainEnvironment: "testnet" | "mainnet";
  createdAt: Date;
}

export type UserCryptoWalletResponsePayload = {
  id: string;
  userId: string;
  walletAddress: string;
  walletLabel?: string | null;
  network: string;
  isPrimary: boolean;
  isVerified: boolean;
  createdAt: Date;
  cryptocurrency?: {
    id?: string;
    symbol?: string;
    name?: string;
  };
}

export type CustodialWalletResponsePayload = {
  id: string;
  userId: string;
  cryptocurrencyId: string;
  network: string;
  blockchainEnvironment: "testnet" | "mainnet";
  walletAddress: string;
  derivationIndex: number;
  derivationPath: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AdminGetUserCustodialWalletsAPIResponse = BaseApiResponse<Array<CustodialWalletResponsePayload>>

export type AdminCustodialWalletDetailsResponsePayload = {
  wallet: {
    id: string;
    userId: string;
    cryptocurrencyId: string;
    network: string;
    blockchainEnvironment: "testnet" | "mainnet";
    walletAddress: string;
    derivationIndex: number;
    derivationPath: string | null;
    webhookProvider: string;
    isActive: boolean;
    lastDepositAt: Date | null;
    totalDepositsCount: number;
    cachedBalance: string;
    cachedBalanceUpdatedAt: Date | null;
    cachedBalanceSource: string;
    createdAt: Date;
    updatedAt: Date;
  };
  user: UserResponsePayload | null;
  cryptocurrency: {
    id: string;
    name: string;
    symbol: string;
    logoUrl: string | null;
    networks: string[];
    isActive: boolean;
    buyRate: string;
    sellRate: string;
    createdAt: Date;
  } | null;
}

export type AdminCustodialWalletDetailsAPIResponse = BaseApiResponse<AdminCustodialWalletDetailsResponsePayload>

export type RefreshCustodialWalletBalanceResponsePayload = {
  walletAddress: string;
  cachedBalance: string;
  cachedBalanceUpdatedAt: Date;
  cachedBalanceSource: string;
}

export type RefreshCustodialWalletBalanceAPIResponse = BaseApiResponse<RefreshCustodialWalletBalanceResponsePayload>

export type AdminGetUserCryptoWalletsAPIResponse = BaseApiResponse<Array<UserCryptoWalletResponsePayload>>

export type AdminGenerateUserCustodialWalletsAPIResponse = BaseApiResponse<Array<CustodialWalletResponsePayload>>
// End Crypto

// Start Upload
export type UploadAPIResponse = BaseApiResponse<{ url: string; signedUrl: string }>;
// End Upload

// Start Exchange Rate
export type GetPlatformExchangeRatesAPIResponsePayload = BaseApiResponse<Array<GetPlatformExchangeRatesResponsePayload>>

export type GetPlatformExchangeRatesResponsePayload = {
  id: string;
  fiat: string;
  currencyId: string;
  buyRate: string;
  sellRate: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ExchangeRateResponsePayload = {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  platformRate: string;
  rate: string;
  action: string;
  createdAt: Date;
}
// End Exchange Rate

// Start Bank Accounts
export type GetAllPlatformBankAccountAPIResponsePayload = BaseApiResponse<Array<AdminBankAccountResponsePayload>>

export type GetSupportedPlatformBankAccountAPIResponsePayload = BaseApiResponse<Array<SupportedPlatformBankAccountResponse>>

export type SearchSupportedBanksAPIResponse = BaseApiResponse<{
  banks: Array<AdminBankAccountResponsePayload>;
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}>;

export type SupportedPlatformBankAccountResponse = {
  id: string;
  name: string;
  logoUrl: string;
}

export type AdminBankAccountResponsePayload = {
  id: string;
  bankName: string;
  bankLogo: string;
  accountNumber: string;
  accountHolderName: string;
  isActive: boolean
  isDeleted: boolean;
  isDefault: boolean;
  instructions: string;
  type: string;
  label: string;
  createdAt: Date;
}

export type UserBankAccountResponsePayload = {
  id: string;
  userId: string;
  bankName: string;
  bankLogo: string;
  accountName: string;
  accountNumber: string;
  isDeleted: boolean;
  isDefault: boolean;
  createdAt: Date;
}
// End Bank Accounts

// Start Admin Management
export type AdminGetAllPermissionsAPIResponse = BaseApiResponse<Array<AdminPermissionResponsePayload>>;

export type AdminGetAllRolesAPIResponse = BaseApiResponse<Array<RolesResponsePayload>>;

export type SearchAdminsAPIResponse = BaseApiResponse<AdminSearchAdminsResponse>;

export type AdminSearchAdminsResponse = {
  admins: Array<SearchAdminResponsePayload>;
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type SearchAdminResponsePayload = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  active: boolean;
  lastActive: Date;
  createdAt: Date;
  adminRoles: Array<SearchAdminRoleResponsePayload>
}

export type SearchAdminRoleResponsePayload = {
  id: string;
  adminId: string;
  roleId: string;
  createdAt: Date;
  role: RolesResponsePayload;
}

export type RolesResponsePayload = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export type AdminPermissionResponsePayload = {
  id: string;
  code: string;
  description: string;
  createdAt: Date;
}

export type AdminResponsePayload = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImg: string;
  adminRoles: Array<RolesResponsePayload>;
  lastActive: Date;
  active: boolean;
  createdAt: Date;
}
// Stop Admin Management

// Start Audit Logs
export type AdminSearchAuditLogsAPIResponse = BaseApiResponse<AdminSearchAuditLogsResponse>;

export type AdminSearchAuditLogsResponse = {
  logs: Array<AuditLogResponsePayload>;
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AuditLogResponsePayload = {
  id: string;
  userId: string;
  adminId: string;
  method: string;
  category: string;
  action: string;
  userType: UserTypeEnumType,
  deviceType: string;
  createdAt: Date;
  admin: AdminResponsePayload | null
  user: UserResponsePayload | null
}
// End Audit Logs

// Start Notification
export type AdminSearchNotificationsAPIResponse = BaseApiResponse<AdminSearchNotificationsResponse>;

export type AdminSearchNotificationsResponse = {
  notifications: Array<AdminSearchNotifications>
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AdminSearchNotifications = {
  id: string;
  userId: string;
  adminUserId: string;
  transactionId: string;
  type: string;
  title: string;
  message: string;
  createdAt: Date;
  user: UserResponsePayload;
  adminUser: AdminResponsePayload;
  transaction: SearchTransactionsResponse;
}
// End Notification

// Start Dispute
export type AdminSearchDisputesAPIResponse = BaseApiResponse<AdminSearchDisputesResponse>;

export type GetDisputeMessagesAPIResponse = BaseApiResponse<Array<DisputeMessageResponse>>

export type GetDisputeDetailsAPIResponse = BaseApiResponse<DisputeDetailsResponse>

export type AttachmentType =
  | 'IMAGE'
  | 'VIDEO'
  | 'PDF'
  | 'DOCUMENT'
  | 'AUDIO'
  | 'SPREADSHEET'
  | 'OTHER';

export interface MessageAttachment {
  url: string;
  type: AttachmentType;
  filename: string;
  size: number; // in bytes
  mimeType: string;
  uploadedAt: Date;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number; // for videos in seconds
    pageCount?: number; // for PDFs
    [key: string]: any;
  };
}

export type AdminSearchDisputesResponse = {
  disputes: Array<AdminSearchDisputes>;
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AdminSearchDisputes = {
  id: string;
  transactionId: string;
  disputeReason: string;
  resolution: DisputeResolution;
  status: DisputeStatus;
  priority: DisputePriority;
  transaction: SearchTransactionsResponse;
  creator: UserResponsePayload;
  createdAt: Date;
  updatedAt: Date;
}

export type DisputeMessageResponse = {
  id: string;
  disputeId: string;
  messageText: string;
  attachments: MessageAttachment[];
  senderType: 'USER' | 'ADMIN';
  adminId: string | null;
  userId: string | null;
  email: string;
  admin: AdminResponsePayload;
  user: UserResponsePayload;
  createdAt: Date;
}

export type DisputeDetailsResponse = {
  internalNotes: string;
  id: string;
  disputeReason: string;
  status: DisputeStatus;
  priority: DisputePriority;
  lastMessageAt: Date;
  attachments: MessageAttachment[];
  resolutionNotes: string | null;
  transaction: SearchTransactionsResponse | null;
  creator: UserResponsePayload | null;
  resolver: AdminResponsePayload | null;
  createdAt: Date;
  updatedAt: Date;
}
// End Dispute

// Start Testimonial
export type TestimonialResponsePayload = {
  id: string;
  contentLink: string;
  name: string | null;
  description: string | null;
  contentType: "VIDEO" | "IMAGE" | "TEXT";
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type GetTestimonialsAPIResponse = BaseApiResponse<{
  testimonials: Array<TestimonialResponsePayload>;
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}>;

export type GetTestimonialDetailsAPIResponse = BaseApiResponse<TestimonialResponsePayload>;
// End Testimonial

// Start KYC Tier Limits
export type KycTierLimitResponsePayload = {
  id: string;
  kycTier: 'GUEST' | 'VERIFIED';
  currencyCode: string;
  minTransactionAmount: string;
  maxTransactionAmount: string;
  dailyLimit: string;
  monthlyLimit: string;
  maxPayoutAttempts: number;
  requiredConfirmationsBTC: number;
  requiredConfirmationsSOL: number;
  requiredConfirmationsTRC20: number;
  isActive: boolean;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type GetAllKycTierLimitsAPIResponse = BaseApiResponse<KycTierLimitResponsePayload[]>;
export type CreateKycTierLimitAPIResponse = BaseApiResponse<null>;
// End KYC Tier Limits

// Start Supported Currency
export type SupportedCurrencyResponsePayload = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
  logoUrl: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalInfo: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

export type GetAllCurrenciesAPIResponse = BaseApiResponse<SupportedCurrencyResponsePayload[]>;
// End Supported Currency
