import { useMemo } from 'react'
import { useAuditTrailsPage } from '../hooks/pages/useAuditTrailsPage'
import TableFooter from '../components/tables/TableFooter'
import Table from "../components/table";
import { SearchAuditLogDataColumn, SearchAuditLogDataRow } from '../components/tables/AuditLogsTable';
import AuditTrailsFilterModal from '../components/pages/auditTrails/AuditTrailsFilterModal';
import AuditTrailsControls from "../components/pages/auditTrails/AuditTrailsControls.tsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";

const AuditTrails = () => {
  const {
    // 🧩 Values
    searchAuditLog,
    loadingSearchAuditLog,
    pageSize,
    showFilter,
    searchQuery,
    fromDate,
    toDate,
    selectedDeviceType,
    selectedStatus,
    selectedUserType,

    // ⚙️ Functions
    handlePageSizeChange,
    handlePageChange,
    toggleApplyFilter,
    resetSearchFilter,
    handleFromDate,
    handleToDate,
    handleSelectedSuccess,
    handleSelectedUserType,
    handleSelectedDeviceType,
    handleSearchChange,
  } = useAuditTrailsPage()

  const columns = useMemo(() => SearchAuditLogDataColumn, [])
  
  const data = useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    SearchAuditLogDataRow(searchAuditLog?.logs ? searchAuditLog.logs : []) ||
      [],
    [searchAuditLog?.logs, loadingSearchAuditLog],
  )

  return (
    <AuthenticatedLayout>
      <div className="p-6 mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Audit trails</h2>
          <div className="flex items-center space-x-3">
            <span className="text-red-500 font-medium">Admin</span>
            <div className="rounded-full h-8 w-8 overflow-hidden">
              <img
                src="/images/avatar.png"
                alt="Admin avatar"
                className="h-8 w-8 object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <AuditTrailsControls
          onOpenFilter={toggleApplyFilter}
          searchValue={searchQuery || ''}
          onSearchChange={handleSearchChange}
        />
        
        <Table data={data} columns={columns} loading={loadingSearchAuditLog} />
        
        <TableFooter
          currentPage={searchAuditLog?.page || 1}
          totalPages={searchAuditLog?.totalPages || 1}
          pageSize={pageSize}
          totalItems={searchAuditLog?.count || 100}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
        
        <AuditTrailsFilterModal
          isOpen={showFilter}
          fromDate={fromDate}
          toDate={toDate}
          selectedStatus={selectedStatus}
          selectedDeviceType={selectedDeviceType}
          selectedUserType={selectedUserType}
          onClose={toggleApplyFilter}
          onReset={resetSearchFilter}
          handleFromDate={handleFromDate}
          handleToDate={handleToDate}
          handleSelectedSuccess={handleSelectedSuccess}
          handleSelectedUserType={handleSelectedUserType}
          handleSelectedDeviceType={handleSelectedDeviceType}
        />
      </div>
    </AuthenticatedLayout>
  )
}

export default AuditTrails;
