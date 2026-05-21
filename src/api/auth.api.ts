import {axiosGetRequestHandler, axiosPostRequestHandler, axiosPatchRequestHandler} from "./index";
import type {BaseApiResponse} from "../types/response.payload.types";

class AuthServiceApi {
  private static instance: AuthServiceApi;

  private constructor() {
  }

  public static getInstance(): AuthServiceApi {
     
    if (!AuthServiceApi.instance) {
      AuthServiceApi.instance = new AuthServiceApi();
    }
    return AuthServiceApi.instance;
  }

  async login(payload: Record<string, any>): Promise<BaseApiResponse<null>> {
    return await axiosPostRequestHandler("/admin/auth/sign-in", payload) as BaseApiResponse<null>;
  }
  
  async pingAdmin() {
    return await axiosGetRequestHandler('/admin/ping') as BaseApiResponse<null>;
  }

  async requestPasswordReset(email: string): Promise<BaseApiResponse<null>> {
    return await axiosGetRequestHandler("/admin/auth/password-reset/request", { email }) as BaseApiResponse<null>;
  }

  async confirmPasswordReset(payload: { token: string; password: string; confirmPassword: string }): Promise<BaseApiResponse<null>> {
    return await axiosPatchRequestHandler("/admin/auth/password-reset/confirm", payload) as BaseApiResponse<null>;
  }
}

export const authServiceApi = AuthServiceApi.getInstance();
