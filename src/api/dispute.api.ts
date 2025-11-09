import { axiosPostRequestHandler } from "./index";
import type {AdminSearchDisputesAPIResponse } from "../types/response.payload.types";
import type {AdminSearchDisputesRequestType} from "../schemas/dispute.schema.ts";

class DisputeServiceApi {
  private static instance: DisputeServiceApi;
  
  private constructor() {
  }
  
  public static getInstance(): DisputeServiceApi {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!DisputeServiceApi.instance) {
      DisputeServiceApi.instance = new DisputeServiceApi();
    }
    return DisputeServiceApi.instance;
  }
  
  async adminSearchDisputes(payload: AdminSearchDisputesRequestType) {
    return await axiosPostRequestHandler(`/dispute/admin/search`, payload) as AdminSearchDisputesAPIResponse;
  }
}

export const disputeServiceApi = DisputeServiceApi.getInstance();
