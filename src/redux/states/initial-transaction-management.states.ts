import type { TransactionStatusType } from "../../schemas/enum.schema";
import type {SearchTransactionsRequestType, UpdateTransactionStatusRequestType} from '../../schemas/transaction.schema'

export const searchTransactionsInitialState: SearchTransactionsRequestType = {
  // Common Search Fields
  id: undefined,
  searchField: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  createdAtFrom: undefined,
  createdAtTo: undefined,

  sessionId: undefined,
  userId: undefined,
  cryptoCurrencyId: undefined,
  exchangeRateId: undefined,
  type: undefined,
  amountCrypto: undefined,
  amountFiat: undefined,
  cryptoToStableRate: undefined,
  stableToCryptoRate: undefined,
  currency: undefined,
  status: undefined,
  priority: undefined,
  userBankAccountId: undefined,
  adminBankAccountId: undefined,
  userCryptoWalletId: undefined,
  bankTransferReference: undefined,
  receiptImageUrl: undefined,
  adminCryptoWalletId: undefined,
  cryptoTxHash: undefined,
  adminNotes: undefined,
  userNotes: undefined,
  internalNotes: undefined,
  failureReason: undefined,
  processedBy: undefined,
  processedAt: undefined,
  rate: undefined,

  // USD amount filter
  minUsdAmount: undefined,
  maxUsdAmount: undefined,

  // Include Relations
  includeUser: false,
  includeCryptoCurrency: true,
  includeExchangeRate: false,
  includeAdminBankAccount: false,
  includeAdminCryptoWallet: false,
  includeUserBankAccount: false,
  includeUserCryptoWallet: false,
  includeProcessedBy: false,

  // BasicSearchQuerySchema fields
  page: 1,
  size: 10,
  sortModel: {
    colId: 'createdAt',
    orderBy: 'DESC',
  }
}

export const updateTransactionInitialState: UpdateTransactionStatusRequestType = {
  adminNotes: undefined,
  adminPaymentReceiptUrl: undefined,
  failureReason: undefined,
  internalNotes: undefined,
  status: undefined as TransactionStatusType | undefined,

}