/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import {BASIC} from "../config/index.config";
import {LOCAL_STORAGE_KEYS, ROUTES} from "../util/constants.util.ts";
import type {AxiosRequestHeaders} from "axios";
import type {BaseApiResponse} from "../types/response.payload.types";
import {router} from "../main";

export const API_KIT = axios.create({
  baseURL: BASIC.API_BASE_URL,
  // timeout: 20000,
  // withCredentials: true,
});

API_KIT.interceptors.request.use(async (config) => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    } as AxiosRequestHeaders;
  }
  return config;
});

API_KIT.interceptors.response.use(
  (response) => {
    const accessToken = response.headers["x-access-token"];
    if (
      accessToken &&
      typeof accessToken === "string" &&
      accessToken.trim() !== ""
    ) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    }
    return response;
  },
  async (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message?.toLowerCase();

      if (status === 401 || message === "jwt token error") {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
        router.navigate({ to: ROUTES.LOGIN });
      }
    }
    return Promise.reject(error);
  }
);

export const axiosPostRequestHandler = async (
  url: string,
  data: any,
  config?: any
) => {
  try {
    const request = await API_KIT.post(url, data, {
      ...config,
    });
    return request.data as BaseApiResponse<any>;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const axiosPutRequestHandler = async (url: string, data: any) => {
  try {
    const request = await API_KIT.put(url, data);

    return request.data as BaseApiResponse<any>;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const axiosDeleteRequestHandler = async (url: string) => {
  try {
    const request = await API_KIT.delete(url);

    return request.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const axiosGetRequestHandler = async (url: string, params?: any) => {
  try {
    const request = await API_KIT.get(url, {
      params,
    });

    return request.data as BaseApiResponse<any>;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const axiosPatchRequestHandler = async (url: string, params?: any) => {
  try{
    const request = await API_KIT.patch(url, params);

    return request.data as BaseApiResponse<any>;
  }catch(error){
    if(axios.isAxiosError(error)){
      throw error;
    }else{
      throw new Error("An unexpected error occurred");
    }
  }
};