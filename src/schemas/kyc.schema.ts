import { z } from "zod";

const KycTierSchema = z.enum(['NONE', 'TIER_1', 'TIER_2']);

export const CreateKycTierLimitRequestSchema = z.object({
  kycTier: KycTierSchema,
  currencyCode: z.coerce.string()
    .min(1, { message: "Currency code is required" })
    .max(10, { message: "Currency code must be at most 10 characters" }),
  minTransactionAmount: z.coerce.number({ message: "Min transaction amount must be a number" })
    .nonnegative({ message: "Min transaction amount must be non-negative" }),
  maxTransactionAmount: z.coerce.number({ message: "Max transaction amount must be a number" })
    .positive({ message: "Max transaction amount must be positive" }),
  dailyLimit: z.coerce.number({ message: "Daily limit must be a number" })
    .positive({ message: "Daily limit must be positive" }),
  monthlyLimit: z.coerce.number({ message: "Monthly limit must be a number" })
    .positive({ message: "Monthly limit must be positive" }),
  maxPayoutAttempts: z.coerce.number({ message: "Max payout attempts must be a number" })
    .int({ message: "Max payout attempts must be an integer" })
    .positive({ message: "Max payout attempts must be positive" })
    .default(3),
  requiredConfirmationsBTC: z.coerce.number({ message: "Required confirmations BTC must be a number" })
    .int({ message: "Required confirmations BTC must be an integer" })
    .nonnegative({ message: "Required confirmations BTC must be non-negative" })
    .default(1),
  requiredConfirmationsSOL: z.coerce.number({ message: "Required confirmations SOL must be a number" })
    .int({ message: "Required confirmations SOL must be an integer" })
    .nonnegative({ message: "Required confirmations SOL must be non-negative" })
    .default(1),
  requiredConfirmationsTRC20: z.coerce.number({ message: "Required confirmations TRC20 must be a number" })
    .int({ message: "Required confirmations TRC20 must be an integer" })
    .nonnegative({ message: "Required confirmations TRC20 must be non-negative" })
    .default(1),
  isActive: z.coerce.boolean().default(true),
});

export const UpdateKycTierLimitRequestSchema = z.object({
  kycTier: KycTierSchema.optional(),
  currencyCode: z.coerce.string()
    .min(1, { message: "Currency code is required" })
    .max(10, { message: "Currency code must be at most 10 characters" })
    .optional(),
  minTransactionAmount: z.coerce.number({ message: "Min transaction amount must be a number" })
    .nonnegative({ message: "Min transaction amount must be non-negative" })
    .optional(),
  maxTransactionAmount: z.coerce.number({ message: "Max transaction amount must be a number" })
    .positive({ message: "Max transaction amount must be positive" })
    .optional(),
  dailyLimit: z.coerce.number({ message: "Daily limit must be a number" })
    .positive({ message: "Daily limit must be positive" })
    .optional(),
  monthlyLimit: z.coerce.number({ message: "Monthly limit must be a number" })
    .positive({ message: "Monthly limit must be positive" })
    .optional(),
  maxPayoutAttempts: z.coerce.number({ message: "Max payout attempts must be a number" })
    .int({ message: "Max payout attempts must be an integer" })
    .positive({ message: "Max payout attempts must be positive" })
    .optional(),
  requiredConfirmationsBTC: z.coerce.number({ message: "Required confirmations BTC must be a number" })
    .int({ message: "Required confirmations BTC must be an integer" })
    .nonnegative({ message: "Required confirmations BTC must be non-negative" })
    .optional(),
  requiredConfirmationsSOL: z.coerce.number({ message: "Required confirmations SOL must be a number" })
    .int({ message: "Required confirmations SOL must be an integer" })
    .nonnegative({ message: "Required confirmations SOL must be non-negative" })
    .optional(),
  requiredConfirmationsTRC20: z.coerce.number({ message: "Required confirmations TRC20 must be a number" })
    .int({ message: "Required confirmations TRC20 must be an integer" })
    .nonnegative({ message: "Required confirmations TRC20 must be non-negative" })
    .optional(),
  isActive: z.coerce.boolean().optional(),
});

export type CreateKycTierLimitRequestType = z.infer<typeof CreateKycTierLimitRequestSchema>;
export type UpdateKycTierLimitRequestType = z.infer<typeof UpdateKycTierLimitRequestSchema>;
export type KycTierType = z.infer<typeof KycTierSchema>;
