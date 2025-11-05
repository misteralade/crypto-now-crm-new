import { useMemo } from 'react'
import { useNotificationsPage } from "../hooks/pages/useNotificationsPage";
import { NotificationsDataColumn, NotificationsDataRow } from "../components/tables/NotificationsTables";
import Table from "../components/table";
import TableFooter from "../components/tables/TableFooter";
import NotificationControls from "../components/pages/notifications/NotificationControls.tsx";
import NotificationFilterModal from "../components/pages/notifications/NotificationFilterModal.tsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import AvatarIcon from '../assets/img/avatar.webp'

const NotificationsPage = () => {
  const {
    // 🧩 Values
    searchNotification,
    loadingSearchNotification,
    pageSize,
    fromDate,
    toDate,
    searchQuery,
    showFilterModal,

    // ⚙️ Functions
    handleViewTransactionDetails,
    handlePageChange,
    handlePageSizeChange,
    handleFromDate,
    handleToDate,
    resetSearchFilter,
    toggleShowFilterModal,
    handleSearchChange,
  } = useNotificationsPage();

  const columns = useMemo(() => NotificationsDataColumn(handleViewTransactionDetails), [ handleViewTransactionDetails ],)

  const data = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    () => NotificationsDataRow(!loadingSearchNotification ? searchNotification?.notifications : []) || [],
    [searchNotification?.notifications, loadingSearchNotification],
  )

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <div className="flex items-center space-x-3">
            <span className="text-red-500 font-medium">Admin</span>
            <div className="rounded-full h-8 w-8 overflow-hidden">
              <img
                src={AvatarIcon}
                alt="Admin avatar"
                className="h-8 w-8 object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <NotificationControls
          onOpenFilter={toggleShowFilterModal}
          searchValue={searchQuery || ""}
          onSearchChange={handleSearchChange}
        />
        
        <Table
          data={data}
          columns={columns}
          loading={loadingSearchNotification}
        />
        
        <TableFooter
          currentPage={searchNotification?.page || 1}
          totalPages={searchNotification?.totalPages || 1}
          pageSize={pageSize}
          totalItems={searchNotification?.count || 100}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
        
        <NotificationFilterModal
          isOpen={showFilterModal}
          onClose={toggleShowFilterModal}
          onReset={resetSearchFilter}
          fromDate={fromDate}
          toDate={toDate}
          handleFromDate={handleFromDate}
          handleToDate={handleToDate}
        />
      </div>
    </AuthenticatedLayout>
  )
}

export default NotificationsPage;
