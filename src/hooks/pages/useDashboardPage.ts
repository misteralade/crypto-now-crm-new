import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setSearchTransactionsField } from '../../redux/transaction-management.slice'
import { useTransactionQuery } from '../../queries/transaction.query'
import { useUserQuery } from '../../queries/user.query'
import { setSelectedTimeline as reduxSetSelectedTimeline } from '../../redux/dashboard.slice'
import type { TimelineFilter } from '../../types/global.types'
import {useNavigate} from "@tanstack/react-router";
import {ROUTES} from "../../util/constants.util.ts";

export const useDashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const {
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
    adminTransactionStats,
    loadingAdminTransactionStats,
    adminRetryPendingPayoutsMutation,
  } = useTransactionQuery()

  const { weeklyUserSummary, loadingWeeklyUserSummary } = useUserQuery()

  const [selectedTimeline, setSelectedTimeline] =
    useState<TimelineFilter>('week')

  const handleSelectedTimelineChange = (timeline: TimelineFilter) => {
    setSelectedTimeline(timeline)
    dispatch(reduxSetSelectedTimeline(timeline))
  }
  
  const handleViewTransactionDetails = (sessionId: string) => navigate( { to: `/dashboard/transaction/${sessionId}` as any })

  const handleRetryAllPendingPayouts = () => {
    adminRetryPendingPayoutsMutation.mutate(undefined);
  }

  const handleViewPendingPayouts = () => {
    dispatch(setSearchTransactionsField({
      field: 'status',
      value: 'PENDING_PAYOUT',
    }))
    dispatch(setSearchTransactionsField({
      field: 'page',
      value: 1,
    }))
    navigate({ 
      to: ROUTES.TRANSACTIONS,
      search: { status: 'PENDING_PAYOUT' } as any 
    });
  }

  const handleViewInReviewTransactions = () => {
    dispatch(setSearchTransactionsField({
      field: 'status',
      value: 'IN_REVIEW',
    }))
    dispatch(setSearchTransactionsField({
      field: 'page',
      value: 1,
    }))
    navigate({
      to: ROUTES.TRANSACTIONS,
    })
  }

  return {
    // 🧩 Values
    transactionVolume,
    loadingTransactionVolume,
    transactionCount,
    loadingTransactionCount,
    weeklyUserSummary,
    loadingWeeklyUserSummary,
    selectedTimeline,
    transactionTypeByPercentage,
    loadingTransactionTypeByPercentage,
    transactionVolumeTrend,
    loadingTransactionVolumeTrend,
    usersWithTopTransactionVolume,
    loadingUsersWithTopTransactionVolume,
    adminTransactionStats,
    loadingAdminTransactionStats,
    retryingPayouts: adminRetryPendingPayoutsMutation.isPending,

    // ⚙️ Functions
    handleSelectedTimelineChange,
    handleViewTransactionDetails,
    handleRetryAllPendingPayouts,
    handleViewPendingPayouts,
    handleViewInReviewTransactions,
  }
}
