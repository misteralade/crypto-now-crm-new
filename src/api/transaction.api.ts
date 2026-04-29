import {
  axiosGetRequestHandler,
  axiosPatchRequestHandler,
  axiosPostRequestHandler,
} from './index'
import type {
  SearchTransactionsRequestType,
  UpdateTransactionStatusRequestType,
} from '../schemas/transaction.schema'
import type {
  BaseApiResponse,
  GetTransactionCountAPIResponse, GetTransactionDetailsAPIResponse,
  GetTransactionTypeByPercentageAPIResponse,
  GetTransactionVolumeAPIResponse,
  GetTransactionVolumeTrendAPIResponse,
  GetUsersWithTopTransactionVolumeAPIResponse,
  SearchTransactionsAPIResponse,
  UploadAPIResponse,
} from '../types/response.payload.types'

class TransactionServiceApi {
  private static instance: TransactionServiceApi

  private constructor() {}

  public static getInstance(): TransactionServiceApi {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!TransactionServiceApi.instance) {
      TransactionServiceApi.instance = new TransactionServiceApi()
    }

    return TransactionServiceApi.instance
  }

  async getTransactionVolume(queryParams?: Record<string, any>) {
    return (await axiosGetRequestHandler(
      '/transaction/transaction-volume',
      queryParams,
    )) as GetTransactionVolumeAPIResponse
  }

  async getTransactionVolumeTrend(queryParams?: Record<string, any>) {
    return (await axiosGetRequestHandler(
      '/transaction/transaction-volume/trend',
      queryParams,
    )) as GetTransactionVolumeTrendAPIResponse
  }

  async getTransactionCount(queryParams?: Record<string, any>) {
    return (await axiosGetRequestHandler(
      '/transaction/transaction-count',
      queryParams,
    )) as GetTransactionCountAPIResponse
  }

  async getAdminTransactionStats(queryParams?: Record<string, any>) {
    return (await axiosGetRequestHandler(
      '/transaction/admin/stats',
      queryParams,
    )) as BaseApiResponse<any>
  }

  async getTransactionTypeByPercentage(queryParams?: Record<string, any>) {
    return (await axiosGetRequestHandler(
      '/transaction/transaction-type-percentage',
      queryParams,
    )) as GetTransactionTypeByPercentageAPIResponse
  }

  async getUsersWithTopTransactionVolume(queryParams?: Record<string, any>) {
    return (await axiosGetRequestHandler(
      '/transaction/top-users-by-transaction-volume',
      queryParams,
    )) as GetUsersWithTopTransactionVolumeAPIResponse
  }

  async searchTransactions(payload: SearchTransactionsRequestType) {
    return (await axiosPostRequestHandler(
      '/transaction/admin/search',
      payload,
    )) as SearchTransactionsAPIResponse
  }

  async adminUpdateTransactionStatusAndAdminNotes(
    sessionId: any,
    payload: UpdateTransactionStatusRequestType,
  ) {
    return (await axiosPatchRequestHandler(
      `/transaction/admin/${sessionId}/update`,
      payload,
    )) as BaseApiResponse<null>
  }

  async adminUploadTransactionReceipt(formData: FormData, sessionId: string) {
    return (await axiosPostRequestHandler(
      '/upload/admin/transaction/payment-receipt-upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          sessionId,
        },
      },
    )) as UploadAPIResponse
  }
  
  async adminGetTransactionDetails(sessionId: string) {
    return await axiosGetRequestHandler(`/transaction/admin/details/${sessionId}`) as GetTransactionDetailsAPIResponse
  }
  
  async adminLockTransaction(sessionId: string) {
    return (await axiosPostRequestHandler(
      `/transaction/admin/${sessionId}/lock`,
      {},
    )) as BaseApiResponse<{ lockExpiresAt: string }>
  }
  
  async uploadDisputeAttachment(formData: FormData) {
    const response =  await axiosPostRequestHandler(
      `/upload/transaction/dispute/attachment-upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    
    if (response.success) {
      return response.data;
    }
    
    throw new Error(response.message);
  }

  async adminRetryPendingPayouts(sessionId?: string) {
    return (await axiosPostRequestHandler(
      '/transaction/admin/retry-pending-payouts',
      { sessionId },
    )) as BaseApiResponse<null>
  }
}

export const transactionServiceApi = TransactionServiceApi.getInstance()
