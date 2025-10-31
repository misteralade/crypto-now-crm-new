import {axiosPostRequestHandler} from "./index";
import type {BaseApiResponse} from "../types/response.payload.types";

class AuthServiceApi {
  private static instance: AuthServiceApi;

  private constructor() {
  }

  public static getInstance(): AuthServiceApi {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!AuthServiceApi.instance) {
      AuthServiceApi.instance = new AuthServiceApi();
    }
    return AuthServiceApi.instance;
  }

  async login(payload: Record<string, any>): Promise<BaseApiResponse<null>> {
    return await axiosPostRequestHandler("/admin/auth/sign-in", payload) as BaseApiResponse<null>;
  }
}

export const authServiceApi = AuthServiceApi.getInstance();
