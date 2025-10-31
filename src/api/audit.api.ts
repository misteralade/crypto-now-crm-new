import {axiosPostRequestHandler} from "./index";
import type {AdminSearchAuditLogsAPIResponse} from "../types/response.payload.types";
import type {SearchAuditLogsRequestType} from "../schemas/audit.schema";

class AuditServiceApi {
  private static instance: AuditServiceApi;

  private constructor() {
  }

  public static getInstance(): AuditServiceApi {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!AuditServiceApi.instance) {
      AuditServiceApi.instance = new AuditServiceApi();
    }
    return AuditServiceApi.instance;
  }

  async adminSearchAuditLogs(payload: SearchAuditLogsRequestType) {
    return await axiosPostRequestHandler("/audit-log/admin/search", payload) as AdminSearchAuditLogsAPIResponse;
  }
}

export const auditServiceApi = AuditServiceApi.getInstance();
