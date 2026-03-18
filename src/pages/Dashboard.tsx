import { useMemo } from 'react'
import {useDashboardPage} from "../hooks/pages/useDashboardPage";
import { convertToMillify } from '../util/index.util.ts';
import { UsersWithTopTransactionColumn, UsersWithTopTransactionDataRow } from '../components/tables/TransactionsManagementTables';
import type {TransactionTypeByPercentage, WeeklyTransactionVolumeTrend } from '../types/response.payload.types';
import type {TimelineFilter} from "../types/global.types";
import PageHeader from '../components/global/pageHeader';
import ShortSummaryCard from '../components/global/ShortSummaryCard';
import {PieGraph, VolumeTrend} from '../components/pages/dashboard/graphComponents';
import Table from "../components/table.tsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import { TrendingUp, Hash, Users, UserCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { SummaryCardSkeleton } from '../components/global/Skeleton';

const Dashboard = () => {
  const {
    // States
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
    handleViewTransactionDetails,
  } = useDashboardPage()
  
  const numberOfTransactionsDisplay = !loadingTransactionCount
    ? convertToMillify(transactionCount || 0)
    : 'Loading...'
  const columns = useMemo(() => UsersWithTopTransactionColumn(handleViewTransactionDetails), [ handleViewTransactionDetails ])
  const data = useMemo(
    () => UsersWithTopTransactionDataRow(usersWithTopTransactionVolume) ?? [],
    [usersWithTopTransactionVolume, loadingUsersWithTopTransactionVolume],
  )
  
  const timelineLabels: Record<string, string> = {
    week: 'This Week',
    month: 'This Month',
    year: 'This Year',
    all: 'All Time',
  }

  return (
    <AuthenticatedLayout>
      <PageHeader title="Overview" subtitle="Admin reports and analytics" />

      <div className="p-6 space-y-6">
        {/* Timeline + heading row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[26px] font-semibold text-[#0E0F0C] tracking-tight">
            Reports &amp; Analytics
          </h1>

          <Select value={selectedTimeline} onValueChange={(v) => handleSelectedTimelineChange(v as TimelineFilter)}>
            <SelectTrigger className="w-[140px] rounded-xl border-[#ECECEC] shadow-sm text-[14px] font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {loadingTransactionVolume ? <SummaryCardSkeleton /> : (
            <ShortSummaryCard
              title="Total Volume"
              value={`₦${convertToMillify(Number(transactionVolume?.totalFiatVolume))}`}
              time={timelineLabels[selectedTimeline] || ''}
              icon={<TrendingUp className="w-4 h-4" />}
            />
          )}

          {loadingTransactionCount ? <SummaryCardSkeleton /> : (
            <ShortSummaryCard
              title="Transactions"
              value={numberOfTransactionsDisplay}
              time={timelineLabels[selectedTimeline] || ''}
              icon={<Hash className="w-4 h-4" />}
            />
          )}

          {loadingWeeklyUserSummary ? <SummaryCardSkeleton /> : (
            <ShortSummaryCard
              title="New Users"
              value={`${Number(Number(weeklyUserSummary?.newUsersCount).toFixed(2)).toLocaleString()}`}
              time={timelineLabels[selectedTimeline] || ''}
              icon={<Users className="w-4 h-4" />}
            />
          )}

          {loadingWeeklyUserSummary ? <SummaryCardSkeleton /> : (
            <ShortSummaryCard
              title="Active Users"
              value={`${Number(Number(weeklyUserSummary?.activeUsersCount).toFixed(2)).toLocaleString()}`}
              time={timelineLabels[selectedTimeline] || ''}
              icon={<UserCheck className="w-4 h-4" />}
            />
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <VolumeTrend
              loading={loadingTransactionVolumeTrend}
              data={transactionVolumeTrend as Array<WeeklyTransactionVolumeTrend>}
            />
          </div>
          <div>
            <PieGraph
              loading={loadingTransactionTypeByPercentage}
              data={transactionTypeByPercentage as Array<TransactionTypeByPercentage>}
            />
          </div>
        </div>

        {/* High value transactions */}
        <div>
          <h3 className="text-[18px] font-semibold text-[#0E0F0C] mb-4">High Value Transactions</h3>
          <div className="bg-white rounded-2xl border border-[#ECECEC] overflow-hidden">
            <Table data={data} columns={columns} loading={loadingUsersWithTopTransactionVolume} />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default Dashboard;