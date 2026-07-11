import {
  axiosDeleteRequestHandler,
  axiosGetRequestHandler,
  axiosPatchRequestHandler,
  axiosPostRequestHandler
} from './index.js'
import type {
  CreateSupportedCryptoAndAdminWalletRequestType, EditSupportedCryptoAndAdminWalletRequestType,
  SearchSupportedCryptoWalletRequestSchema,
  CreateAdminWalletRequestType,
} from '../schemas/crypto.schema.js'
import type {
  BaseApiResponse, GetAllSupportedCryptoAPIResponse, GetSupportedCryptoAPIResponse,
  SearchSupportedCryptoAPIResponse, UploadAPIResponse,
  AdminGetUserCustodialWalletsAPIResponse,
  AdminCustodialWalletDetailsAPIResponse,
  AdminTreasuryWalletsAPIResponse,
  RefreshCustodialWalletBalanceAPIResponse,
  AdminGenerateUserCustodialWalletsAPIResponse,
} from "../types/response.payload.types";

class CryptoServiceApi {
  private static instance: CryptoServiceApi;

  private constructor() {
  }

  public static getInstance(): CryptoServiceApi {
     
    if (!CryptoServiceApi.instance) {
      CryptoServiceApi.instance = new CryptoServiceApi();
    }
    return CryptoServiceApi.instance;
  }

  async searchSupportedCryptoCurrencies(body: SearchSupportedCryptoWalletRequestSchema) {
    return await axiosPostRequestHandler("/crypto/admin/search", body) as SearchSupportedCryptoAPIResponse;
  }

  async uploadCoinLogo(formData: FormData) {
    return await axiosPostRequestHandler("/upload/admin/wallet-logo/upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }) as UploadAPIResponse;
  }

  async createSupportedCryptoAndAdminWallet(payload: CreateSupportedCryptoAndAdminWalletRequestType) {
    return await axiosPostRequestHandler("/crypto/admin/manage-crypto/create", payload) as BaseApiResponse<null>;
  }

  async adminUpdateSupportedCryptoAndAdminWallet(cryptoId: string, payload: EditSupportedCryptoAndAdminWalletRequestType) {
    return await axiosPatchRequestHandler(`/crypto/admin/supported-crypto/${cryptoId}`, payload) as BaseApiResponse<null>;
  }

  async adminGetAllSupportedCryptoCurrencies() {
   return await axiosGetRequestHandler("/crypto/admin/supported-cryptos") as GetAllSupportedCryptoAPIResponse;
  }

  async getAllSupportedCryptoCurrencies() {
    return await axiosGetRequestHandler("/crypto/supported-cryptos") as GetAllSupportedCryptoAPIResponse;
  }

  async adminGetSupportedCrypto(cryptoId: string) {
    return await axiosGetRequestHandler(`/crypto/admin/supported-crypto/${cryptoId}`) as GetSupportedCryptoAPIResponse;
  }
  
  async adminDeleteSupportedCrypto(cryptoId: string) {
    return await axiosDeleteRequestHandler(`/crypto/admin/supported-crypto/${cryptoId}`) as BaseApiResponse<null>;
  }

  // Fetch a user's custodial (deposit) wallets (Admin only).
  async adminGetUserCustodialWallets(userId: string) {
    return await axiosGetRequestHandler(`/custodial-wallet/admin/${userId}`) as AdminGetUserCustodialWalletsAPIResponse;
  }

  async adminGetCustodialWalletByAddress(walletAddress: string) {
    return await axiosGetRequestHandler(`/custodial-wallet/admin/address/${encodeURIComponent(walletAddress)}`) as AdminCustodialWalletDetailsAPIResponse;
  }

  async adminGetTreasuryWallets(cryptocurrencyId: string, network: string) {
    return await axiosGetRequestHandler(`/custodial-wallet/admin/crypto/${encodeURIComponent(cryptocurrencyId)}/network/${encodeURIComponent(network)}`) as AdminTreasuryWalletsAPIResponse;
  }

  async adminRefreshCustodialWalletBalance(walletAddress: string) {
    return await axiosPostRequestHandler(`/custodial-wallet/admin/address/${encodeURIComponent(walletAddress)}/refresh`, {}) as RefreshCustodialWalletBalanceAPIResponse;
  }

  // Generate all missing custodial (deposit) wallets for a user (Admin only).
  async adminGenerateUserCustodialWallets(userId: string) {
    return await axiosPostRequestHandler(`/custodial-wallet/admin/${userId}/generate/all`, {}) as AdminGenerateUserCustodialWalletsAPIResponse;
  }

  async adminToggleCustodialWalletActive(walletAddress: string, isActive: boolean) {
    return await axiosPostRequestHandler(`/custodial-wallet/admin/address/${encodeURIComponent(walletAddress)}/toggle-active`, { isActive }) as BaseApiResponse<null>;
  }

  async adminGeneratePlatformFuelingWallet(cryptoId: string, network: string) {
    return await axiosPostRequestHandler(`/crypto/admin/wallet/fueling/generate`, { cryptoId, network }) as BaseApiResponse<any>;
  }

  async adminCreatePlatformWallet(payload: CreateAdminWalletRequestType) {
    return await axiosPostRequestHandler(`/crypto/admin/wallet/create`, payload) as BaseApiResponse<null>;
  }

  async adminDeletePlatformWallet(walletId: string) {
    return await axiosDeleteRequestHandler(`/crypto/admin/wallet/${encodeURIComponent(walletId)}`) as BaseApiResponse<null>;
  }

  async adminUpdatePlatformWallet(payload: {
    walletId: string;
    cryptoId: string;
    network: string;
    walletType: "SENDING" | "RECEIVING";
    walletAddress: string;
    walletLabel?: string;
    isActive: boolean;
  }) {
    return await axiosPatchRequestHandler(`/crypto/admin/wallet/${encodeURIComponent(payload.walletId)}`, {
      cryptoId: payload.cryptoId,
      network: payload.network,
      walletType: payload.walletType,
      walletAddress: payload.walletAddress,
      walletLabel: payload.walletLabel,
      isActive: payload.isActive,
    }) as BaseApiResponse<null>;
  }

  async adminGetPlatformWalletBalance(walletId: string) {
    return await axiosGetRequestHandler(`/crypto/admin/wallet/${encodeURIComponent(walletId)}/balance`) as BaseApiResponse<{
      balance: number;
      symbol: string;
    }>;
  }
}

export const cryptoServiceApi = CryptoServiceApi.getInstance();
