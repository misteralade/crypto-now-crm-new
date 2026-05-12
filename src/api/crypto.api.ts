import {
  axiosDeleteRequestHandler,
  axiosGetRequestHandler,
  axiosPatchRequestHandler,
  axiosPostRequestHandler
} from './index.js'
import type {
  CreateSupportedCryptoAndAdminWalletRequestType, EditSupportedCryptoAndAdminWalletRequestType,
  SearchSupportedCryptoWalletRequestSchema,
} from '../schemas/crypto.schema.js'
import type {
  BaseApiResponse, GetAllSupportedCryptoAPIResponse, GetSupportedCryptoAPIResponse,
  SearchSupportedCryptoAPIResponse, UploadAPIResponse,
  AdminGetUserCustodialWalletsAPIResponse,
  AdminCustodialWalletDetailsAPIResponse,
  RefreshCustodialWalletBalanceAPIResponse,
  AdminGenerateUserCustodialWalletsAPIResponse,
} from "../types/response.payload.types";

class CryptoServiceApi {
  private static instance: CryptoServiceApi;

  private constructor() {
  }

  public static getInstance(): CryptoServiceApi {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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

  async adminRefreshCustodialWalletBalance(walletAddress: string) {
    return await axiosPostRequestHandler(`/custodial-wallet/admin/address/${encodeURIComponent(walletAddress)}/refresh`, {}) as RefreshCustodialWalletBalanceAPIResponse;
  }

  // Generate all missing custodial (deposit) wallets for a user (Admin only).
  async adminGenerateUserCustodialWallets(userId: string) {
    return await axiosPostRequestHandler(`/custodial-wallet/admin/${userId}/generate/all`, {}) as AdminGenerateUserCustodialWalletsAPIResponse;
  }
}

export const cryptoServiceApi = CryptoServiceApi.getInstance();
