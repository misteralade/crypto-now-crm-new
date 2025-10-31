import z from 'zod'
import { TransactionAction } from './enum.schema'

export const ExchangeRateRequestSchema = z.object({
  baseCurrency: z.coerce.string().max(3),
  coinId: z.coerce.string().uuid()
})

export const CreatePlatformExchangeRateRequestSchema = z.object({
  fiat: z.coerce.string().max(3, `Supports ISO 4217`).transform((val) => val.toUpperCase()),
  currencyId: z.coerce.string().uuid(),
  buyRate: z.coerce.number(),
  sellRate: z.coerce.number(),
})

export const EditPlatformExchangeRateRequestSchema = z.object({
  buyRate: z.string().optional(),
  sellRate: z.string().optional(),
})

export const GetExchangeRateRequestSchema = z.object({
  cryptoId: z.coerce.string().uuid(),
  currencyId: z.coerce.string().uuid(),
  action: TransactionAction
})

export type ExchangeRateRequestType = z.infer<typeof ExchangeRateRequestSchema>;
export type CreatePlatformExchangeRateRequestType = z.infer<typeof CreatePlatformExchangeRateRequestSchema>;
export type EditPlatformExchangeRateRequestType = z.infer<typeof EditPlatformExchangeRateRequestSchema>;
