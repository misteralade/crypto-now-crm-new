import { useMemo } from 'react'
import {useManageAdminPage} from "../hooks/pages/useManageAdminPage";
import {SearchAdminDataColumn, SearchAdminDataRow} from "../components/tables/AdminManagementTables";
import Table from "../components/table";
import TableFooter from "../components/tables/TableFooter";
import PageHeader from '../components/global/pageHeader';
import AdminsControls from "../components/pages/manageAdmins/AdminsControls.tsx";
import CreateAdminModal from '../components/pages/manageAdmins/CreateAdminModal.tsx';
import CreateNewPermissionsModal from '../components/pages/manageAdmins/CreateNewPermissionModals.tsx';
import ManageAdminFilterModal from "../components/pages/manageAdmins/ManageAdminFilterModal.tsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import ConfirmModal from "../components/global/ConfirmModal.tsx";
import { getLoggedInAdminId } from '../util/auth.util';

const ManageAdmins = () => {
  const {
    // 🧩 Values
    showAddNewRole,
    showAddNewAdmin,
    searchQuery,
    showFilter,
    allPermissions,
    selectedPermissions,
    allRoles,
    loadingAllRoles,
    fromDate,
    toDate,
    selectedRoleId,
    searchedAdmins,
    loadingSearchedAdmins,
    pageSize,
    showDeleteAdminModal,


    // ⚙️ Functions
    toggleAddNewRoleModal,
    toggleAddNewAdmin,
    toggleFilter,
    handleSearchChange,
    handleSelectPermission,
    handleCreateNewRole,
    handleRoleNameChange,
    handleRoleDescriptionChange,
    handleCreateAdminFieldChange,
    handleCreateAdmin,
    handleFromDateChange,
    handleToDateChange,
    handleSelectedRoleIdChange,
    handleResetFilters,
    handleUpdateAdminStatus,
    handlePageChange,
    handlePageSizeChange,
    handleDeleteAdmin,
    toggleDeleteAdminModal,
    handleConfirmDeleteAdmin,
  } = useManageAdminPage();

  const currentAdminId = useMemo(() => getLoggedInAdminId(), []);

  const columns = useMemo(
    () =>
      SearchAdminDataColumn(
        handleUpdateAdminStatus,
        handleDeleteAdmin,
        currentAdminId,
      ),
    [
      handleUpdateAdminStatus,
      handleDeleteAdmin,
      currentAdminId,
    ],
  );

  const data = useMemo(
    () => SearchAdminDataRow(!loadingSearchedAdmins ? searchedAdmins?.admins : []),
    [loadingSearchedAdmins, searchedAdmins?.admins],
  )

  return (
    <AuthenticatedLayout>
      <div className="p-6 mx-auto">
        <PageHeader title="Admin Management" />
        
        <AdminsControls
          searchValue={searchQuery || ''}
          onSearchChange={handleSearchChange}
          onOpenFilter={toggleFilter}
          onOpenCreate={toggleAddNewAdmin}
          onOpenCreateRole={toggleAddNewRoleModal}
        />
        
        <Table data={data} columns={columns} loading={loadingSearchedAdmins}/>
        
        <TableFooter
          currentPage={searchedAdmins?.page || 1}
          totalPages={searchedAdmins?.totalPages || 1}
          pageSize={pageSize}
          totalItems={searchedAdmins?.count || 100}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
        
        <CreateAdminModal
          open={showAddNewAdmin}
          roles={allRoles || []}
          onClose={toggleAddNewAdmin}
          handleCreateAdminFieldChange={handleCreateAdminFieldChange}
          onCreate={handleCreateAdmin}
        />
        
        <CreateNewPermissionsModal
          open={showAddNewRole}
          permissions={allPermissions || []}
          selectedPermissions={selectedPermissions}
          onClose={toggleAddNewRoleModal}
          onCreate={handleCreateNewRole}
          handleSelectPermission={handleSelectPermission}
          handleRoleName={handleRoleNameChange}
          handleRoleDescription={handleRoleDescriptionChange}
        />
        
        <ManageAdminFilterModal
          isOpen={showFilter}
          onClose={toggleFilter}
          onReset={handleResetFilters}
          fromDate={fromDate}
          toDate={toDate}
          handleFromDate={handleFromDateChange}
          handleToDate={handleToDateChange}
          roles={!loadingAllRoles ? allRoles : []}
          selectedRoleId={selectedRoleId}
          handleSelectedRole={handleSelectedRoleIdChange}
        />
      </div>
      
      <ConfirmModal
        open={showDeleteAdminModal}
        actionType="delete"
        onClose={toggleDeleteAdminModal}
        onConfirm={handleConfirmDeleteAdmin}
        message="Are you sure you want to delete this admin?"
        confirmText="Delete Admin"
      />
    </AuthenticatedLayout>
  )
}

export default ManageAdmins;
