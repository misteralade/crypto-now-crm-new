import { z } from "zod";
import {BasicSearchQuerySchema} from "./common.schema";
import { BankAndCryptoType, BlockchainEnvironmentType, CryptoNetworkType } from './enum.schema'

const optionalNumberSchema = z.preprocess((value) => {
  if (value === "" || value === null || typeof value === "undefined") {
    return undefined;
  }

  return value;
}, z.coerce.number().min(0).optional());

export const SearchSupportedCryptoWalletRequestSchema = BasicSearchQuerySchema.extend({
  createdBy: z.string().uuid().optional().describe("Optional UUID of the admin who created the cryptocurrency"),
  name: z.string().max(100).optional().describe("Optional name of the cryptocurrency to filter by"),
  description: z.string().max(500).optional().describe("Optional description of the cryptocurrency to filter by"),
  symbol: z.string().max(20).optional().describe("Optional symbol of the cryptocurrency to filter by"),
  isActive: z.coerce.boolean().optional().describe("Optional filter by active status of the cryptocurrency"),
  logoUrl: z.string().url().max(500).optional().describe("Optional URL to the cryptocurrency's logo image"),
  websiteUrl: z.string().url().max(500).optional().describe("Optional URL to the cryptocurrency's official website"),
  whitepaperUrl: z.string().url().max(500).optional().describe("Optional URL to the cryptocurrency's whitepaper"),
  // additionalInfo: z.record(z.any()).optional().describe("Optional additional information as key-value pairs"),
  additionalInfo: z.string().max(100).optional().describe(`Optional filter where additionalInfo contains this substring, case-insensitively`),
  isStableCoin: z.coerce.boolean().optional().describe("Optional filter by whether the cryptocurrency is a stablecoin"),
  maxTransactionLimit: optionalNumberSchema.describe("Optional maximum transaction limit in token units for this cryptocurrency"),
  minTransactionLimit: optionalNumberSchema.describe("Optional minimum transaction limit in token units for this cryptocurrency"),
  maxTradeAmountForAnonymous: optionalNumberSchema.describe("Optional maximum trade amount in token units for anonymous users"),
  minTradeAmountForAnonymous: optionalNumberSchema.describe("Optional minimum trade amount in token units for anonymous users"),
  
  // Include Related Entities
  includeAdmin: z.coerce.boolean().default(false).optional(),
  includePlatformExchange: z.coerce.boolean().default(false).optional(),
  includeTransactions: z.coerce.boolean().default(false).optional(),
  includeAdminCryptoWallets: z.coerce.boolean().default(false).optional(),
  includeExchangeRates: z.coerce.boolean().default(false).optional(),
  includeUserCryptoWallets: z.coerce.boolean().default(false).optional(),
});

export const WalletEntrySchema = z.object({
  network: CryptoNetworkType,
  walletAddress: z.string().min(1).max(255),
  walletLabel: z.string().min(1).max(100).optional(),
  walletType: BankAndCryptoType.default("BOTH").optional(),
  blockchainEnvironment: BlockchainEnvironmentType.default("testnet").optional(),
});

export const CreateSupportedCryptoAndAdminWalletRequestSchema = z.object({
  // Supported Cryptocurrency
  name: z.string().min(1).max(100).describe("Name of the cryptocurrency, e.g., Bitcoin"),
  symbol: z.string().min(1).max(20).describe("Symbol of the cryptocurrency, e.g., BTC").transform((val) => val.toUpperCase()),
  description: z.string().max(500).optional().describe("Optional description of the cryptocurrency"),
  isStableCoin: z.boolean().default(false).optional().describe("Optional isStableCoin"),
  logoUrl: z.string().url().optional().describe("Optional URL to the cryptocurrency's logo image"),
  maxTransactionLimit: optionalNumberSchema,
  minTransactionLimit: optionalNumberSchema,
  maxTradeAmountForAnonymous: optionalNumberSchema,
  minTradeAmountForAnonymous: optionalNumberSchema,
  buyRate: z.coerce.number().min(0).optional(),
  sellRate: z.coerce.number().min(0).optional(),
  websiteUrl: z.string().url().optional().transform((val) => val === '' ? undefined : val),
  whitepaperUrl: z.string().url().optional().transform((val) => val === '' ? undefined : val),
  additionalInfo: z.record(z.any()).optional(),
  networks: z.array(z.string()).min(1, "Select at least one network"),
  wallets: z.array(WalletEntrySchema).min(1, "Provide a wallet address for each selected network"),
  isActive: z.boolean().default(true).optional(),
  blockchainEnvironment: BlockchainEnvironmentType.default("testnet").optional(),
});

export const EditSupportedCryptoAndAdminWalletRequestSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  symbol: z.string().min(1).max(20).transform((val) => val.toUpperCase()).optional(),
  description: z.string().max(500).optional(),
  isStableCoin: z.boolean().optional(),
  logoUrl: z.string().url().optional(),
  maxTransactionLimit: optionalNumberSchema,
  minTransactionLimit: optionalNumberSchema,
  maxTradeAmountForAnonymous: optionalNumberSchema,
  minTradeAmountForAnonymous: optionalNumberSchema,
  buyRate: z.coerce.number().min(0).optional(),
  sellRate: z.coerce.number().min(0).optional(),
  websiteUrl: z.string().url().optional(),
  whitepaperUrl: z.string().url().optional(),
  additionalInfo: z.record(z.any()).optional(),
  networks: z.array(z.string()).optional(),
  wallets: z.array(WalletEntrySchema).optional(),
  isActive: z.boolean().optional(),
  blockchainEnvironment: BlockchainEnvironmentType.default("testnet").optional(),
});

export type WalletEntryType = z.infer<typeof WalletEntrySchema>;

export type SearchSupportedCryptoWalletRequestSchema = z.infer<typeof SearchSupportedCryptoWalletRequestSchema>;
export type CreateSupportedCryptoAndAdminWalletRequestType = z.infer<typeof CreateSupportedCryptoAndAdminWalletRequestSchema>;
export type EditSupportedCryptoAndAdminWalletRequestType = z.infer<typeof EditSupportedCryptoAndAdminWalletRequestSchema>;
