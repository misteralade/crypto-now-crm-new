import type {
  CreateSupportedCryptoAndAdminWalletRequestType,
  EditSupportedCryptoAndAdminWalletRequestType,
  SearchSupportedCryptoWalletRequestSchema
} from "../../schemas/crypto.schema";

export const searchSupportedCryptoInitialState: SearchSupportedCryptoWalletRequestSchema = {
  createdBy: undefined,
  name: undefined,
  description: undefined,
  symbol: undefined,
  isActive: true,
  logoUrl: undefined,
  websiteUrl: undefined,
  whitepaperUrl: undefined,
  additionalInfo: undefined,
  isStableCoin: undefined,
  maxTransactionLimit: undefined,
  minTransactionLimit: undefined,
  maxTradeAmountForAnonymous: undefined,
  minTradeAmountForAnonymous: undefined,

  // Include Related Entities
  includeAdmin: false,
  includePlatformExchange: false,
  includeTransactions: false,
  includeAdminCryptoWallets: true,
  includeExchangeRates: false,
  includeUserCryptoWallets: false,

  // BasicSearchQuerySchema fields
  page: 1,
  size: 10,
  sortModel: {
    colId: 'createdAt',
    orderBy: 'DESC',
  }
};

export const createSupportedCryptoAndWalletInitialState: CreateSupportedCryptoAndAdminWalletRequestType = {
  name: '',
  symbol: '',
  description: undefined,
  isStableCoin: false,
  logoUrl: undefined,
  maxTransactionLimit: undefined,
  minTransactionLimit: undefined,
  maxTradeAmountForAnonymous: undefined,
  minTradeAmountForAnonymous: undefined,
  websiteUrl: undefined,
  whitepaperUrl: undefined,
  additionalInfo: undefined,

  // Networks & Wallets
  networks: [],
  wallets: [],

  // Common
  isActive: true,
  blockchainEnvironment: 'testnet',
}

export const editSupportedCryptoInitialState: EditSupportedCryptoAndAdminWalletRequestType = {
  name: undefined,
  symbol: undefined,
  description: undefined,
  isStableCoin: undefined,
  logoUrl: undefined,
  maxTransactionLimit: undefined,
  minTransactionLimit: undefined,
  maxTradeAmountForAnonymous: undefined,
  minTradeAmountForAnonymous: undefined,
  buyRate: undefined,
  sellRate: undefined,
  websiteUrl: undefined,
  whitepaperUrl: undefined,
  additionalInfo: undefined,
  blockchainEnvironment: undefined,

  // Common
  isActive: undefined,
}
