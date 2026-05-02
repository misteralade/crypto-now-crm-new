import { CRYPTO_NETWORK, TRANSACTION_STATUS } from './enum'

export const TIME_IN_MILLISECONDS = {
  FIVE_HUNDRED_MILLISECONDS: 500,
  ONE_SECOND: 1000,
  TEN_SECONDS: 10 * 1000,
  ONE_MINUTE: 60 * 1000,
  TWO_MINUTES: 2 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
}

export const NUMBERS = {
  ONE: 1,
  ONE_HUNDRED: 100,
  ONE_THOUSAND: 1_000,
  ONE_MILLION: 1_000_000,
  ONE_BILLION: 1_000_000_000,

  // Fives'
  FIVE_HUNDRED: 500,
}

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
}

export const ROUTES = {
  LOGIN: '/',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/dashboard/transactions',
  TRANSACTIONS_DETAILS: '/dashboard/transactions/$id',
  DISPUTES: '/dashboard/disputes',
  EDIT_DISPUTE: '/dashboard/disputes/edit/$id',
  DISPUTE_DETAILS: `/dashboard/disputes/$id`,
  COIN_MANAGEMENT: '/dashboard/coin-management',
  ADD_COIN: '/dashboard/coin-management/add-coin',
  EDIT_COIN: '/dashboard/coin-management/$coinId',
  MANAGE_FIAT: '/dashboard/manage-fiat',
  TREASURY: '/dashboard/treasury',
  AUDIT_TRAILS: '/dashboard/audit-trails',
  USERS: '/dashboard/users',
  USERS_DETAILS: '/dashboard/users/$userId',
  USER_TRANSACTIONS: '/dashboard/users/transaction-history/$userId',
  NOTIFICATIONS: '/dashboard/notifications',
  MANAGE_ADMINS: '/dashboard/manage-admins',
  TESTIMONIALS: '/dashboard/testimonials',
  KYC_TIER_LIMITS: '/dashboard/kyc-tier-limits',
  SUPPORTED_CURRENCIES: '/dashboard/supported-currencies',
  KYC_SESSIONS: '/dashboard/kyc-sessions',
  KYC_SESSION_DETAIL: '/dashboard/kyc-sessions/$id',
}

export const CRYPTO_NETWORK_OPTIONS = [
  { value: undefined, label: 'Select Network' },
  { value: CRYPTO_NETWORK.BTC, label: 'Bitcoin' },
  { value: CRYPTO_NETWORK.ERC20, label: 'ERC-20 (Ethereum)' },
  { value: CRYPTO_NETWORK.TRC20, label: 'TRC-20 (Tron)' },
  // { value: CRYPTO_NETWORK.BEP20, label: 'BEP-20 (Binance Smart Chain)' },
  { value: CRYPTO_NETWORK.SOLANA, label: 'Solana' },
  // { value: CRYPTO_NETWORK.POLYGON, label: 'Polygon' },
  // { value: CRYPTO_NETWORK.ARBITRUM, label: 'Arbitrum' },
  // { value: CRYPTO_NETWORK.OPTIMISM, label: 'Optimism' },
  // { value: CRYPTO_NETWORK.AVALANCHE, label: 'Avalanche' },
  // { value: CRYPTO_NETWORK.FANTOM, label: 'Fantom' },
  // { value: CRYPTO_NETWORK.BSC, label: 'Binance Smart Chain' },
  // { value: CRYPTO_NETWORK.CARDANO, label: 'Cardano' },
  // { value: CRYPTO_NETWORK.POLKADOT, label: 'Polkadot' },
  // { value: CRYPTO_NETWORK.COSMOS, label: 'Cosmos' },
  // { value: CRYPTO_NETWORK.TERRA, label: 'Terra' },
  // { value: CRYPTO_NETWORK.NEAR, label: 'Near Protocol' },
  // { value: CRYPTO_NETWORK.HARMONY, label: 'Harmony' },
  // { value: CRYPTO_NETWORK.MOONBEAM, label: 'Moonbeam' },
  // { value: CRYPTO_NETWORK.CRONOS, label: 'Cronos' },
  // { value: CRYPTO_NETWORK.KCC, label: 'KuCoin Community Chain' },
  // { value: CRYPTO_NETWORK.HECO, label: 'Heco Chain' },
  // { value: CRYPTO_NETWORK.XDAI, label: 'xDai Chain' },
  // { value: CRYPTO_NETWORK.CELO, label: 'Celo' },
  // { value: CRYPTO_NETWORK.ALGORAND, label: 'Algorand' },
  // { value: CRYPTO_NETWORK.TEZOS, label: 'Tezos' },
  // { value: CRYPTO_NETWORK.ELROND, label: 'Elrond' },
  // { value: CRYPTO_NETWORK.KLAYTN, label: 'Klaytn' },
  // { value: CRYPTO_NETWORK.OKEX, label: 'OKEx Chain' },
] as const

export const TRANSACTION_STATUS_OPTIONS = [
  { value: undefined, label: 'All' },
  { value: TRANSACTION_STATUS.INITIATED, label: 'Initiated' },
  { value: TRANSACTION_STATUS.PENDING, label: 'Pending' },
  { value: TRANSACTION_STATUS.AWAITING_PAYMENT, label: 'Awaiting Payment' },
  { value: TRANSACTION_STATUS.AWAITING_CRYPTO, label: 'Awaiting Crypto' },
  { value: TRANSACTION_STATUS.COMPLETED, label: 'Completed' },
  { value: TRANSACTION_STATUS.FAILED, label: 'Failed' },
  { value: TRANSACTION_STATUS.EXPIRED, label: 'Expired' },
  { value: TRANSACTION_STATUS.CANCELLED, label: 'Cancelled' },
  { value: TRANSACTION_STATUS.DISPUTED, label: 'Disputed' },
  {
    value: TRANSACTION_STATUS.PAYMENT_ACCOUNT_CONFIRMED,
    label: 'Payment Account Confirmed',
  },
  { value: TRANSACTION_STATUS.DEPOSIT_DETECTED, label: 'Deposit Detected' },
  { value: TRANSACTION_STATUS.DEPOSIT_CONFIRMED, label: 'Deposit Confirmed' },
  { value: TRANSACTION_STATUS.PAYOUT_INITIATED, label: 'Payout Initiated' },
  { value: TRANSACTION_STATUS.PAYOUT_FAILED, label: 'Payout Failed' },
  { value: TRANSACTION_STATUS.PENDING_PAYOUT, label: 'Pending Payout' },
]

export const ALLOWED_ADMIN_TRANSACTION_STATUS = [
  TRANSACTION_STATUS.AWAITING_PAYMENT,
  TRANSACTION_STATUS.PAYMENT_RECEIVED,
  TRANSACTION_STATUS.PAYMENT_CONFIRMED,
  TRANSACTION_STATUS.PROCESSING,
  TRANSACTION_STATUS.AWAITING_CRYPTO,
  TRANSACTION_STATUS.CRYPTO_SENT,
  TRANSACTION_STATUS.CRYPTO_RECEIVED,
  TRANSACTION_STATUS.CRYPTO_CONFIRMED,
  TRANSACTION_STATUS.COMPLETED,
  TRANSACTION_STATUS.FAILED,
  TRANSACTION_STATUS.CANCELLED,
  TRANSACTION_STATUS.DISPUTED,
  TRANSACTION_STATUS.REFUNDING,
  TRANSACTION_STATUS.REFUNDED,
  TRANSACTION_STATUS.PAYMENT_ACCOUNT_CONFIRMED,
]

export const transactionStatusStyles: Record<
  string,
  { text: string; bg: string; dot: string; textColor: string }
> = {
  INITIATED: {
    text: 'Initiated',
    bg: 'bg-orange-50',
    dot: 'bg-orange-400',
    textColor: 'text-orange-600',
  },
  PENDING: {
    text: 'Pending',
    bg: 'bg-orange-50',
    dot: 'bg-orange-400',
    textColor: 'text-orange-600',
  },
  AWAITING_PAYMENT: {
    text: 'Awaiting Payment',
    bg: 'bg-yellow-50',
    dot: 'bg-yellow-400',
    textColor: 'text-yellow-600',
  },
  PAYMENT_RECEIVED: {
    text: 'Payment Received',
    bg: 'bg-blue-50',
    dot: 'bg-blue-400',
    textColor: 'text-blue-600',
  },
  PAYMENT_CONFIRMED: {
    text: 'Payment Confirmed',
    bg: 'bg-blue-50',
    dot: 'bg-blue-400',
    textColor: 'text-blue-600',
  },
  PROCESSING: {
    text: 'Processing',
    bg: 'bg-blue-50',
    dot: 'bg-blue-500',
    textColor: 'text-blue-600',
  },
  AWAITING_CRYPTO: {
    text: 'Awaiting Crypto',
    bg: 'bg-blue-50',
    dot: 'bg-blue-400',
    textColor: 'text-blue-600',
  },
  CRYPTO_SENT: {
    text: 'Crypto Sent',
    bg: 'bg-blue-50',
    dot: 'bg-blue-400',
    textColor: 'text-blue-600',
  },
  CRYPTO_RECEIVED: {
    text: 'Crypto Received',
    bg: 'bg-blue-50',
    dot: 'bg-blue-400',
    textColor: 'text-blue-600',
  },
  CRYPTO_CONFIRMED: {
    text: 'Crypto Confirmed',
    bg: 'bg-blue-50',
    dot: 'bg-blue-400',
    textColor: 'text-blue-600',
  },
  COMPLETED: {
    text: 'Completed',
    bg: 'bg-green-50',
    dot: 'bg-green-500',
    textColor: 'text-green-600',
  },
  FAILED: {
    text: 'Failed',
    bg: 'bg-red-50',
    dot: 'bg-red-400',
    textColor: 'text-red-600',
  },
  EXPIRED: {
    text: 'Expired',
    bg: 'bg-gray-100',
    dot: 'bg-gray-500',
    textColor: 'text-gray-700',
  },
  CANCELLED: {
    text: 'Cancelled',
    bg: 'bg-gray-100',
    dot: 'bg-gray-500',
    textColor: 'text-gray-700',
  },
  DISPUTED: {
    text: 'Disputed',
    bg: 'bg-red-50',
    dot: 'bg-red-400',
    textColor: 'text-red-600',
  },
  REFUNDING: {
    text: 'Refunding',
    bg: 'bg-yellow-50',
    dot: 'bg-yellow-400',
    textColor: 'text-yellow-600',
  },
  REFUNDED: {
    text: 'Refunded',
    bg: 'bg-green-50',
    dot: 'bg-green-400',
    textColor: 'text-green-600',
  },
  PAYMENT_ACCOUNT_CONFIRMED: {
    text: 'Payment Account Confirmed',
    bg: 'bg-blue-50',
    dot: 'bg-blue-400',
    textColor: 'text-blue-600',
  },
}

export const userStatusOptions = [
  { value: undefined, label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'BANNED', label: 'Banned' },
  { value: 'DELETED', label: 'Deleted' },
]

export const ATTACHMENT_TYPE = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  PDF: 'PDF',
  DOCUMENT: 'DOCUMENT',
  AUDIO: 'AUDIO',
  SPREADSHEET: 'SPREADSHEET',
  OTHER: 'OTHER',
} as const;
