import { z } from "zod";
import {BasicSearchQuerySchema} from "./common.schema";
import { BankAndCryptoType, CryptoNetworkType } from './enum.schema'

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
  maxTransactionLimit: z.number().min(0).optional().describe("Optional maximum transaction limit in USD for this cryptocurrency"),
  minTransactionLimit: z.number().min(0).optional().describe("Optional minimum transaction limit in USD for this cryptocurrency"),
  maxTradeAmountForAnonymous: z.number().min(0).optional().describe("Optional maximum trade amount in USD for anonymous users"),
  minTradeAmountForAnonymous: z.number().min(0).optional().describe("Optional minimum trade amount in USD for anonymous users"),
  
  // Include Related Entities
  includeAdmin: z.coerce.boolean().default(false).optional(),
  includePlatformExchange: z.coerce.boolean().default(false).optional(),
  includeTransactions: z.coerce.boolean().default(false).optional(),
  includeAdminCryptoWallets: z.coerce.boolean().default(false).optional(),
  includeExchangeRates: z.coerce.boolean().default(false).optional(),
  includeUserCryptoWallets: z.coerce.boolean().default(false).optional(),
});

export const CreateSupportedCryptoAndAdminWalletRequestSchema = z.object({
  // Supported Cryptocurrency
  name: z.string().min(1).max(100).describe("Name of the cryptocurrency, e.g., Bitcoin"),
  symbol: z.string().min(1).max(20).describe("Symbol of the cryptocurrency, e.g., BTC").transform((val) => val.toUpperCase()),
  description: z.string().max(500).optional().describe("Optional description of the cryptocurrency"),
  isStableCoin: z.boolean().default(false).optional().describe("Optional isStableCoin"),
  logoUrl: z.string().url().optional().describe("Optional URL to the cryptocurrency's logo image"),
  maxTransactionLimit: z.coerce.number().min(0).optional().describe("Optional maximum transaction limit in USD for this cryptocurrency"),
  minTransactionLimit: z.coerce.number().min(0).optional().describe("Optional minimum transaction limit in USD for this cryptocurrency"),
  maxTradeAmountForAnonymous: z.coerce.number().min(0).optional().describe("Optional maximum trade amount in USD for anonymous users"),
  minTradeAmountForAnonymous: z.coerce.number().min(0).optional().describe("Optional minimum trade amount in USD for anonymous users"),
  buyRate: z.coerce.number().min(0).optional().describe("Optional buy rate for the cryptocurrency").optional(),
  sellRate: z.coerce.number().min(0).optional().describe("Optional sell rate for the cryptocurrency").optional(),
  websiteUrl: z.string().url().optional().describe("Optional URL to the cryptocurrency's official website"),
  whitepaperUrl: z.string().url().optional().describe("Optional URL to the cryptocurrency's whitepaper"),
  additionalInfo: z.record(z.any()).optional().describe("Optional additional information as key-value pairs"),
  
  // Wallet 
  walletAddress: z.string().min(1).max(255).describe("Public address of the cryptocurrency wallet"),
  walletLabel: z.string().min(1).max(100).optional().describe("Optional label for the wallet"),
  walletType: BankAndCryptoType.default("BOTH"),
  network: CryptoNetworkType.describe(`The blockchain network of the cryptocurrency wallet, e.g., 'ETHEREUM', 'BITCOIN'`).optional(),
  isPrimary: z.coerce.boolean().default(false).describe("Indicates if this wallet is the primary wallet for the user").optional(),
  isVerified: z.coerce.boolean().default(true).describe("Indicates if the wallet has been verified").optional(),

  // Common
  isActive: z.boolean().default(true).describe("Indicates if the cryptocurrency is active").optional(),
});

export const EditSupportedCryptoAndAdminWalletRequestSchema = z.object({
  // Supported Cryptocurrency
  name: z.string().min(1).max(100).describe("Name of the cryptocurrency, e.g., Bitcoin").optional(),
  symbol: z.string().min(1).max(20).describe("Symbol of the cryptocurrency, e.g., BTC").transform((val) => val.toUpperCase()).optional(),
  description: z.string().max(500).optional().describe("Optional description of the cryptocurrency").optional(),
  isStableCoin: z.boolean().default(false).optional().describe("Optional isStableCoin").optional(),
  logoUrl: z.string().url().optional().describe("Optional URL to the cryptocurrency's logo image").optional(),
  maxTransactionLimit: z.coerce.number().min(0).optional().describe("Optional maximum transaction limit in USD for this cryptocurrency").optional(),
  minTransactionLimit: z.coerce.number().min(0).optional().describe("Optional minimum transaction limit in USD for this cryptocurrency").optional(),
  maxTradeAmountForAnonymous: z.coerce.number().min(0).optional().describe("Optional maximum trade amount in USD for anonymous users").optional(),
  minTradeAmountForAnonymous: z.coerce.number().min(0).optional().describe("Optional minimum trade amount in USD for anonymous users").optional(),
  buyRate: z.coerce.number().min(0).optional().describe("Optional buy rate for the cryptocurrency").optional(),
  sellRate: z.coerce.number().min(0).optional().describe("Optional sell rate for the cryptocurrency").optional(),
  websiteUrl: z.string().url().optional().describe("Optional URL to the cryptocurrency's official website").optional(),
  whitepaperUrl: z.string().url().optional().describe("Optional URL to the cryptocurrency's whitepaper").optional(),
  additionalInfo: z.record(z.any()).optional().describe("Optional additional information as key-value pairs").optional(),

  // Common
  isActive: z.boolean().default(true).describe("Indicates if the cryptocurrency is active").optional(),
});

export type SearchSupportedCryptoWalletRequestSchema = z.infer<typeof SearchSupportedCryptoWalletRequestSchema>;
export type CreateSupportedCryptoAndAdminWalletRequestType = z.infer<typeof CreateSupportedCryptoAndAdminWalletRequestSchema>;
export type EditSupportedCryptoAndAdminWalletRequestType = z.infer<typeof EditSupportedCryptoAndAdminWalletRequestSchema>;
