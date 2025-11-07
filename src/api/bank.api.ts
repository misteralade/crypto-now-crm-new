import {
  axiosDeleteRequestHandler,
  axiosGetRequestHandler,
  axiosPatchRequestHandler,
  axiosPostRequestHandler
} from "./index";
import type {
  BaseApiResponse,
  GetAllPlatformBankAccountAPIResponsePayload,
  GetSupportedPlatformBankAccountAPIResponsePayload, SearchSupportedBanksAPIResponse
} from "../types/response.payload.types";
import type {AdminSearchSupportedBankRequestType, CreateBankAccountRequestType} from "../schemas/bank.schema";

class BankServiceApi {
  private static instance: BankServiceApi;

  private constructor() {
  }

  public static getInstance(): BankServiceApi {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!BankServiceApi.instance) {
      BankServiceApi.instance = new BankServiceApi();
    }
    return BankServiceApi.instance;
  }

  async getPlatformBankAccounts(): Promise<GetAllPlatformBankAccountAPIResponsePayload> {
    return await axiosGetRequestHandler('/bank/supported-banks/platform') as GetAllPlatformBankAccountAPIResponsePayload;
  }

  async makeAdminBankAccountDefault(bankAccountId: string) {
    return await axiosPatchRequestHandler(`/bank/admin/${bankAccountId}/make-default`) as BaseApiResponse<null>;
  }

  async adminDeleteBankAccount(bankAccountId: string) {
    return await axiosDeleteRequestHandler(`/bank/admin/${bankAccountId}/delete`) as BaseApiResponse<null>;
  }

  async getAllBanks() {
    return await axiosGetRequestHandler(`/bank/supported-bank/all`) as GetSupportedPlatformBankAccountAPIResponsePayload;
  }

  async adminCreateBankAccount(payload: CreateBankAccountRequestType) {
    return await axiosPostRequestHandler(`/bank/platform/create`, payload) as BaseApiResponse<null>;
  }
  
  async adminSearchSupportedBanks(payload: AdminSearchSupportedBankRequestType) {
    return await axiosPostRequestHandler(`/bank/admin/supported-bank/search`, payload) as SearchSupportedBanksAPIResponse;
  }
}

export const bankServiceApi = BankServiceApi.getInstance();
