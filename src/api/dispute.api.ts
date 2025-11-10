import {axiosGetRequestHandler, axiosPostRequestHandler} from "./index";
import type {
  AdminSearchDisputesAPIResponse, BaseApiResponse,
  GetDisputeDetailsAPIResponse,
  GetDisputeMessagesAPIResponse,
  MessageAttachment
} from "../types/response.payload.types";
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
  
  async getDisputeMessages(disputeId: string) {
    return await axiosGetRequestHandler(`/dispute/admin/messages/${disputeId}`) as GetDisputeMessagesAPIResponse;
  }
  
  async getDisputeDetails(disputeId: string) {
    return await axiosGetRequestHandler(`/dispute/admin/details/${disputeId}`) as GetDisputeDetailsAPIResponse;
  }
  
  async sendDisputeMessage(disputeId: string, message: string, attachments: Array<MessageAttachment>) {
    return await axiosPostRequestHandler(`/dispute/admin/message/${disputeId}/send`, {
      message,
      attachments,
    }) as BaseApiResponse<null>;
  }
}

export const disputeServiceApi = DisputeServiceApi.getInstance();
