import {
  axiosDeleteRequestHandler,
  axiosGetRequestHandler,
  axiosPatchRequestHandler,
  axiosPostRequestHandler
} from "./index";
import type {
  BaseApiResponse,
  CreateKycTierLimitAPIResponse,
  GetAllKycTierLimitsAPIResponse
} from "../types/response.payload.types";
import type { CreateKycTierLimitRequestType, UpdateKycTierLimitRequestType } from "../schemas/kyc.schema";

class KycServiceApi {
  private static instance: KycServiceApi;

  private constructor() {
  }

  public static getInstance(): KycServiceApi {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!KycServiceApi.instance) {
      KycServiceApi.instance = new KycServiceApi();
    }
    return KycServiceApi.instance;
  }

  async getAllKycTierLimits(): Promise<GetAllKycTierLimitsAPIResponse> {
    return await axiosGetRequestHandler('/kyc/tier-limits') as GetAllKycTierLimitsAPIResponse;
  }

  async createKycTierLimit(payload: CreateKycTierLimitRequestType): Promise<CreateKycTierLimitAPIResponse> {
    return await axiosPostRequestHandler('/kyc/tier-limits', payload) as CreateKycTierLimitAPIResponse;
  }

  async updateKycTierLimit(id: string, payload: UpdateKycTierLimitRequestType): Promise<BaseApiResponse<null>> {
    return await axiosPatchRequestHandler(`/kyc/tier-limits/${id}`, payload) as BaseApiResponse<null>;
  }

  async deleteKycTierLimit(id: string): Promise<BaseApiResponse<null>> {
    return await axiosDeleteRequestHandler(`/kyc/tier-limits/${id}`) as BaseApiResponse<null>;
  }
}

export const kycServiceApi = KycServiceApi.getInstance();
