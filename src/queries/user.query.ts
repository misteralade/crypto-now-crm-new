import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMatchRoute } from '@tanstack/react-router'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { ROUTES } from '../util/constants.util.ts'
import { userServiceApi } from '../api/user.api'
import {  store } from '../store'
import { QUERY_KEYS } from './querries.keys'
import type {RootState} from '../store';

export const useUserQuery = () => {
  const queryClient = useQueryClient()
  const matchRoute = useMatchRoute()
  const search = useSelector((state: RootState) => state.user.search.users)

  const { data: weeklyUserSummary, isLoading: loadingWeeklyUserSummary } =
    useQuery({
      queryKey: [
        QUERY_KEYS.USER.GET_WEEKLY_USER_STATS_SUMMARY,
        (store.getState() as RootState).dashboard.timelineFilter,
      ],
      queryFn: async () => {
        const timeline = (store.getState() as RootState).dashboard
          .timelineFilter
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!timeline) return null

        const { data, success } =
          await userServiceApi.getDashboardUserSummaryData({ timeline })

        if (success) {
          return data
        }

        return null
      },
      enabled:
        !!matchRoute({ to: ROUTES.DASHBOARD }) &&
        !!(store.getState() as RootState).dashboard.timelineFilter,
    })

  const { data: adminSearchUsers, isLoading: loadingAdminSearchUsers } = useQuery({
    queryKey: [QUERY_KEYS.USER.ADMIN_SEARCH_USERS, search],
    queryFn: async () => {
      const payload = (store.getState() as RootState).user.search.users
      const { data, success } = await userServiceApi.adminSearchUsers(payload)

        if (success) {
          return data
        }

      return null
    },
    enabled: !!matchRoute({ to: ROUTES.USERS }) && !!search,
  });

  const { data: userProfileSummary, isLoading: loadingUserProfileSummary } = useQuery({
    queryKey: [
      QUERY_KEYS.USER.GET_USER_PROFILE_SUMMARY,
      (store.getState() as RootState).user.details.userId,
    ],
    queryFn: async () => {
      const userId = (store.getState() as RootState).user.details.userId
      if (!userId) return null

        const { data, success } =
          await userServiceApi.getUserProfileSummary(userId)

        if (success) {
          return data
        }

        return null
      },
      enabled:
        !!matchRoute({ to: ROUTES.USERS }) &&
        !!(store.getState() as RootState).user.details.userId,
  });

  const { data: userProfile, isLoading: loadingUserProfile } = useQuery({
    queryKey: [
      QUERY_KEYS.USER.ADMIN_RETRIEVE_USER_PROFILE,
      (store.getState() as RootState).user.details.userId,
    ],
    queryFn: async () => {
      const userId = (store.getState() as RootState).user.details.userId
      if (!userId) return null

        const { data, success } =
          await userServiceApi.adminRetrieveUserProfile(userId)

        if (success) {
          return data
        }

        return null
      },
      enabled:
        !!matchRoute({ to: ROUTES.USERS_DETAILS }) &&
        !!(store.getState() as RootState).user.details.userId,
  });

  const patchUserStatusMutation = useMutation({
    mutationKey: [QUERY_KEYS.USER.PATCH_USER_STATUS],
    mutationFn: async () => {
      toast.loading(`Updating user status...`, {
        toastId: QUERY_KEYS.USER.PATCH_USER_STATUS,
      })
      const rootState = store.getState() as RootState
      const { userId, status } = rootState.user.details

      if (!userId || !status) return null

      return userServiceApi.adminPatchUserStatus(userId, status)
    },
    onSuccess: (res) => {
      toast.dismiss(QUERY_KEYS.USER.PATCH_USER_STATUS)
      toast.success('User status updated successfully.')
      // Invalidate and refetch user profile summary after mutation
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER.ADMIN_SEARCH_USERS],
      })
      return res
    },
    onError: () => {
      toast.dismiss(QUERY_KEYS.USER.PATCH_USER_STATUS)
      toast.error('Failed to update user status. Please try again.', {
        toastId: QUERY_KEYS.USER.PATCH_USER_STATUS,
      })
    },
  })

  const adminResetPasswordMutation = useMutation({
    mutationKey: [QUERY_KEYS.USER.ADMIN_RESET_USER_PASSWORD],
    mutationFn: async () => {
      toast.loading(`Resetting user password...`, {
        toastId: QUERY_KEYS.USER.ADMIN_RESET_USER_PASSWORD,
      })
      const rootState = store.getState() as RootState
      const userId = rootState.user.details.userId

      if (!userId) return null

      return userServiceApi.adminResetUserPassword(userId)
    },
    onSuccess: (res) => {
      toast.dismiss(QUERY_KEYS.USER.ADMIN_RESET_USER_PASSWORD)
      toast.success('User password reset successfully.')
      return res
    },
    onError: () => {
      toast.dismiss(QUERY_KEYS.USER.ADMIN_RESET_USER_PASSWORD)
      toast.error('Failed to reset user password. Please try again.', {
        toastId: QUERY_KEYS.USER.ADMIN_RESET_USER_PASSWORD,
      })
    },
  })

  return {
    // 🧩 Values
    weeklyUserSummary,
    loadingWeeklyUserSummary,
    adminSearchUsers,
    loadingAdminSearchUsers,
    userProfileSummary,
    loadingUserProfileSummary,
    userProfile,
    loadingUserProfile,

    // Mutations
    patchUserStatusMutation,
    adminResetPasswordMutation,
  }
}
