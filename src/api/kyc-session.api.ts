import {
  axiosGetRequestHandler,
  axiosPostRequestHandler,
} from './index'
import type {
  GetAdminKycSessionsApiResponse,
  GetAdminKycSessionDetailApiResponse,
  GetAdminKycSessionMediaApiResponse,
  AdminKycActionApiResponse,
  KycSessionStep,
} from '../types/kyc-session.types'

class KycSessionServiceApi {
  private static instance: KycSessionServiceApi

  private constructor() {}

  public static getInstance(): KycSessionServiceApi {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!KycSessionServiceApi.instance) {
      KycSessionServiceApi.instance = new KycSessionServiceApi()
    }
    return KycSessionServiceApi.instance
  }

  async adminGetSessions(params: {
    page?: number
    limit?: number
    status?: KycSessionStep
    userId?: string
  }): Promise<GetAdminKycSessionsApiResponse> {
    return axiosGetRequestHandler('/kyc/admin/sessions', params) as Promise<GetAdminKycSessionsApiResponse>
  }

  async adminGetSessionDetail(id: string): Promise<GetAdminKycSessionDetailApiResponse> {
    return axiosGetRequestHandler(`/kyc/admin/sessions/${id}`) as Promise<GetAdminKycSessionDetailApiResponse>
  }

  async adminGetSessionMedia(id: string): Promise<GetAdminKycSessionMediaApiResponse> {
    return axiosGetRequestHandler(`/kyc/admin/sessions/${id}/media`) as Promise<GetAdminKycSessionMediaApiResponse>
  }

  async adminEscalate(id: string, notes: string): Promise<AdminKycActionApiResponse> {
    return axiosPostRequestHandler(`/kyc/admin/sessions/${id}/escalate`, { notes }) as Promise<AdminKycActionApiResponse>
  }

  async adminApprove(id: string): Promise<AdminKycActionApiResponse> {
    return axiosPostRequestHandler(`/kyc/admin/sessions/${id}/approve`, {}) as Promise<AdminKycActionApiResponse>
  }

  async adminReject(id: string, reason: string): Promise<AdminKycActionApiResponse> {
    return axiosPostRequestHandler(`/kyc/admin/sessions/${id}/reject`, { reason }) as Promise<AdminKycActionApiResponse>
  }
}

export const kycSessionServiceApi = KycSessionServiceApi.getInstance()
