import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMatchRoute } from '@tanstack/react-router'
import { toast } from 'react-toastify'
import {useSelector} from "react-redux";
import {ROUTES, TIME_IN_MILLISECONDS} from '../util/constants'
import { transactionServiceApi } from '../api/transaction.api'
import { store  } from '../store'
import { searchTransactionsInitialState } from '../redux/states/initial-transaction-management.states'
import { QUERY_KEYS } from './querries.keys'
import type {RootState} from '../store';
import type {
  AxiosServerError,
  SearchTransactionsResponse,
  UsersWithTopTransactionVolume,
  WeeklyTransactionVolumeTrend,
} from '../types/response.payload.types'

export const useTransactionQuery = () => {
  const queryClient = useQueryClient()
  const matchRoute = useMatchRoute()
  const searchTransaction = useSelector((state: RootState) => state.transactionManagement.search.transactions);

  const { data: transactionVolume, isLoading: loadingTransactionVolume } = useQuery({
      queryKey: [
        QUERY_KEYS.TRANSACTION.GET_WEEKLY_TRANSACTION_VOLUME,
        (store.getState() as RootState).dashboard.timelineFilter,
      ],
      queryFn: async () => {
        const timeline = (store.getState() as RootState).dashboard
          .timelineFilter
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!timeline) return null

        const { data, success } =
          await transactionServiceApi.getTransactionVolume({ timeline })

        if (success) {
          return data
        }

        return null
      },
      enabled:
        !!matchRoute({ to: ROUTES.DASHBOARD }) &&
        !!(store.getState() as RootState).dashboard.timelineFilter,
    });

  const { data: weeklyTransactionCount, isLoading: loadingWeeklyTransactionCount } = useQuery({
    queryKey: [
      QUERY_KEYS.TRANSACTION.GET_WEEKLY_TRANSACTION_COUNT,
      (store.getState() as RootState).dashboard.timelineFilter,
    ],
    queryFn: async () => {
      const timeline = (store.getState() as RootState).dashboard.timelineFilter
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!timeline) return null

      const { data, success } =
        await transactionServiceApi.getTransactionCount({ timeline })

      if (success) {
        return data
      }

      return null
    },
    enabled:
      !!matchRoute({ to: ROUTES.DASHBOARD }) &&
      !!(store.getState() as RootState).dashboard.timelineFilter,
  });

  const { data: transactionVolumeTrend, isLoading: loadingTransactionVolumeTrend } = useQuery({
    queryKey: [
      QUERY_KEYS.TRANSACTION.GET_TRANSACTION_VOLUME_TREND,
      (store.getState() as RootState).dashboard.timelineFilter,
    ],
    queryFn: async () => {
      const timeline = (store.getState() as RootState).dashboard.timelineFilter
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!timeline) return [] as Array<WeeklyTransactionVolumeTrend>

      const { data, success } =
        await transactionServiceApi.getTransactionVolumeTrend({ timeline })
      if (success) return data as Array<WeeklyTransactionVolumeTrend>
      return [] as Array<WeeklyTransactionVolumeTrend>
    },
    enabled:
      !!matchRoute({ to: ROUTES.DASHBOARD }) &&
      !!(store.getState() as RootState).dashboard.timelineFilter,
  });

  const { data: usersWithTopTransactionVolume, isLoading: loadingUsersWithTopTransactionVolume } = useQuery({
    queryKey: [
      QUERY_KEYS.TRANSACTION.GET_USERS_WITH_TOP_TRANSACTION_VOLUME,
      (store.getState() as RootState).dashboard.timelineFilter,
    ],
    queryFn: async () => {
      const timeline = (store.getState() as RootState).dashboard.timelineFilter
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!timeline) return [] as Array<UsersWithTopTransactionVolume>

      const { data, success } =
        await transactionServiceApi.getUsersWithTopTransactionVolume({
          timeline,
        })
      if (success) return data as Array<UsersWithTopTransactionVolume>
      return [] as Array<UsersWithTopTransactionVolume>
    },
    enabled:
      !!matchRoute({ to: ROUTES.DASHBOARD }) &&
      !!(store.getState() as RootState).dashboard.timelineFilter,
  });

  const { data: transactionTypeByPercentage, isLoading: loadingTransactionTypeByPercentage } = useQuery({
    queryKey: [
      QUERY_KEYS.TRANSACTION.GET_TRANSACTION_TYPE_BY_PERCENTAGE,
      (store.getState() as RootState).dashboard.timelineFilter,
    ],
    queryFn: async () => {
      const timeline = (store.getState() as RootState).dashboard.timelineFilter
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!timeline) return null

      const { data, success } =
        await transactionServiceApi.getTransactionTypeByPercentage({ timeline })
      if (success) return data
      return null
    },
    enabled:
      !!matchRoute({ to: ROUTES.DASHBOARD }) &&
      !!(store.getState() as RootState).dashboard.timelineFilter,
  });

  // Aliases expected by consumers
  const transactionCount = weeklyTransactionCount
  const loadingTransactionCount = loadingWeeklyTransactionCount

  const { data: searchTransactions, isLoading: loadingSearchTransactions } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTION.SEARCH_TRANSACTIONS, searchTransaction],
    queryFn: async () => {
      const payload = (store.getState() as RootState).transactionManagement.search.transactions
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!payload) return null;

      const { data, success } = await transactionServiceApi.searchTransactions(payload);

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!(matchRoute({ to: ROUTES.TRANSACTIONS }) || matchRoute({ to: ROUTES.USERS_DETAILS })) && !!searchTransaction,
    refetchInterval: TIME_IN_MILLISECONDS.ONE_MINUTE,
  });

  const { data: transactionDetail, isLoading: loadingTransactionDetails } = useQuery({
      queryKey: [
        QUERY_KEYS.TRANSACTION.GET_TRANSACTION_DETAILS,
        (store.getState() as RootState).transactionManagement.details
          .transactionSessionId,
      ],
      queryFn: async () => {
        const sessionId = (store.getState() as RootState).transactionManagement
          .details.transactionSessionId

        if (!sessionId) return null

        // Build Payload
        const searchTransactionPayload = {
          ...searchTransactionsInitialState,
          includeExchangeRate: true,
          includeCryptoCurrency: true,
          includeUserBankAccount: true,
          includeUserCryptoWallet: true,
          sessionId,
        }

        const { data, success } =
          await transactionServiceApi.searchTransactions(
            searchTransactionPayload,
          )

        if (success) {
          return data.transactions[0] as SearchTransactionsResponse | undefined
        }

        return null
      },
      enabled:
        !!matchRoute({ to: ROUTES.TRANSACTIONS }) &&
        !!(store.getState() as RootState).transactionManagement.details
          .transactionSessionId,
    });
  
  const { data: transactionInfo, isLoading: loadingTransactionInfo } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTION.GET_TRANSACTION_DETAILS_PAGE, (store.getState() as RootState).transactionManagement.details.transactionSessionId],
    queryFn: async () => {
      const sessionId = (store.getState() as RootState).transactionManagement.details.transactionSessionId
      
      if (!sessionId) return null
      
      const { data, success } = await transactionServiceApi.adminGetTransactionDetails(sessionId)
      
      if (success) {
        return data
      }
      
      return null
    },
    enabled: !!matchRoute({ to: ROUTES.TRANSACTIONS_DETAILS }) && !!(store.getState() as RootState).transactionManagement.details.transactionSessionId
  })

  const adminUpdateTransactionMutation = useMutation({
    mutationFn: async () => {
      toast.loading('Updating transaction status...')
      const sessionId = (store.getState() as RootState).transactionManagement
        .details.transactionSessionId
      const updatePayload = (store.getState() as RootState)
        .transactionManagement.details.update

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!updatePayload) {
        toast.dismiss()
        return null
      }

      const { success, message } =
        await transactionServiceApi.adminUpdateTransactionStatusAndAdminNotes(
          sessionId,
          updatePayload,
        )

      return { success, message } as any
    },
    onSuccess: (response) => {
      toast.dismiss()
      const { message } = response
      if (response.success) {
        toast.success(response.message)
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.TRANSACTION.SEARCH_TRANSACTIONS],
        })
      } else {
        toast.error(message)
      }
    },
    onError: (error: AxiosServerError) => {
      const { response } = error
      toast.dismiss()
      toast.error(response?.data.error.message)
    },
  })

  const adminUploadTransactionReceiptMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      toast.loading('Uploading transaction receipt...')
      const { data } =
        await transactionServiceApi.adminUploadTransactionReceipt(formData)
      return data.url
    },
    onError: (error: AxiosServerError) => {
      const { response } = error
      toast.dismiss()
      toast.error(response?.data.error.message || 'Failed to upload transaction reciept.')
    },
    onSuccess: (url: string | undefined) => {
      toast.dismiss()
      toast.success('Successfully uploaded transaction receipt')
      return url
    },
  })

  return {
    // 🧩 Values
    transactionVolume,
    loadingTransactionVolume,
    transactionCount,
    loadingTransactionCount,
    transactionTypeByPercentage,
    loadingTransactionTypeByPercentage,
    transactionVolumeTrend,
    loadingTransactionVolumeTrend,
    usersWithTopTransactionVolume,
    loadingUsersWithTopTransactionVolume,
    searchTransactions,
    loadingSearchTransactions,
    transactionDetail,
    loadingTransactionDetails,
    transactionInfo,
    loadingTransactionInfo,
    
    // Mutation
    adminUpdateTransactionMutation,
    adminUploadTransactionReceiptMutation,
  }
}
