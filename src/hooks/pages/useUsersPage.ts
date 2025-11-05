import {useMemo, useState} from "react";
import {useDispatch} from "react-redux";
import {useUserQuery} from "../../queries/user.query";
import {
  clearSearchUsers,
  clearSelectedUserDetailId,
  clearSelectedUserStatus, setSearchUsers,
  setSearchUsersField,
  setSelectedUserDetailId,
  setSelectedUserStatus,
} from '../../redux/user.slice'
import momentClient from "../../util/moment";
import {adminSearchUsersInitialState} from "../../redux/states/initial-users-management.states";
import type {AdminSearchUserRequestType} from "../../schemas/user.schema";
import type {UserStatusVariant} from "../../types/global.types";
import {debounce} from "../../util/debouce.util.ts";
import {TIME_IN_MILLISECONDS} from "../../util/constants.ts";

export const useUsersPage = () => {
  const dispatch = useDispatch();
  const {
    adminSearchUsers,
    loadingAdminSearchUsers,
    userProfileSummary,
    loadingUserProfileSummary,

    // Mutations
    patchUserStatusMutation,
    adminResetPasswordMutation,
  } = useUserQuery();

  const [pageSize, setPageSize] = useState(10);
  const [createdAtFrom, setCreatedAtFrom] = useState<Date>();
  const [createdAtTo, setCreatedAtTo] = useState<Date>();
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)

  const toggleFilter = () => setFilterOpen(!filterOpen)

  const toggleDetails = () => setDetailsOpen(!detailsOpen)

  const handleUpdateSearchUserField = (field: keyof AdminSearchUserRequestType, value: any) => {
    dispatch(setSearchUsersField({
      field,
      value,
    }))
  }

  const handleChangeCreatedAtFrom = (date: Date) => {
    setCreatedAtFrom(date)
    handleUpdateSearchUserField("createdAtFrom", momentClient.toISOStringFromDateWithDayBoundary(date, true))
  }

  const handleChangeCreatedAtTo = (date: Date) => {
    setCreatedAtTo(date)
    handleUpdateSearchUserField("createdAtTo", momentClient.toISOStringFromDateWithDayBoundary(date, true))
  }

  const handleStatusFilterChange = (status: string) => {
    const updatedStatus = status.toUpperCase() === 'all' ? undefined : status.toUpperCase();
    handleUpdateSearchUserField("status", updatedStatus);
  }

  const handleResetFilters = () => {
    setCreatedAtFrom(undefined);
    setCreatedAtTo(undefined);
    dispatch(clearSearchUsers());
  }
  
  const handleSearchChange = useMemo(() => {
    const debouncedUpdate = debounce(
      (query: string) => handleUpdateSearchUserField("searchQuery", query),
      TIME_IN_MILLISECONDS.FIVE_HUNDRED_MILLISECONDS
    );
    
    return (query: string) => {
      setSearchQuery(query);
      debouncedUpdate(query);
    };
  }, [dispatch]);

  const handleViewUserDetails = (userId: string) => {
    // Route to user details page
    dispatch(setSelectedUserDetailId(userId))
    toggleDetails()
  }

  const handleCloseDetails = () => {
    dispatch(clearSelectedUserDetailId())
    toggleDetails();
  }

  const handleUpdateUserStatus = async (userId: string, status: UserStatusVariant) => {
    dispatch(setSelectedUserStatus(status))
    dispatch(setSelectedUserDetailId(userId))

    const response = await patchUserStatusMutation.mutateAsync();

    if (response && response.success) {
      dispatch(clearSelectedUserStatus())
      dispatch(clearSelectedUserDetailId())
    }
  }

  const handleResetUserPassword = async (userId: string) => {
    dispatch(setSelectedUserDetailId(userId))
    const response = await adminResetPasswordMutation.mutateAsync()

    if (response && response.success) {
      dispatch(clearSelectedUserDetailId())
    }
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    dispatch(setSearchUsers({
      ...adminSearchUsersInitialState,
      size: size,
    }))
  }

  const handlePageChange = (page: number) => {
    dispatch(setSearchUsersField({
      field: 'page',
      value: page,
    }));
  }

  return {
    // 🧩 Values
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
    handleUpdateSearchUserField,
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
    handleSearchChange,
  }
}