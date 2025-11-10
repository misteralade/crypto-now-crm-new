import { useMemo, useState } from 'react'
import {useDispatch} from "react-redux";
import {useNavigate} from "@tanstack/react-router";
import {useNotificationQuery} from "../../queries/notification.querries";
import {
  clearSearchNotification,
  setSearchNotification,
  setSearchNotificationField
} from "../../redux/notification.slice";
import {searchNotificationInitialState} from "../../redux/states/notification.states";
import momentClient from "../../util/moment";
import {debounce} from "../../util/debouce.util";
import {ROUTES, TIME_IN_MILLISECONDS} from '../../util/constants.util.ts'
import type {SearchNotificationRequestType} from "../../schemas/notification.schema";

export const useNotificationsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    // 🧩 Values
    searchNotification,
    loadingSearchNotification

    // ⚙️ Functions
  } = useNotificationQuery();

  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [showFilterModal, setShowFilterModal] = useState(false)

  const handleViewTransactionDetails = (transactionId: string) => {
    navigate({ to: `${ROUTES.TRANSACTIONS}/${transactionId}` })
  }

  const handleSearchNotificationFieldUpdate = (field: keyof SearchNotificationRequestType, value: any ) => {
    dispatch(setSearchNotificationField({
      field,
      value,
    }))
  }

  const handleFromDate = (date: Date) => {
    setFromDate(date)
    handleSearchNotificationFieldUpdate("createdAtFrom", momentClient.toISOStringFromDateWithDayBoundary(date, true))
  }

  const handleToDate = (date: Date) => {
    setToDate(date)
    handleSearchNotificationFieldUpdate("createdAtTo", momentClient.toISOStringFromDateWithDayBoundary(date, false))
  }

  const handlePageChange = (page: number) => {
    handleSearchNotificationFieldUpdate("page", page)
  }

  const handlePageSizeChange = (size: number) => {
    dispatch(setSearchNotification({
      ...searchNotificationInitialState,
      size: size,
    }))
    setPageSize(size);
  }

  const resetSearchFilter = () => {
    setSearchQuery(undefined);
    setFromDate(undefined)
    setToDate(undefined)
    dispatch(clearSearchNotification())
  }

  const handleSearchChange = useMemo(() => {
    const debouncedUpdate = debounce(
      (query: string) => handleSearchNotificationFieldUpdate("searchQuery", query),
      TIME_IN_MILLISECONDS.FIVE_HUNDRED_MILLISECONDS
    );

    return (query: string) => {
      setSearchQuery(query);
      debouncedUpdate(query);
    };
  }, [dispatch]);

  const toggleShowFilterModal = () => setShowFilterModal(!showFilterModal)

  return {
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
  }
}