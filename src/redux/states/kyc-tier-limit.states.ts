import type { CreateKycTierLimitRequestType, UpdateKycTierLimitRequestType } from "../../schemas/kyc.schema";

export const createKycTierLimitInitialState: CreateKycTierLimitRequestType = {
  kycTier: 'NONE',
  currencyCode: '',
  minTransactionAmount: 0,
  maxTransactionAmount: 0,
  dailyLimit: 0,
  monthlyLimit: 0,
  maxPayoutAttempts: 3,
  requiredConfirmationsBTC: 1,
  requiredConfirmationsSOL: 1,
  requiredConfirmationsTRC20: 1,
  isActive: true,
};

export const updateKycTierLimitInitialState: UpdateKycTierLimitRequestType = {
  kycTier: undefined,
  currencyCode: undefined,
  minTransactionAmount: undefined,
  maxTransactionAmount: undefined,
  dailyLimit: undefined,
  monthlyLimit: undefined,
  maxPayoutAttempts: undefined,
  requiredConfirmationsBTC: undefined,
  requiredConfirmationsSOL: undefined,
  requiredConfirmationsTRC20: undefined,
  isActive: undefined,
};
