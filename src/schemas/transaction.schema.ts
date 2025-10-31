import { z } from 'zod';
import {BasicSearchQuerySchema, IsoDateStringSchema} from './common.schema'
import {
  TransactionAction,
  TransactionPriority,
  TransactionStatus,
} from './enum.schema'



export const SearchTransactionsRequestSchema = BasicSearchQuerySchema.extend({
  sessionId: z.coerce.string().optional(),
  userId: z.coerce.string().uuid().optional(),
  cryptoCurrencyId: z.coerce.string().uuid().optional(),
  exchangeRateId: z.coerce.string().uuid().optional(),
  type: TransactionAction.optional(),
  amountCrypto: z.coerce.number().optional(),
  amountFiat: z.coerce.number().optional(),
  cryptoToStableRate: z.coerce.number().optional(),
  stableToCryptoRate: z.coerce.number().optional(),
  currency: z.coerce.string().max(3).optional().transform(val => val?.toUpperCase()),
  status: TransactionStatus.optional(),
  priority: TransactionPriority.optional(),
  userBankAccountId: z.coerce.string().uuid().optional(),
  adminBankAccountId: z.coerce.string().uuid().optional(),
  userCryptoWalletId: z.coerce.string().uuid().optional(),
  bankTransferReference: z.coerce.string().max(100).optional(),
  receiptImageUrl: z.coerce.string().url().optional(),
  adminCryptoWalletId: z.coerce.string().uuid().optional(),
  cryptoTxHash: z.coerce.string().max(100).optional(),
  adminNotes: z.coerce.string().max(500).optional(),
  userNotes: z.coerce.string().max(500).optional(),
  internalNotes: z.coerce.string().max(500).optional(),
  failureReason: z.coerce.string().max(500).optional(),
  processedBy: z.coerce.string().uuid().optional(),
  processedAt: IsoDateStringSchema.optional(),
  rate: z.coerce.number().optional(),

  // USD amount filter
  minUsdAmount: z.coerce.number().optional(),
  maxUsdAmount: z.coerce.number().optional(),

  // Include Relations
  includeUser: z.coerce.boolean().default(false).optional(),
  includeCryptoCurrency: z.coerce.boolean().default(false).optional(),
  includeExchangeRate: z.coerce.boolean().default(false).optional(),
  includeAdminBankAccount: z.coerce.boolean().default(false).optional(),
  includeAdminCryptoWallet: z.coerce.boolean().default(false).optional(),
  includeUserBankAccount: z.coerce.boolean().default(false).optional(),
  includeUserCryptoWallet: z.coerce.boolean().default(false).optional(),
  includeProcessedBy: z.coerce.boolean().default(false).optional(),
});

export const UpdateTransactionStatusRequestType = z.object({
  status: TransactionStatus.optional(),
  adminNotes: z.coerce.string().max(500).optional(),
  internalNotes: z.coerce.string().max(500).optional(),
  failureReason: z.coerce.string().max(500).optional(),
  adminPaymentReceiptUrl: z.coerce.string().url().optional(),
})

export type SearchTransactionsRequestType = z.infer<typeof SearchTransactionsRequestSchema>;
export type UpdateTransactionStatusRequestType = z.infer<typeof UpdateTransactionStatusRequestType>;