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
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import TransactionDetailsDrawer from "../components/pages/manageTransactions/TransactionDetailsDrawer.tsx";
import { useManageTransactionsPage } from "../hooks/pages/useManageTransactionsPage";

const ManageTransactions = () => {
  const {
    // 🧩 Values
    searchTransactions,
    loadingSearchTransactions,
    allSupportedCrypto,
    loadingAllSupportedCrypto,
    transactionDetail,
    loadingTransactionDetails,
    showTransactionDetails,

    // ⚙️ Functions
    handleSortBy,
    handleShowTransactionDetails,
    handleTransactionUpdateField,
    handleTransactionUpdate,
    handleTransactionReceiptUpload,
    handleRetryDepositConfirmation,
    handleForceTriggerPayout,
    retryingConfirmation,
    forcingPayout,
    handlePageSizeChange: updatePageSize,
    handleExportAll,
    isFetchingTransactions,
  } = useManageTransactionsPage();

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
    toggleApplyFilter,
    handleSearchQuery,
    handleFromDate,
    handleToDate,
    handleMinAmountRange,
    handleMaxAmountRange,
    handleSelectedCryptoId,
    handleSelectedStatus,
    handleViewTransactionDetails,
    resetSearchFilter,
  } = useTransactionsTable({
    timeline: "all",
  });

  const handleRefreshTransactions = () => {
    resetSearchFilter();
  };

  const columns = useMemo(
    () =>
      TransactionsManagementColumn(
        handleSortBy,
        handleShowTransactionDetails,
        handleViewTransactionDetails,
      ),
    [
      handleSortBy,
      handleShowTransactionDetails,
      handleViewTransactionDetails,
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
        <ManageTransactionsControls
          onOpenFilter={toggleApplyFilter}
          searchValue={query}
          onSearchChange={handleSearchQuery}
          handleExportAll={handleExportAll}
          handleRefreshTransactions={handleRefreshTransactions}
          isFetchingTransactions={isFetchingTransactions}
        />

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
          handleRetryDepositConfirmation={handleRetryDepositConfirmation}
          handleForceTriggerPayout={handleForceTriggerPayout}
          retryingConfirmation={retryingConfirmation}
          forcingPayout={forcingPayout}
        />
      </div>
    </AuthenticatedLayout>
  );
};

export default ManageTransactions;
