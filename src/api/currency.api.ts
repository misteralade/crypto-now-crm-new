import {
  axiosDeleteRequestHandler,
  axiosGetRequestHandler,
  axiosPatchRequestHandler,
  axiosPostRequestHandler
} from "./index";
import type {
  BaseApiResponse,
  GetAllCurrenciesAPIResponse
} from "../types/response.payload.types";
import type { CreateCurrencyRequestType, UpdateCurrencyRequestType } from "../schemas/currency.schema";

class CurrencyServiceApi {
  private static instance: CurrencyServiceApi;

  private constructor() {
  }

  public static getInstance(): CurrencyServiceApi {
     
    if (!CurrencyServiceApi.instance) {
      CurrencyServiceApi.instance = new CurrencyServiceApi();
    }
    return CurrencyServiceApi.instance;
  }

  async getAllCurrencies(): Promise<GetAllCurrenciesAPIResponse> {
    return await axiosGetRequestHandler('/currency/admin/all') as GetAllCurrenciesAPIResponse;
  }

  async createCurrency(payload: CreateCurrencyRequestType): Promise<BaseApiResponse<null>> {
    return await axiosPostRequestHandler('/currency/admin/create', payload) as BaseApiResponse<null>;
  }

  async updateCurrency(id: string, payload: UpdateCurrencyRequestType): Promise<BaseApiResponse<null>> {
    return await axiosPatchRequestHandler(`/currency/admin/${id}`, payload) as BaseApiResponse<null>;
  }

  async deleteCurrency(id: string): Promise<BaseApiResponse<null>> {
    return await axiosDeleteRequestHandler(`/currency/admin/${id}`) as BaseApiResponse<null>;
  }
}

export const currencyServiceApi = CurrencyServiceApi.getInstance();
