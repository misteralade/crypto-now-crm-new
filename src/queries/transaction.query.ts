import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMatchRoute } from '@tanstack/react-router'
import { toast } from 'react-toastify'
import {useSelector} from "react-redux";
import {ROUTES, TIME_IN_MILLISECONDS} from '../util/constants.util.ts'
import { transactionServiceApi } from '../api/transaction.api'
import { store  } from '../store'
import { QUERY_KEYS } from './querries.keys'
import type {RootState} from '../store';
import type { TimelineFilter } from '../types/global.types';
import type {
  AxiosServerError,
  AdminRetryPendingPayoutsResponse,
  SearchTransactionsResponse,
  UsersWithTopTransactionVolume,
  WeeklyTransactionVolumeTrend,
} from '../types/response.payload.types'

type UseTransactionQueryOptions = {
  adminStatsTimeline?: TimelineFilter;
}

export const useTransactionQuery = (options?: UseTransactionQueryOptions) => {
  const queryClient = useQueryClient()
  const matchRoute = useMatchRoute()
  const searchTransaction = useSelector((state: RootState) => state.transactionManagement.search.transactions);
  const dashboardTimelineFilter = useSelector(
    (state: RootState) => state.dashboard.timelineFilter,
  );
  const adminStatsTimeline = options?.adminStatsTimeline ?? 'all';

  const { data: transactionVolume, isLoading: loadingTransactionVolume } = useQuery({
      queryKey: [
        QUERY_KEYS.TRANSACTION.GET_WEEKLY_TRANSACTION_VOLUME,
        dashboardTimelineFilter,
      ],
      queryFn: async () => {
        const timeline = dashboardTimelineFilter
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
        !!dashboardTimelineFilter,
    });

  const { data: weeklyTransactionCount, isLoading: loadingWeeklyTransactionCount } = useQuery({
    queryKey: [
      QUERY_KEYS.TRANSACTION.GET_WEEKLY_TRANSACTION_COUNT,
      dashboardTimelineFilter,
    ],
    queryFn: async () => {
      const timeline = dashboardTimelineFilter
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
      !!dashboardTimelineFilter,
  });

  const { data: transactionVolumeTrend, isLoading: loadingTransactionVolumeTrend } = useQuery({
    queryKey: [
      QUERY_KEYS.TRANSACTION.GET_TRANSACTION_VOLUME_TREND,
      dashboardTimelineFilter,
    ],
    queryFn: async () => {
      const timeline = dashboardTimelineFilter
      if (!timeline) return [] as Array<WeeklyTransactionVolumeTrend>

      const { data, success } =
        await transactionServiceApi.getTransactionVolumeTrend({ timeline })
      if (success) return data as Array<WeeklyTransactionVolumeTrend>
      return [] as Array<WeeklyTransactionVolumeTrend>
    },
    enabled:
      !!matchRoute({ to: ROUTES.DASHBOARD }) &&
      !!dashboardTimelineFilter,
  });

  const { data: usersWithTopTransactionVolume, isLoading: loadingUsersWithTopTransactionVolume } = useQuery({
    queryKey: [
      QUERY_KEYS.TRANSACTION.GET_USERS_WITH_TOP_TRANSACTION_VOLUME,
      dashboardTimelineFilter,
    ],
    queryFn: async () => {
      const timeline = dashboardTimelineFilter
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
      !!dashboardTimelineFilter,
  });

  const { data: transactionTypeByPercentage, isLoading: loadingTransactionTypeByPercentage } = useQuery({
    queryKey: [
      QUERY_KEYS.TRANSACTION.GET_TRANSACTION_TYPE_BY_PERCENTAGE,
      dashboardTimelineFilter,
    ],
    queryFn: async () => {
      const timeline = dashboardTimelineFilter
      if (!timeline) return null

      const { data, success } =
        await transactionServiceApi.getTransactionTypeByPercentage({ timeline })
      if (success) return data
      return null
    },
    enabled:
      !!matchRoute({ to: ROUTES.DASHBOARD }) &&
      !!dashboardTimelineFilter,
  });

  const { data: adminTransactionStats, isLoading: loadingAdminTransactionStats } = useQuery({
    queryKey: [
      'GET_ADMIN_TRANSACTION_STATS',
      adminStatsTimeline,
    ],
    queryFn: async () => {
      const timeline = adminStatsTimeline.toUpperCase()
      const { data, success } = await transactionServiceApi.getAdminTransactionStats({ timeline })
      if (success) return data
      return null
    },
    enabled: !!matchRoute({ to: ROUTES.TRANSACTIONS }),
  })

  // Aliases expected by consumers
  const transactionCount = weeklyTransactionCount
  const loadingTransactionCount = loadingWeeklyTransactionCount

  const searchUserTransactionHistory = useSelector((state: RootState) => state.transactionManagement.search.userTransactionHistory);

  const { data: searchTransactions, isLoading: loadingSearchTransactions } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTION.SEARCH_TRANSACTIONS, searchTransaction],
    queryFn: async () => {
      const payload = (store.getState() as RootState).transactionManagement.search.transactions
      if (!payload) return null;

      const { data, success } = await transactionServiceApi.searchTransactions(payload);

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!(matchRoute({ to: ROUTES.TRANSACTIONS }) || matchRoute({ to: ROUTES.USERS_DETAILS })) && !!searchTransaction && !matchRoute({ to: ROUTES.USER_TRANSACTIONS }),
    refetchInterval: TIME_IN_MILLISECONDS.ONE_MINUTE,
  });

  const { data: searchUserTransactions, isLoading: loadingSearchUserTransactions } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTION.SEARCH_TRANSACTIONS, searchUserTransactionHistory],
    queryFn: async () => {
      const payload = (store.getState() as RootState).transactionManagement.search.userTransactionHistory
      if (!payload) return null;

      const { data, success } = await transactionServiceApi.searchTransactions(payload);

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!matchRoute({ to: ROUTES.USER_TRANSACTIONS }) && !!searchUserTransactionHistory,
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

        const { data, success } =
          await transactionServiceApi.adminGetTransactionDetails(sessionId)

        if (success) {
          return data as SearchTransactionsResponse | undefined
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

      if (!updatePayload) {
        toast.dismiss()
        return null
      }

      const { success, message } =
        await transactionServiceApi.adminUpdateTransactionStatusAndAdminNotes(
          sessionId,
          updatePayload,
        )

      return { success, message }
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
      const sessionId = (store.getState() as RootState).transactionManagement.details.transactionSessionId
      
      if (!sessionId) {
        toast.dismiss()
        throw new Error('Transaction session ID is required')
      }
      
      const { data } =
        await transactionServiceApi.adminUploadTransactionReceipt(formData, sessionId)
      return { url: data.url, signedUrl: data.signedUrl }
    },
    onError: (error: AxiosServerError) => {
      const { response } = error
      toast.dismiss()
      toast.error(response?.data.error.message || 'Failed to upload transaction reciept.')
    },
    onSuccess: (result: { url: string; signedUrl: string } | undefined) => {
      toast.dismiss()
      toast.success('Successfully uploaded transaction receipt')
      return result
    },
  })

  const adminLockTransactionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const { success, data } = await transactionServiceApi.adminLockTransaction(sessionId)
      return { success, data }
    },
    onError: (error: AxiosServerError) => {
      // Error handling will be done in the component
      throw error
    },
  })

  const adminRetryPendingPayoutsMutation = useMutation({
    mutationFn: async (params?: { sessionId?: string; forceProceed?: boolean }) => {
      toast.loading('Processing payout retries...')
      const { data, success, message } = await transactionServiceApi.adminRetryPendingPayouts(
        params?.sessionId,
        params?.forceProceed === true,
      )
      return { success, message, data }
    },
    onSuccess: async (
      res: {
        success: boolean
        message: string
        data: AdminRetryPendingPayoutsResponse
      },
      variables,
    ) => {
      toast.dismiss()
      if (res?.success) {
        const warnings = res.data?.warnings || []
        const requiresConfirmation =
          res.data?.requiresConfirmation === true && variables?.forceProceed !== true

        if (requiresConfirmation) {
          const warningMessage = warnings.join('\n')
          toast.warning(warnings[0] || res.message)
          const confirmed = window.confirm(
            `${warningMessage || res.message}\n\nProceed anyway?`,
          )

          if (confirmed) {
            await adminRetryPendingPayoutsMutation.mutateAsync({
              sessionId: variables?.sessionId,
              forceProceed: true,
            })
            return
          }

          return
        }

        if (warnings.length > 0) {
          toast.warning(warnings[0])
        }
        toast.success(res.message)

        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTION.SEARCH_TRANSACTIONS] })
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER.GET_WEEKLY_USER_STATS_SUMMARY] })
      } else {
        toast.error(res?.message || 'Failed to retry payouts')
      }
    },
    onError: (error: AxiosServerError) => {
      toast.dismiss()
      toast.error(error.response?.data.error.message || 'An unexpected error occurred')
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
    searchUserTransactions,
    loadingSearchUserTransactions,
    transactionDetail,
    loadingTransactionDetails,
    transactionInfo,
    loadingTransactionInfo,
    adminTransactionStats,
    loadingAdminTransactionStats,
    
    // Mutation
    adminUpdateTransactionMutation,
    adminUploadTransactionReceiptMutation,
    adminLockTransactionMutation,
    adminRetryPendingPayoutsMutation,
  }
}
