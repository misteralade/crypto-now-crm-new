import {useMemo, useState} from "react";
import { useDispatch } from "react-redux";
import {toast} from "react-toastify";
import { useAdminQuery } from "../../queries/admin.querries";
import {
  clearCreateAdminField,
  clearCreateRoleField,
  clearSearchAdminField, clearUpdateAdminField,
  setCreateAdminField,
  setCreateRoleField,
  setSearchAdminField, setUpdateAdminField,
} from '../../redux/admin.slice'
import {debounce} from "../../util/debouce.util";
import {TIME_IN_MILLISECONDS} from "../../util/constants";
import momentClient from "../../util/moment";
import type {CreateNewAdminRequestType, SearchAdminRequestType} from "../../schemas/admin.schema";

export const useManageAdminPage = () => {
  const dispatch = useDispatch();
  const {
    // 🧩 Values
    allPermissions,
    loadingAllPermissions,
    allRoles,
    loadingAllRoles,
    searchedAdmins,
    loadingSearchedAdmins,

    // Mutations
    createRoleMutation,
    createAdminMutation,
    updateAdminActiveStatusMutation,
  } = useAdminQuery();

  // Filters
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [selectedRoleId, setSelectedRoleId] = useState<string>('')
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [showAddNewRole, setShowAddNewRole] = useState(false);
  const [showAddNewAdmin, setShowAddNewAdmin] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // Create Role
  const [selectedPermissions, setSelectedPermissions] = useState<Array<string>>([])
  const [roleName, setRoleName] = useState<string | undefined>(undefined)
  const [roleDescription, setRoleDescription] = useState<string | undefined>(undefined)

  // Filter
  const handleSearchAdminFieldUpdate = (field: keyof SearchAdminRequestType, value: any) => {
    dispatch(setSearchAdminField({
      field,
      value,
    }))
  }

  const handleSearchChange = useMemo(() => {
    const debouncedUpdate = debounce(
      (query: string) => handleSearchAdminFieldUpdate("searchQuery", query),
      TIME_IN_MILLISECONDS.FIVE_HUNDRED_MILLISECONDS
    );

    return (query: string) => {
      setSearchQuery(query);
      debouncedUpdate(query);
    };
  }, [dispatch]);

  const handleFromDateChange = (date: Date | undefined) => {
    setFromDate(date);
    handleSearchAdminFieldUpdate("createdAtFrom", date ? momentClient.toISOStringFromDate(date) : undefined);
  }

  const handleToDateChange = (date: Date | undefined) => {
    setToDate(date);
    handleSearchAdminFieldUpdate("createdAtTo", date ? momentClient.toISOStringFromDate(date) : undefined);
  }

  const handleSelectedRoleIdChange = (selectedRoleId: string) => {
    setSelectedRoleId(selectedRoleId);
    handleSearchAdminFieldUpdate("roleId", selectedRoleId);
  }

  const handleResetFilters = () => {
    setSearchQuery(undefined);
    setFromDate(undefined);
    setToDate(undefined);
    setSelectedRoleId('');
    dispatch(clearSearchAdminField());
    toggleFilter();
  }

  const handlePageChange = (page: number) => {
    handleSearchAdminFieldUpdate("page", page);
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    handleSearchAdminFieldUpdate("size", size);
  }

  // Create Admin
  const handleCreateAdminFieldChange = (field:(keyof CreateNewAdminRequestType), value: any) => {
    dispatch(setCreateAdminField({
      field,
      value,
    }))
  }

  const handleCreateAdmin = async () => {
    const { success } = await createAdminMutation.mutateAsync()
    if (success) {
      dispatch(clearCreateAdminField())
      toggleAddNewAdmin()
    }
  }

  const handleUpdateAdminStatus = async (id: string, active: boolean) => {
    console.log(`Update admin ${id} status to ${active}`);
    dispatch(setUpdateAdminField({
      field: 'id',
      value: id,
    }));
    dispatch(setUpdateAdminField({
      field: 'active',
      value: active,
    }));

    const { success } = await updateAdminActiveStatusMutation.mutateAsync();

    if (success) {
      dispatch(clearUpdateAdminField());
    }
  }

  // Permission
  const handleSelectPermission = (id: string) => {
    if (selectedPermissions.includes(id)) {
      setSelectedPermissions(selectedPermissions.filter(permissionId => permissionId !== id));
      dispatch(setCreateRoleField({
        field: "permissionIds",
        value: selectedPermissions.filter(permissionId => permissionId !== id),
      }))
    } else {
      setSelectedPermissions([...selectedPermissions, id]);
      dispatch(setCreateRoleField({
        field: "permissionIds",
        value: [...selectedPermissions, id],
      }))
    }
  }

  const handleRoleNameChange = (value: string) => {
    dispatch(setCreateRoleField({
      field: "name",
      value,
    }))
    setRoleName(value)
  }

  const handleRoleDescriptionChange = (value: string) => {
    dispatch(setCreateRoleField({
      field: "description",
      value,
    }));
    setRoleDescription(value)
  }

  const handleCreateNewRole = async () => {
    // Check the length of the characters of role name and description
    const roleLength = roleName ? roleName.length : 0;
    const descriptionLength = roleDescription ? roleDescription.length : 0;

    if (roleLength < 5 || roleLength > 100) {
      toast.error(`Role name must be between 5 and 100 characters!`);
      return;
    }

    if (descriptionLength > 0 && descriptionLength > 255) {
      toast.error(`Description must be less than 255 characters!`);
      return;
    }

    if (selectedPermissions.length === 0) {
      toast.error(`Please select at least one permission for the role.`);
      return;
    }

    const { success } = await createRoleMutation.mutateAsync()
    if (success) {
      toggleAddNewRoleModal()
      dispatch(clearCreateRoleField())
    }
  }

  // Toggle Modals
  const toggleAddNewRoleModal = () => setShowAddNewRole(!showAddNewRole);

  const toggleAddNewAdmin = () => setShowAddNewAdmin(!showAddNewAdmin);

  const toggleFilter = () => setShowFilter(!showFilter);

  return {
    // 🧩 Values
    showAddNewRole,
    showAddNewAdmin,
    searchQuery,
    showFilter,
    allPermissions,
    loadingAllPermissions,
    selectedPermissions,
    roleName,
    roleDescription,
    allRoles,
    loadingAllRoles,
    fromDate,
    toDate,
    selectedRoleId,
    searchedAdmins,
    loadingSearchedAdmins,
    pageSize,


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
  }
}