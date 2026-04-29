import { useMemo } from 'react'
import ManageTransactionsControls from "../components/pages/manageTransactions/ManageTransactionsControls.tsx";
import PageHeader from "../components/global/pageHeader.tsx";
import {TransactionsManagementColumn, TransactionsManagementDataRow } from '../components/tables/TransactionsManagementTables.tsx';
import {useTransactionsTable} from "../hooks/tables/useTransactionsTable.ts";
import Table from "../components/table.tsx";
import TableFooter from '../components/tables/TableFooter.tsx';
import ManageTransactionFilterModal from '../components/pages/manageTransactions/ManageTransactionFilterModal.tsx';
import TransactionDetailsDrawer from "../components/pages/manageTransactions/TransactionDetailsDrawer.tsx";
import { useManageTransactionsPage } from '../hooks/pages/useManageTransactionsPage';
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import ShortSummaryCard from '../components/global/ShortSummaryCard';
import { Activity, CheckCircle, Clock, AlertCircle, Zap, ShieldAlert } from 'lucide-react';
import { SummaryCardSkeleton } from '../components/global/Skeleton';

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

    // ⚙️ Functions
    handleSelectTransactionId,
    handleSelectAllTransactionIds,
    handleSortBy,
    handleShowTransactionDetails,
    handleTransactionUpdateField,
    handleTransactionUpdate,
    handleTransactionReceiptUpload,
    handlePageSizeChange: updatePageSize,
  } = useManageTransactionsPage()

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
    handleViewTransactionDetails,
  } = useTransactionsTable();

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
      selectedTransactionIds,
      searchTransactions?.transactions.length,
    ],
  );

  const data = useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      TransactionsManagementDataRow(
        !loadingSearchTransactions ? searchTransactions?.transactions : [],
      ) || [],
    [searchTransactions?.transactions, loadingSearchTransactions],
  );

  return (
    <AuthenticatedLayout>
      <div className="p-6 mx-auto space-y-8">
        {/* header */}
        <div className="flex items-center justify-between">
          <PageHeader title="Transaction Management" subtitle="Monitor and manage all system transactions" />
          <div className="flex gap-2">
            <button 
              onClick={resetSearchFilter}
              className="px-4 py-2 text-sm font-medium text-[#667085] hover:text-[#0E0F0C] transition-colors"
            >
              Reset View
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {loadingAdminTransactionStats ? Array(6).fill(0).map((_, i) => <SummaryCardSkeleton key={i} />) : (
            <>
              <div onClick={() => handleSelectedStatus('ALL')} className="cursor-pointer">
                <ShortSummaryCard
                  title="Total Orders"
                  value={adminTransactionStats?.totalTransactions?.toString() || '0'}
                  time="Current timeline"
                  icon={<Activity className="w-4 h-4" />}
                />
              </div>
              <div onClick={() => handleSelectedStatus('PAYOUT_INITIATED')} className="cursor-pointer">
                <ShortSummaryCard
                  title="Payouts Sent"
                  value={adminTransactionStats?.payoutInitiated?.toString() || '0'}
                  time="Initiated"
                  icon={<Zap className="w-4 h-4 text-orange-500" />}
                />
              </div>
              <div onClick={() => handleSelectedStatus('COMPLETED')} className="cursor-pointer">
                <ShortSummaryCard
                  title="Completed"
                  value={adminTransactionStats?.completed?.toString() || '0'}
                  time="Successfully paid"
                  icon={<CheckCircle className="w-4 h-4 text-green-500" />}
                />
              </div>
              <div onClick={() => handleSelectedStatus('PAYOUT_FAILED')} className="cursor-pointer">
                <ShortSummaryCard
                  title="Payout Failed"
                  value={adminTransactionStats?.payoutFailed?.toString() || '0'}
                  time="Needs retry"
                  icon={<AlertCircle className="w-4 h-4 text-red-500" />}
                />
              </div>
              <div onClick={() => handleSelectedStatus('PENDING_PAYOUT')} className="cursor-pointer">
                <ShortSummaryCard
                  title="Pending Payout"
                  value={adminTransactionStats?.pendingPayout?.toString() || '0'}
                  time="Awaiting funds"
                  icon={<Clock className="w-4 h-4 text-blue-500" />}
                />
              </div>
              <div onClick={() => handleSelectedStatus('URGENT' as any)} className="cursor-pointer">
                <ShortSummaryCard
                  title="Critical"
                  value={adminTransactionStats?.urgentAttention?.toString() || '0'}
                  time="Urgent Attention"
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
            <Table data={data} columns={columns} loading={loadingSearchTransactions} />
          </div>

          <div className="px-4 py-4 bg-[#F9FAFB] border-t border-[#ECECEC] rounded-b-3xl">
            <TableFooter
              currentPage={searchTransactions?.page || 1}
              totalPages={searchTransactions?.totalPages || 1}
              pageSize={pageSize}
              totalItems={searchTransactions?.count || 100}
              onPageChange={handlePageChange}
              onPageSizeChange={(size: number) => {
                handlePageSizeChange(size)
                updatePageSize(size)
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
          supportedCryptos={!loadingAllSupportedCrypto ? allSupportedCrypto : []}
          selectedCryptoId={selectedCryptoId}
          handleSelectedCryptoId={handleSelectedCryptoId}
          selectedStatus={selectedStatus}
          handleSelectedStatus={handleSelectedStatus}
        />
        
        {/* Transaction Details Drawer */}
        <TransactionDetailsDrawer
          isOpen={showTransactionDetails}
          onClose={handleShowTransactionDetails}
          transaction={!loadingTransactionDetails ? transactionDetail : undefined}
          handleTransactionUpdateField={handleTransactionUpdateField}
          handleTransactionUpdate={handleTransactionUpdate}
          handleTransactionReceiptUpload={handleTransactionReceiptUpload}
        />
      </div>
    </AuthenticatedLayout>
  )
}

export default ManageTransactions
