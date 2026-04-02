import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { QUERY_KEYS } from './querries.keys'
import { kycSessionServiceApi } from '../api/kyc-session.api'
import { store } from '../store'
import type { RootState } from '../store'
import type { AxiosServerError } from '../types/response.payload.types'
import type { KycSessionStep } from '../types/kyc-session.types'
import {
  clearApprove,
  clearEscalate,
  clearReject,
} from '../redux/kyc-session.slice'

export const useKycSessionQuery = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  // ─── List sessions ────────────────────────────────────────────────────────

  const useAdminGetSessions = (params: {
    page: number
    limit: number
    status?: KycSessionStep
    userId?: string
  }) =>
    useQuery({
      queryKey: [QUERY_KEYS.KYC_SESSIONS.ADMIN_GET_SESSIONS, params],
      queryFn: async () => {
        const { data, success } = await kycSessionServiceApi.adminGetSessions(params)
        if (success) return data
        return null
      },
    })

  // ─── Session detail ───────────────────────────────────────────────────────

  const useAdminGetSessionDetail = (id: string | undefined) =>
    useQuery({
      queryKey: [QUERY_KEYS.KYC_SESSIONS.ADMIN_GET_SESSION_DETAIL, id],
      queryFn: async () => {
        if (!id) return null
        const { data, success } = await kycSessionServiceApi.adminGetSessionDetail(id)
        if (success) return data
        return null
      },
      enabled: !!id,
    })

  // ─── Session media ────────────────────────────────────────────────────────

  const useAdminGetSessionMedia = (id: string | undefined, enabled: boolean) =>
    useQuery({
      queryKey: [QUERY_KEYS.KYC_SESSIONS.ADMIN_GET_SESSION_MEDIA, id],
      queryFn: async () => {
        if (!id) return null
        const { data, success } = await kycSessionServiceApi.adminGetSessionMedia(id)
        if (success) return data
        return null
      },
      enabled: !!id && enabled,
      staleTime: 5 * 60 * 1000, // signed URLs valid for ~15min; refetch after 5min
    })

  // ─── Escalate ─────────────────────────────────────────────────────────────

  const escalateMutation = useMutation({
    mutationKey: [QUERY_KEYS.KYC_SESSIONS.ADMIN_ESCALATE],
    mutationFn: async () => {
      toast.loading('Escalating session…', { toastId: QUERY_KEYS.KYC_SESSIONS.ADMIN_ESCALATE })
      const { sessionId, notes } = (store.getState() as RootState).kycSession.escalate
      if (!sessionId) throw new Error('No session selected')
      const { message, success } = await kycSessionServiceApi.adminEscalate(sessionId, notes)
      return { message, success }
    },
    onSuccess: ({ message }) => {
      toast.dismiss()
      toast.success(message || 'Session escalated to pending review')
      dispatch(clearEscalate())
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.KYC_SESSIONS.ADMIN_GET_SESSIONS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.KYC_SESSIONS.ADMIN_GET_SESSION_DETAIL] })
    },
    onError: (error: AxiosServerError) => {
      toast.dismiss()
      const msg = error.response?.data?.error?.message || 'Failed to escalate session'
      toast.error(msg)
    },
  })

  // ─── Approve ──────────────────────────────────────────────────────────────

  const approveMutation = useMutation({
    mutationKey: [QUERY_KEYS.KYC_SESSIONS.ADMIN_APPROVE],
    mutationFn: async () => {
      toast.loading('Approving session…', { toastId: QUERY_KEYS.KYC_SESSIONS.ADMIN_APPROVE })
      const { sessionId } = (store.getState() as RootState).kycSession.approve
      if (!sessionId) throw new Error('No session selected')
      const { message, success } = await kycSessionServiceApi.adminApprove(sessionId)
      return { message, success }
    },
    onSuccess: ({ message }) => {
      toast.dismiss()
      toast.success(message || 'Session approved successfully')
      dispatch(clearApprove())
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.KYC_SESSIONS.ADMIN_GET_SESSIONS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.KYC_SESSIONS.ADMIN_GET_SESSION_DETAIL] })
    },
    onError: (error: AxiosServerError) => {
      toast.dismiss()
      const msg = error.response?.data?.error?.message || 'Failed to approve session'
      toast.error(msg)
    },
  })

  // ─── Reject ───────────────────────────────────────────────────────────────

  const rejectMutation = useMutation({
    mutationKey: [QUERY_KEYS.KYC_SESSIONS.ADMIN_REJECT],
    mutationFn: async () => {
      toast.loading('Rejecting session…', { toastId: QUERY_KEYS.KYC_SESSIONS.ADMIN_REJECT })
      const { sessionId, reason } = (store.getState() as RootState).kycSession.reject
      if (!sessionId) throw new Error('No session selected')
      const { message, success } = await kycSessionServiceApi.adminReject(sessionId, reason)
      return { message, success }
    },
    onSuccess: ({ message }) => {
      toast.dismiss()
      toast.success(message || 'Session rejected')
      dispatch(clearReject())
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.KYC_SESSIONS.ADMIN_GET_SESSIONS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.KYC_SESSIONS.ADMIN_GET_SESSION_DETAIL] })
    },
    onError: (error: AxiosServerError) => {
      toast.dismiss()
      const msg = error.response?.data?.error?.message || 'Failed to reject session'
      toast.error(msg)
    },
  })

  return {
    useAdminGetSessions,
    useAdminGetSessionDetail,
    useAdminGetSessionMedia,
    escalateMutation,
    approveMutation,
    rejectMutation,
  }
}
