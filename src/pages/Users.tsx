import { useMemo } from "react";
import { SearchInput } from "../components/ui/search-input";
import { useUsersPage } from "../hooks/pages/useUsersPage";
import {
  AdminSearchUserColumn,
  AdminSearchUserDataRow,
} from "../components/tables/UserManagementTables";
import Table from "../components/table";
import TableFooter from "../components/tables/TableFooter";
import UsersFilterModal from "../components/pages/users/UsersFilterModal.tsx";
import UserTransactionDetailsDrawer from "../components/pages/users/UsersTransactionDetailsDrawer.tsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import PageHeader from "../components/global/pageHeader";

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
    searchQuery,

    // ⚙️ Functions
    toggleFilter,
    handleChangeCreatedAtFrom,
    handleChangeCreatedAtTo,
    handleResetFilters,
    handleStatusFilterChange,
    handleCloseDetails,
    handleUpdateUserStatus,
    handleResetUserPassword,
    handlePageSizeChange,
    handlePageChange,
    handleSearchChange,
    handleNavigateToUserDetails,
    handleNavigateToTransactionHistory,
  } = useUsersPage();

  const columns = useMemo(
    () =>
      AdminSearchUserColumn(
        handleNavigateToTransactionHistory,
        handleUpdateUserStatus,
        handleResetUserPassword
      ),
    [
      handleNavigateToTransactionHistory,
      handleUpdateUserStatus,
      handleResetUserPassword,
    ]
  );

  const data = useMemo(
    () =>
      AdminSearchUserDataRow(
        !loadingAdminSearchUsers ? adminSearchUsers?.users : []
      ),
    [loadingAdminSearchUsers, adminSearchUsers?.users]
  );

  return (
    <AuthenticatedLayout>
      <PageHeader
        title="User Management"
        subtitle="Search, view, and manage all platform users"
      />

      <div className="p-6 mx-auto">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 mt-4 mb-2">
          <SearchInput
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            containerClassName="flex-1 sm:max-w-[280px]"
          />
          <button
            className="inline-flex cursor-pointer hover:border-[#948EEE] hover:bg-[#F5F5FF] items-center justify-center gap-2 h-10 px-4 border border-[#ECECEC] rounded-full transition-colors bg-white shadow-sm"
            onClick={toggleFilter}
          >
            <img
              src="/icons/Filter.svg"
              alt="Filter"
              className="w-4 h-4 opacity-70"
            />
            <span className="text-[14px] font-medium text-[#454745]">
              Filter
            </span>
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="bg-white rounded-2xl border border-[#ECECEC] overflow-hidden">
            <Table
              data={data}
              columns={columns}
              loading={loadingAdminSearchUsers}
              onRowClick={(row) => handleNavigateToUserDetails(row.id)}
            />
          </div>

          <TableFooter
            currentPage={adminSearchUsers?.page || 1}
            totalPages={adminSearchUsers?.totalPages || 1}
            pageSize={pageSize}
            totalItems={adminSearchUsers?.count || 100}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
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
  );
};

export default Users;
