import {
  axiosGetRequestHandler,
  axiosPatchRequestHandler,
} from "./index";
import type {
  PayoutAutoApprovalLimitAPIResponse,
  BaseApiResponse,
} from "../types/response.payload.types";

class SettingsServiceApi {
  private static instance: SettingsServiceApi;

  private constructor() {}

  public static getInstance(): SettingsServiceApi {
    if (!SettingsServiceApi.instance) {
      SettingsServiceApi.instance = new SettingsServiceApi();
    }
    return SettingsServiceApi.instance;
  }

  async getPayoutAutoApprovalLimit(): Promise<PayoutAutoApprovalLimitAPIResponse> {
    return await axiosGetRequestHandler(
      "/admin/settings/payout-auto-approval-limit",
    ) as PayoutAutoApprovalLimitAPIResponse;
  }

  async updatePayoutAutoApprovalLimit(thresholdNgn: number) {
    return await axiosPatchRequestHandler(
      "/admin/settings/payout-auto-approval-limit",
      { thresholdNgn },
    ) as BaseApiResponse<{
      thresholdNgn: number;
      isFallback: boolean;
    }>;
  }
}

export const settingsServiceApi = SettingsServiceApi.getInstance();
