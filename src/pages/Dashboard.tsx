import { useMemo } from 'react'
import {useDashboardPage} from "../hooks/pages/useDashboardPage";
import { convertToMillify } from '../util';
import { usersWithTopTransactionColumn, UsersWithTopTransactionDataRow } from '../components/tables/TransactionsManagementTables';
import type {TransactionTypeByPercentage, WeeklyTransactionVolumeTrend } from '../types/response.payload.types';
import type {TimelineFilter} from "../types/global.types";
import PageHeader from '../components/global/pageHeader';
import ShortSummaryCard from '../components/global/ShortSummaryCard';
import {PieGraph, VolumeTrend} from '../components/pages/dashboard/graphComponents';
import Table from "../components/table.tsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";

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
  } = useDashboardPage()
  
  const numberOfTransactionsDisplay = !loadingTransactionCount
    ? convertToMillify(transactionCount || 0)
    : 'Loading...'
  const columns = useMemo(() => usersWithTopTransactionColumn, [])
  const data = useMemo(
    () => UsersWithTopTransactionDataRow(usersWithTopTransactionVolume) ?? [],
    [usersWithTopTransactionVolume, loadingUsersWithTopTransactionVolume],
  )
  
  return (
    <AuthenticatedLayout>
      <div className="p-6 min-h-screen container max-w-7xl">
        <PageHeader title="Overview" />
        
        <div className="p-4 w-full flex items-center justify-between">
          <h1 className="text-[32px] font-medium leading-[100%] text-[#0E0F0C]">
            Admin reports and analytics
          </h1>
          
          <div className="w-full max-w-sm min-w-[200px]">
            <label className="block mb-1 text-sm text-slate-800">
              Timeline Selection
            </label>
            
            <div className="relative">
              <select
                onChange={(e) =>
                  handleSelectedTimelineChange(e.target.value as TimelineFilter)
                }
                value={selectedTimeline}
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-lg pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="all">All Time</option>
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.2"
                stroke="currentColor"
                className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[16px] mb-8 mt-6">
          <ShortSummaryCard
            title="Total Transaction Volume"
            value={
              !loadingTransactionVolume
                ? `₦${convertToMillify(Number(transactionVolume?.totalFiatVolume))}`
                : 'Loading...'
            }
            time={`This ${selectedTimeline}`}
          />
          
          <ShortSummaryCard
            title="Number of transactions"
            value={numberOfTransactionsDisplay}
            time={`This ${selectedTimeline}`}
          />
          
          <ShortSummaryCard
            title="New Users"
            value={
              !loadingWeeklyUserSummary
                ? `${Number(Number(weeklyUserSummary?.newUsersCount).toFixed(2)).toLocaleString()}`
                : 'Loading...'
            }
            time={`This ${selectedTimeline}`}
          />
          
          <ShortSummaryCard
            title="Active users"
            value={
              !loadingWeeklyUserSummary
                ? `${Number(Number(weeklyUserSummary?.activeUsersCount).toFixed(2)).toLocaleString()}`
                : 'Loading...'
            }
            time={`This ${selectedTimeline}`}
          />
        </div>
        
        {/* Graph table */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
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
        
        <div className="mt-6">
          <div className="mb-4">
            <h3 className="text-[24px] font-medium">High Value transactions</h3>
          </div>
          <div className="space-y-4">
            <Table data={data} columns={columns} loading={loadingUsersWithTopTransactionVolume} />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default Dashboard;