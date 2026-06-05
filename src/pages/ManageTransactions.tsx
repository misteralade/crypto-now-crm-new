import { useMemo } from "react";
import PageHeader from "../components/global/pageHeader.tsx";
import {
  TransactionsManagementColumn,
  TransactionsManagementDataRow,
} from "../components/tables/TransactionsManagementTables.tsx";
import { useTransactionsTable } from "../hooks/tables/useTransactionsTable.ts";
import Table from "../components/table.tsx";
import TableFooter from "../components/tables/TableFooter.tsx";
import ManageTransactionFilterModal from "../components/pages/manageTransactions/ManageTransactionFilterModal.tsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import TransactionDetailsDrawer from "../components/pages/manageTransactions/TransactionDetailsDrawer.tsx";
import { useManageTransactionsPage } from "../hooks/pages/useManageTransactionsPage";
import { Download, Filter, RefreshCcw } from "lucide-react";
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
    handleExportAll,
    handleRefreshTransactions,
    isFetchingTransactions,
  } = useManageTransactionsPage();

  const {
    // 🧩 Values
    pageSize,
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
    toggleApplyFilter,
    resetSearchFilter,
    handleFromDate,
    handleToDate,
    handleMinAmountRange,
    handleMaxAmountRange,
    handleSelectedCryptoId,
    handleSelectedStatus,
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
      <div className="p-3 sm:p-6 mx-auto space-y-5">
        <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="shrink-0">
            <Select
              value={selectedStatsTimeline}
              onValueChange={(value) =>
                handleSelectedStatsTimelineChange(value as TimelineFilter)
              }
            >
              <SelectTrigger className="h-10 w-[118px] rounded-xl border-[#ECECEC] bg-white text-[13px] font-medium shadow-sm sm:w-[160px] sm:text-[14px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <button
            onClick={() => handleRefreshTransactions()}
            disabled={isFetchingTransactions}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#ECECEC] bg-white px-3 text-[13px] font-medium text-[#03034D] shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50 sm:px-4 sm:text-[14px]"
            title="Refresh Transactions"
          >
            <RefreshCcw
              className={`h-4 w-4 ${isFetchingTransactions ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={toggleApplyFilter}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#ECECEC] bg-white px-3 text-[13px] font-medium text-[#454745] shadow-sm transition-all hover:border-[#948EEE] hover:bg-[#F5F5FF] active:scale-95 sm:px-4 sm:text-[14px]"
          >
            <Filter className="h-4 w-4 text-[#454745] opacity-70" />
            <span className="hidden sm:inline">Filter</span>
          </button>

          <button
            onClick={handleExportAll}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#03034D] px-3 text-[13px] font-medium text-white transition-colors hover:bg-[#050568] active:scale-95 sm:px-4 sm:text-[14px]"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <div className="ml-auto shrink-0">
            <button
              onClick={resetSearchFilter}
              className="text-[13px] font-medium text-gray-500 transition-colors hover:text-gray-900 sm:text-sm"
            >
              Reset View
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#ECECEC] shadow-sm overflow-hidden p-2">
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
