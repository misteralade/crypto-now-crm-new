import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import {useUsersPage} from "../hooks/pages/useUsersPage";
import {AdminSearchUserColumn, AdminSearchUserDataRow} from "../components/tables/UserManagementTables";
import Table from "../components/table";
import TableFooter from "../components/tables/TableFooter";
import UsersFilterModal from "../components/pages/users/UsersFilterModal.tsx";
import UserTransactionDetailsDrawer from "../components/pages/users/UsersTransactionDetailsDrawer.tsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";

const Users = () => {
  const {
    // Values
    adminSearchUsers,
    loadingAdminSearchUsers,
    detailsOpen,
    filterOpen,
    createdAtFrom,
    createdAtTo,
    userProfileSummary,
    loadingUserProfileSummary,
    pageSize,

    // ⚙️ Functions
    toggleFilter,
    handleChangeCreatedAtFrom,
    handleChangeCreatedAtTo,
    handleResetFilters,
    handleStatusFilterChange,
    handleViewUserDetails,
    handleCloseDetails,
    handleUpdateUserStatus,
    handleResetUserPassword,
    handlePageSizeChange,
    handlePageChange,
  } = useUsersPage();

  const columns = useMemo(
    () =>
      AdminSearchUserColumn(
        handleViewUserDetails,
        handleUpdateUserStatus,
        handleResetUserPassword,
      ),
    [
      handleViewUserDetails,
      handleUpdateUserStatus,
      handleResetUserPassword,
    ],
  );

  const data = useMemo(
    () => AdminSearchUserDataRow(!loadingAdminSearchUsers ? adminSearchUsers?.users : []),
    [loadingAdminSearchUsers, adminSearchUsers?.users],
  )

  const [query, setQuery] = useState('')

  return (
    <AuthenticatedLayout>
      <div className="p-4 md:p-6 mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-lg font-semibold">User Management</h2>
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
        <div className="bg-white mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex w-full lg:w-auto items-center gap-2">
              <div className="relative flex-1 lg:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search User"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full md:w-[280px] pl-10 pr-4 h-10 border text-[#0E0F0C] placeholder:text-[#9A9A9A] border-[#D9D9D9] rounded-full focus:ring-2 focus:border-transparent text-sm"
                />
              </div>
              <button
                className="inline-flex cursor-pointer hover:border-[#03034D] items-center justify-center gap-2 h-10 px-4 border border-[#D9D9D9] rounded-full transition-colors"
                onClick={toggleFilter}
              >
                <img src="/icons/Filter.svg" alt="Filter" className="w-4 h-4" />
                <span className="text-sm font-semibold text-[#454745]">
                Filter
              </span>
              </button>
            </div>
            
            {/* Right: Add user */}
            <div className="flex w-full lg:w-auto items-center gap-2 lg:justify-end">
              <button
                onClick={() => alert('Add new user')}
                className="px-4 py-[10px] whitespace-nowrap bg-[#03034D] cursor-pointer text-white text-sm font-semibold rounded-full hover:opacity-80 transition-colors w-full md:w-auto"
              >
                Add new user
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="space-y-4">
            <Table data={data} columns={columns} loading={loadingAdminSearchUsers} />
            
            <TableFooter
              currentPage={adminSearchUsers?.page || 1}
              totalPages={adminSearchUsers?.totalPages || 1}
              pageSize={pageSize}
              totalItems={adminSearchUsers?.count || 100}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </div>
        
        {/* Drawers / Modals */}
        <UserTransactionDetailsDrawer
          open={detailsOpen}
          loading={loadingUserProfileSummary}
          data={userProfileSummary}
          onClose={handleCloseDetails}
        />
        
        <UsersFilterModal
          open={filterOpen}
          createdAtFrom={createdAtFrom}
          createdAtTo={createdAtTo}
          onClose={toggleFilter}
          onReset={handleResetFilters}
          handleChangeCreatedAtFrom={handleChangeCreatedAtFrom}
          handleChangeCreatedAtTo={handleChangeCreatedAtTo}
          handleStatusFilterChange={handleStatusFilterChange}
        />
      </div>
    </AuthenticatedLayout>
  )
}

export default Users;
