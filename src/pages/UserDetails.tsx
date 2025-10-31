import { Fragment, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import { useUserDetailsPage } from "../hooks/pages/useUserDetailsPage";
import { LoadingSpinner } from "../components/global/LoadingSpinner";
import { UserTransactionsManagementColumn, UserTransactionsManagementDataRow } from "../components/tables/TransactionsManagementTables";
import Table from "../components/table";
import TableFooter from "../components/tables/TableFooter";
import { useTransactionsTable } from "../hooks/tables/useTransactionsTable";
import ManageTransactionFilterModal from "../components/pages/manageTransactions/ManageTransactionFilterModal.tsx";
import ManageTransactionsControls from "../components/pages/manageTransactions/ManageTransactionsControls.tsx";
import PageHeader from "../components/global/pageHeader.tsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";

const UserDetails = () => {
  const {
    // 🧩 Values
    userProfile,
    loadingUserProfile,
    searchTransactions,
    loadingSearchTransactions,
    allSupportedCrypto,
    loadingAllSupportedCrypto,
    handlePageSizeChange: updatePageSize,

    // ⚙️ Functions
    handleDownloadSingle,
    handleExportAll,
  } = useUserDetailsPage();
  
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

  const columns = useMemo(() => UserTransactionsManagementColumn(handleDownloadSingle),
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
      <div className="p-6 mx-auto">
        <PageHeader title="User Management" />
        
        {loadingUserProfile ? (
          <div className="flex items-center justify-center min-h-[80vh]">
            <LoadingSpinner size="lg" message="Loading user details..." />
          </div>
        ) : (
          <Fragment>
            <div className="text-lg text-[#858585] font-medium mb-4 mt-10">
              All Users / {userProfile?.profile?.firstName}{' '}
              {userProfile?.profile?.lastName}
            </div>
            <aside className="flex justify-between items-center mb-6">
              <div className="text-xl md:text-2xl font-semibold text-[#454745]">
                Transaction History for {userProfile?.profile?.firstName}
              </div>
              
              {/* Right: export button */}
              <div className="flex w-full lg:w-auto items-center gap-2 lg:justify-end">
                <button
                  onClick={handleExportAll}
                  className="px-4 py-[10px] rounded-full bg-[#03034D] text-white text-sm hover:opacity-90 w-full md:w-auto flex items-center justify-between gap-x-2 hover:cursor-pointer"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.2333 1.85075C10.1161 1.73371 9.95729 1.66797 9.79167 1.66797C9.62604 1.66797 9.46719 1.73371 9.35 1.85075L5.18333 6.01742C5.07293 6.1359 5.01283 6.2926 5.01569 6.45452C5.01854 6.61644 5.08414 6.77093 5.19865 6.88544C5.31316 6.99995 5.46765 7.06554 5.62956 7.0684C5.79148 7.07126 5.94819 7.01115 6.06667 6.90075L9.16667 3.80075V15.2091C9.16667 15.3748 9.23251 15.5338 9.34973 15.651C9.46694 15.7682 9.62591 15.8341 9.79167 15.8341C9.95743 15.8341 10.1164 15.7682 10.2336 15.651C10.3508 15.5338 10.4167 15.3748 10.4167 15.2091V3.80075L13.5167 6.90075C13.5739 6.96216 13.6429 7.01141 13.7196 7.04557C13.7962 7.07973 13.879 7.0981 13.9629 7.09958C14.0468 7.10106 14.1302 7.08562 14.208 7.05419C14.2858 7.02275 14.3565 6.97597 14.4159 6.91662C14.4752 6.85727 14.522 6.78657 14.5534 6.70875C14.5849 6.63093 14.6003 6.54757 14.5988 6.46365C14.5973 6.37973 14.579 6.29697 14.5448 6.2203C14.5107 6.14364 14.4614 6.07464 14.4 6.01742L10.2333 1.85075ZM4.375 17.0841C4.20924 17.0841 4.05027 17.1499 3.93306 17.2671C3.81585 17.3844 3.75 17.5433 3.75 17.7091C3.75 17.8748 3.81585 18.0338 3.93306 18.151C4.05027 18.2682 4.20924 18.3341 4.375 18.3341H15.2083C15.3741 18.3341 15.5331 18.2682 15.6503 18.151C15.7675 18.0338 15.8333 17.8748 15.8333 17.7091C15.8333 17.5433 15.7675 17.3844 15.6503 17.2671C15.5331 17.1499 15.3741 17.0841 15.2083 17.0841H4.375Z"
                      fill="white"
                    />
                  </svg>
                  Export
                  <ChevronDown className="border-l border-gray-600" />
                </button>
              </div>
            </aside>
            
            <ManageTransactionsControls
              onOpenFilter={toggleApplyFilter}
              onApplyAction={toggleApplyAction}
              searchValue={query}
              onSearchChange={handleSearchQuery}
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
          </Fragment>
        )}
      </div>
    </AuthenticatedLayout>
  )
}

export default UserDetails;
