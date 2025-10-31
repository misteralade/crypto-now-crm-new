import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTransactionQuery } from '../../queries/transaction.query'
import { useUserQuery } from '../../queries/user.query'
import { setSelectedTimeline as reduxSetSelectedTimeline } from '../../redux/dashboard.slice'
import type { TimelineFilter } from '../../types/global.types'

export const useDashboardPage = () => {
  const dispatch = useDispatch()
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
  } = useTransactionQuery()

  const { weeklyUserSummary, loadingWeeklyUserSummary } = useUserQuery()

  const [selectedTimeline, setSelectedTimeline] =
    useState<TimelineFilter>('week')

  const handleSelectedTimelineChange = (timeline: TimelineFilter) => {
    setSelectedTimeline(timeline)
    dispatch(reduxSetSelectedTimeline(timeline))
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

    // ⚙️ Functions
    handleSelectedTimelineChange,
  }
}
