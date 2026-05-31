import {axiosGetRequestHandler, axiosPatchRequestHandler} from "./index";
import type {
  BaseApiResponse,
  GetPlatformExchangeRatesAPIResponsePayload,
  SupportedExchangeRateResponse,
} from "../types/response.payload.types";
import type { EditPlatformExchangeRateRequestType } from "../schemas/rate.schema";

class RateServiceApi {
  private static instance: RateServiceApi;

  private constructor() {
  }

  public static getInstance(): RateServiceApi {
     
    if (!RateServiceApi.instance) {
      RateServiceApi.instance = new RateServiceApi();
    }
    return RateServiceApi.instance;
  }

  async getAllPlatformRates() {
    return await axiosGetRequestHandler("/rate/admin/platform/all") as GetPlatformExchangeRatesAPIResponsePayload;
  }

  async getExchangeRate(cryptoId: string, currencyId: string, action: "BUY" | "SELL") {
    return await axiosGetRequestHandler(`/rate/crypto-rate/${cryptoId}/${currencyId}/${action}`) as BaseApiResponse<SupportedExchangeRateResponse>;
  }
  
  async updatePlatformExchangeRate(id: string, payload: EditPlatformExchangeRateRequestType) {
    return await axiosPatchRequestHandler(`/rate/platform-rate/update/${id}`, payload) as BaseApiResponse<null>;
  }
}

export const rateServiceApi = RateServiceApi.getInstance();
