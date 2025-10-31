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
  } = useTransactionsTable();

  const columns = useMemo(
    () =>
      TransactionsManagementColumn(
        handleSelectTransactionId,
        handleSelectAllTransactionIds,
        handleSortBy,
        handleShowTransactionDetails,
        selectedTransactionIds,
        searchTransactions?.transactions.length || 0,
      ),
    [
      handleSelectTransactionId,
      handleSelectAllTransactionIds,
      selectedTransactionIds,
    ],
  )
  const data = useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      TransactionsManagementDataRow(
        !loadingSearchTransactions ? searchTransactions?.transactions : [],
      ) || [],
    [searchTransactions?.transactions, loadingSearchTransactions],
  )

  return (
    <AuthenticatedLayout>
      <div className="p-6 max-w-7xl mx-auto bg-white">
        {/* header */}
        <PageHeader title="Manage Transactions" />
        
        {/* Controls */}
        <ManageTransactionsControls
          onOpenFilter={toggleApplyFilter}
          onApplyAction={toggleApplyAction}
          searchValue={query}
          onSearchChange={handleSearchQuery}
        />
        
        {/* Transactions Table */}
        <Table data={data} columns={columns} loading={loadingSearchTransactions} />
        
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
