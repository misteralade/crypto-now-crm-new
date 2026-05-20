import { useMemo } from 'react'
import { UserTransactionsManagementColumn, UserTransactionsManagementDataRow } from "../components/tables/TransactionsManagementTables";
import Table from "../components/table";
import TableFooter from "../components/tables/TableFooter";
import { useUserTransactionHistoryTable } from "../hooks/tables/useUserTransactionHistoryTable";
import ManageTransactionFilterModal from "../components/pages/manageTransactions/ManageTransactionFilterModal.tsx";
import ManageTransactionsControls from "../components/pages/manageTransactions/ManageTransactionsControls.tsx";
import PageHeader from "../components/global/pageHeader.tsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import { useUserTransactionHistoryPage } from '../hooks/pages/useUserTransactionHistoryPage.ts';
import { ArrowLeft, RefreshCcw } from 'lucide-react';

const UserTransactionHistory = () => {
  const {
    // 🧩 Values
    searchTransactions,
    loadingSearchTransactions,
    allSupportedCrypto,
    loadingAllSupportedCrypto,
    handlePageSizeChange: updatePageSize,

    // ⚙️ Functions
    handleDownloadSingle,
    handleExportAll,
    handleRefreshTransactions,
    isFetchingTransactions,
    goBack,
  } = useUserTransactionHistoryPage();
  
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
    handleViewTransactionDetails
  } = useUserTransactionHistoryTable();

  const columns = useMemo(() => UserTransactionsManagementColumn(handleViewTransactionDetails, handleDownloadSingle),
    [
      searchTransactions,
      loadingSearchTransactions,
    ],
  )

  const data = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    () => UserTransactionsManagementDataRow(!loadingSearchTransactions ? searchTransactions?.transactions : []) || [],
    [searchTransactions?.transactions, loadingSearchTransactions],
  )

  return (
    <AuthenticatedLayout>
      <PageHeader
        title="Transaction History"
        onBack={goBack}
        actions={
          <button
            onClick={() => handleRefreshTransactions()}
            disabled={isFetchingTransactions}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#ECECEC] rounded-lg shadow-sm text-[13px] font-medium text-[#03034D] hover:bg-gray-50 disabled:opacity-50 transition-colors"
            title="Refresh Transactions"
          >
            <RefreshCcw
              className={`w-3.5 h-3.5 ${isFetchingTransactions ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        }
      />
      <div className="p-6 mx-auto">
        <ManageTransactionsControls
          onOpenFilter={toggleApplyFilter}
          onApplyAction={toggleApplyAction}
          searchValue={query}
          onSearchChange={handleSearchQuery}
          handleExportAll={handleExportAll}
        />
        
        <Table
          data={data}
          columns={columns}
          loading={loadingSearchTransactions}
        />
        
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
      </div>
    </AuthenticatedLayout>
  )
}

export default UserTransactionHistory;
