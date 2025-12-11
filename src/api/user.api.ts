import {axiosGetRequestHandler, axiosPatchRequestHandler, axiosPostRequestHandler} from "./index";
import type {AdminSearchUserRequestType, AdminUserProfileUpdateRequestType} from "../schemas/user.schema";
import type {
  AdminSearchUsersAPIResponse, BaseApiResponse,
  GetDashboardUserStatsSummaryAPIResponse,
  GetSummarisedUserProfileAPIResponse, GetUserProfileAPIResponse
} from "../types/response.payload.types";

class UserServiceApi {
  private static instance: UserServiceApi;

  private constructor() {
  }

  public static getInstance(): UserServiceApi {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!UserServiceApi.instance) {
      UserServiceApi.instance = new UserServiceApi();
    }
    return UserServiceApi.instance;
  }

  async getDashboardUserSummaryData(queryParams?: Record<string, any>) {
    return await axiosGetRequestHandler('/user/dashboard/user-stats/weekly/summary', queryParams) as GetDashboardUserStatsSummaryAPIResponse;
  }

  async adminSearchUsers(payload: AdminSearchUserRequestType) {
    return await axiosPostRequestHandler('/user/admin/search', payload) as AdminSearchUsersAPIResponse;
  }

  async getUserProfileSummary(userId: string) {
    return await axiosGetRequestHandler(`/user/admin/${userId}/details/summary`) as GetSummarisedUserProfileAPIResponse;
  }

  async adminPatchUserStatus(userId: string, status: string) {
    return await axiosPatchRequestHandler(`/user/admin/${userId}/status/update`, { status }) as BaseApiResponse<null>;
  }

  async adminResetUserPassword(userId: any) {
    return await axiosPatchRequestHandler(`/user/admin/${userId}/password/reset`) as BaseApiResponse<null>;
  }

  async adminRetrieveUserProfile(userId: string) {
    return await axiosGetRequestHandler(`/user/admin/${userId}/profile`) as GetUserProfileAPIResponse;
  }

  async adminUpdateUserProfile(userId: string, payload: Omit<AdminUserProfileUpdateRequestType, 'id'>) {
    return await axiosPatchRequestHandler(`/user/admin/${userId}/profile/update`, payload) as BaseApiResponse<null>;
  }
}

export const userServiceApi = UserServiceApi.getInstance();
