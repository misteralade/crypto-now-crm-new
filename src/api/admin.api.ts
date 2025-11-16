import {
  axiosDeleteRequestHandler,
  axiosGetRequestHandler,
  axiosPatchRequestHandler,
  axiosPostRequestHandler
} from "./index";
import type {
  AdminGetAllPermissionsAPIResponse,
  AdminGetAllRolesAPIResponse,
  BaseApiResponse, SearchAdminsAPIResponse
} from "../types/response.payload.types";
import type { CreateNewAdminRequestType, CreateNewRoleRequestType, SearchAdminRequestType } from "../schemas/admin.schema";

class AdminServiceApi {
  private static instance: AdminServiceApi;

  private constructor() {
  }

  public static getInstance(): AdminServiceApi {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!AdminServiceApi.instance) {
      AdminServiceApi.instance = new AdminServiceApi();
    }
    return AdminServiceApi.instance;
  }

  async getAllPermissions() {
    return await axiosGetRequestHandler("/admin/permissions/all") as AdminGetAllPermissionsAPIResponse;
  }

  async getAllRoles() {
    return await axiosGetRequestHandler("/admin/roles/all") as AdminGetAllRolesAPIResponse;
  }
  
  async adminCreateNewRole(payload: CreateNewRoleRequestType) {
    return await axiosPostRequestHandler("/admin/role/create", payload) as BaseApiResponse<null>;
  }

  async createAdmin(payload: CreateNewAdminRequestType) {
    return await axiosPostRequestHandler("/admin/create", payload) as BaseApiResponse<null>;
  }

  async searchAdmin(payload: SearchAdminRequestType) {
    return await axiosPostRequestHandler("/admin/search", payload) as SearchAdminsAPIResponse;
  }

  async updateAdminActiveStatus(adminId: string, isActive: boolean) {
    return await axiosPatchRequestHandler(`/admin/update/status/${adminId}`, { active: isActive }) as BaseApiResponse<null>;
  }
  
  async adminSoftDeleteAdmin(adminId: string) {
    return await axiosDeleteRequestHandler(`/admin/delete/${adminId}`) as BaseApiResponse<null>
  }
}

export const adminServiceApi = AdminServiceApi.getInstance();
