import { useMemo } from "react";
import ManageTransactionsControls from "../components/pages/manageTransactions/ManageTransactionsControls.tsx";
import PageHeader from "../components/global/pageHeader.tsx";
import {
  TransactionsManagementColumn,
  TransactionsManagementDataRow,
} from "../components/tables/TransactionsManagementTables.tsx";
import { useTransactionsTable } from "../hooks/tables/useTransactionsTable.ts";
import Table from "../components/table.tsx";
import TableFooter from "../components/tables/TableFooter.tsx";
import ManageTransactionFilterModal from "../components/pages/manageTransactions/ManageTransactionFilterModal.tsx";
import TransactionDetailsDrawer from "../components/pages/manageTransactions/TransactionDetailsDrawer.tsx";
import { useManageTransactionsPage } from "../hooks/pages/useManageTransactionsPage";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import ShortSummaryCard from "../components/global/ShortSummaryCard";
import {
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  ShieldAlert,
  RefreshCcw,
} from "lucide-react";
import { SummaryCardSkeleton } from "../components/global/Skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import type { TimelineFilter } from "../types/global.types";

const ManageTransactions = () => {
  const {
    // 🧩 Values
    searchTransactions,
    loadingSearchTransactions,
    allSupportedCrypto,
    loadingAllSupportedCrypto,
    selectedTransactionIds,
    transactionDetail,
    loadingTransactionDetails,
    showTransactionDetails,
    adminTransactionStats,
    loadingAdminTransactionStats,
    selectedStatsTimeline,

    // ⚙️ Functions
    handleSelectTransactionId,
    handleSelectAllTransactionIds,
    handleSortBy,
    handleShowTransactionDetails,
    handleTransactionUpdateField,
    handleTransactionUpdate,
    handleTransactionReceiptUpload,
    handleManualPayoutRetry,
    retryingPayout,
    handlePageSizeChange: updatePageSize,
    handleSelectedStatsTimelineChange,
    handleRefreshTransactions,
    isFetchingTransactions,
  } = useManageTransactionsPage();

  const timelineLabels: Record<TimelineFilter, string> = {
    week: "This Week",
    month: "This Month",
    year: "This Year",
    all: "All Time",
  };

  const {
    // 🧩 Values
    pageSize,
    query,
    showFilter,
    fromDate,
    toDate,
    minAmountRange,
    maxAmountRange,
    selectedCryptoId,
    selectedStatus,

    // ⚙️ Functions
    handlePageChange,
    handlePageSizeChange,
    toggleApplyAction,
    toggleApplyFilter,
    handleSearchQuery,
    resetSearchFilter,
    handleFromDate,
    handleToDate,
    handleMinAmountRange,
    handleMaxAmountRange,
    handleSelectedCryptoId,
    handleSelectedStatus,
    handleSelectedPriority,
    handleViewTransactionDetails,
  } = useTransactionsTable({
    timeline: selectedStatsTimeline,
  });

  const columns = useMemo(
    () =>
      TransactionsManagementColumn(
        handleSelectTransactionId,
        handleSelectAllTransactionIds,
        handleSortBy,
        handleShowTransactionDetails,
        handleViewTransactionDetails,
        selectedTransactionIds,
        searchTransactions?.transactions.length || 0,
      ),
    [
      handleSelectTransactionId,
      handleSelectAllTransactionIds,
      handleSortBy,
      handleShowTransactionDetails,
      handleViewTransactionDetails,
      selectedTransactionIds,
      searchTransactions?.transactions.length,
    ],
  );

  const data = useMemo(
    () =>
      TransactionsManagementDataRow(
        !loadingSearchTransactions ? searchTransactions?.transactions : [],
      ) || [],
    [searchTransactions?.transactions, loadingSearchTransactions],
  );

  return (
    <AuthenticatedLayout>
      <PageHeader
        title="Transaction Management"
        subtitle="Monitor and manage all system transactions"
      />
      <div className="p-6 mx-auto space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Select
              value={selectedStatsTimeline}
              onValueChange={(value) =>
                handleSelectedStatsTimelineChange(value as TimelineFilter)
              }
            >
              <SelectTrigger className="w-[160px] rounded-xl border-[#ECECEC] shadow-sm text-[14px] font-medium bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>

            <button
              onClick={() => handleRefreshTransactions()}
              disabled={isFetchingTransactions}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#ECECEC] rounded-xl shadow-sm text-[14px] font-medium text-[#03034D] hover:bg-gray-50 disabled:opacity-50 transition-colors"
              title="Refresh Transactions"
            >
              <RefreshCcw
                className={`w-4 h-4 ${isFetchingTransactions ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetSearchFilter}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Reset View
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {loadingAdminTransactionStats ? (
            Array(6)
              .fill(0)
              .map((_, i) => <SummaryCardSkeleton key={i} />)
          ) : (
            <>
              <div
                onClick={() => handleSelectedStatus("ALL")}
                className="cursor-pointer"
              >
                <ShortSummaryCard
                  title="Total Orders"
                  value={adminTransactionStats?.totalOrders?.toString() || "0"}
                  time={timelineLabels[selectedStatsTimeline]}
                  icon={<Activity className="w-4 h-4" />}
                />
              </div>
              <div
                onClick={() => handleSelectedStatus("PAYOUT_INITIATED")}
                className="cursor-pointer"
              >
                <ShortSummaryCard
                  title="Payouts Sent"
                  value={adminTransactionStats?.payoutsSent?.toString() || "0"}
                  time={timelineLabels[selectedStatsTimeline]}
                  icon={<Zap className="w-4 h-4 text-orange-500" />}
                />
              </div>
              <div
                onClick={() => handleSelectedStatus("COMPLETED")}
                className="cursor-pointer"
              >
                <ShortSummaryCard
                  title="Completed"
                  value={adminTransactionStats?.completed?.toString() || "0"}
                  time={timelineLabels[selectedStatsTimeline]}
                  icon={<CheckCircle className="w-4 h-4 text-green-500" />}
                />
              </div>
              <div
                onClick={() => handleSelectedStatus("AWAITING_PAYMENT")}
                className="cursor-pointer"
              >
                <ShortSummaryCard
                  title="In Review"
                  value={adminTransactionStats?.inReview?.toString() || "0"}
                  time={timelineLabels[selectedStatsTimeline]}
                  icon={<Clock className="w-4 h-4 text-amber-500" />}
                />
              </div>
              <div
                onClick={() => handleSelectedStatus("PAYOUT_FAILED")}
                className="cursor-pointer"
              >
                <ShortSummaryCard
                  title="Payout Failed"
                  value={adminTransactionStats?.payoutFailed?.toString() || "0"}
                  time={timelineLabels[selectedStatsTimeline]}
                  icon={<AlertCircle className="w-4 h-4 text-red-500" />}
                />
              </div>
              <div
                onClick={() => handleSelectedStatus("PENDING_PAYOUT")}
                className="cursor-pointer"
              >
                <ShortSummaryCard
                  title="Pending Payout"
                  value={
                    adminTransactionStats?.pendingPayout?.toString() || "0"
                  }
                  time={timelineLabels[selectedStatsTimeline]}
                  icon={<Clock className="w-4 h-4 text-blue-500" />}
                />
              </div>
              <div
                onClick={() => handleSelectedPriority("URGENT")}
                className="cursor-pointer"
              >
                <ShortSummaryCard
                  title="Critical"
                  value={adminTransactionStats?.critical?.toString() || "0"}
                  time={timelineLabels[selectedStatsTimeline]}
                  icon={<ShieldAlert className="w-4 h-4 text-red-600" />}
                />
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-[#ECECEC] shadow-sm overflow-hidden p-2">
          {/* Controls */}
          <div className="px-4 py-2">
            <ManageTransactionsControls
              onOpenFilter={toggleApplyFilter}
              onApplyAction={toggleApplyAction}
              searchValue={query}
              onSearchChange={handleSearchQuery}
            />
          </div>

          {/* Transactions Table */}
          <div className="overflow-hidden">
          <Table
            data={data}
            columns={columns}
            loading={loadingSearchTransactions}
            onRowClick={(row) => handleShowTransactionDetails(row.id)}
          />
          </div>

          <div className="px-4 py-4 bg-[#F9FAFB] border-t border-[#ECECEC] rounded-b-3xl">
            <TableFooter
              currentPage={searchTransactions?.page || 1}
              totalPages={searchTransactions?.totalPages || 1}
              pageSize={pageSize}
              totalItems={searchTransactions?.count || 100}
              onPageChange={handlePageChange}
              onPageSizeChange={(size: number) => {
                handlePageSizeChange(size);
                updatePageSize(size);
              }}
            />
          </div>
        </div>

        {/* Filter Modal */}
        <ManageTransactionFilterModal
          isOpen={showFilter}
          onClose={toggleApplyFilter}
          onReset={resetSearchFilter}
          fromDate={fromDate}
          toDate={toDate}
          minAmountRange={minAmountRange}
          maxAmountRange={maxAmountRange}
          handleFromDate={handleFromDate}
          handleToDate={handleToDate}
          handleMinAmountRange={handleMinAmountRange}
          handleMaxAmountRange={handleMaxAmountRange}
          supportedCryptos={
            !loadingAllSupportedCrypto ? allSupportedCrypto : []
          }
          selectedCryptoId={selectedCryptoId}
          handleSelectedCryptoId={handleSelectedCryptoId}
          selectedStatus={selectedStatus}
          handleSelectedStatus={handleSelectedStatus}
        />

        {/* Transaction Details Drawer */}
        <TransactionDetailsDrawer
          isOpen={showTransactionDetails}
          onClose={handleShowTransactionDetails}
          transaction={transactionDetail}
          loading={loadingTransactionDetails}
          handleTransactionUpdateField={handleTransactionUpdateField}
          handleTransactionUpdate={handleTransactionUpdate}
          handleTransactionReceiptUpload={handleTransactionReceiptUpload}
          handleManualPayoutRetry={handleManualPayoutRetry}
          retryingPayout={retryingPayout}
        />
      </div>
    </AuthenticatedLayout>
  );
};

export default ManageTransactions;
