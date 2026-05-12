import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {clearSearchTransactions, setSearchTransactionsField} from "../../redux/transaction-management.slice.ts";
import type {TransactionStatus} from "../../schemas/enum.schema.ts";
import type { SearchTransactionsRequestType } from "../../schemas/transaction.schema.ts";
import momentClient from "../../util/moment.ts";
import {useNavigate} from "@tanstack/react-router";
import {ROUTES} from "../../util/constants.util.ts";
import type { TimelineFilter } from "../../types/global.types";

type TransactionsTableOptions = {
  timeline?: TimelineFilter;
}

const getTimelineDateRange = (timeline: TimelineFilter) => {
  if (timeline === "all") {
    return {
      fromDate: undefined,
      toDate: undefined,
    };
  }

  const now = new Date()

  if (timeline === "week") {
    const fromDate = new Date(now)
    fromDate.setDate(now.getDate() - now.getDay())
    fromDate.setHours(0, 0, 0, 0)

    const toDate = new Date(fromDate)
    toDate.setDate(fromDate.getDate() + 6)
    toDate.setHours(23, 59, 59, 999)

    return { fromDate, toDate };
  }

  if (timeline === "month") {
    const fromDate = new Date(now.getFullYear(), now.getMonth(), 1)
    fromDate.setHours(0, 0, 0, 0)

    const toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    toDate.setHours(23, 59, 59, 999)

    return { fromDate, toDate };
  }

  const fromDate = new Date(now.getFullYear(), 0, 1)
  fromDate.setHours(0, 0, 0, 0)

  const toDate = new Date(now.getFullYear(), 11, 31)
  toDate.setHours(23, 59, 59, 999)

  return { fromDate, toDate };
}

export const useTransactionsTable = (options?: TransactionsTableOptions) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const selectedTimeline = options?.timeline ?? 'all'
  
  const [query, setQuery] = useState('')
  const [pageSize, setPageSize] = useState<number>(10);
  const [showFilter, setShowFilter] = useState(false)
  const [showApplyActionPanel, setShowApplyActionPanel] = useState(false)
  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()
  const [minAmountRange, setMinAmountRange] = useState<number>()
  const [maxAmountRange, setMaxAmountRange] = useState<number>()
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>()
  const [selectedStatus, setSelectedStatus] = useState<TransactionStatus | "ALL">("ALL")
  const [selectedPriority, setSelectedPriority] = useState<string | "ALL">("ALL")

  const toggleApplyAction = () => setShowApplyActionPanel(!showApplyActionPanel)

  const toggleApplyFilter = () => setShowFilter(!showFilter)

  const handleSearchTransactionFieldUpdate = (field: keyof SearchTransactionsRequestType, value: unknown ) => {
    dispatch(setSearchTransactionsField({
      field,
      value,
    }))
  }
  
  const handleSearchQuery = (value: string) => {
    setQuery(value)
    dispatch(setSearchTransactionsField({
      field: "searchQuery",
      value,
    }))
  }
  
  const handleViewTransactionDetails = (sessionId: string) => {
    navigate({ to: `${ROUTES.TRANSACTIONS}/${sessionId}` })
  }

  const handlePageChange = (page: number) => {
    dispatch(setSearchTransactionsField({
      field: 'page',
      value: page,
    }));
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  }

  const resetSearchFilter = () => {
    setQuery("");
    setMinAmountRange(undefined)
    setMaxAmountRange(undefined)
    setSelectedCryptoId(undefined)
    setSelectedStatus("ALL")
    setSelectedPriority("ALL")
    dispatch(clearSearchTransactions())
    // Explicitly ensure userId is cleared
    dispatch(setSearchTransactionsField({
      field: 'userId',
      value: undefined,
    }))

    const { fromDate, toDate } = getTimelineDateRange(selectedTimeline)
    setFromDate(fromDate)
    setToDate(toDate)
    handleSearchTransactionFieldUpdate(
      "createdAtFrom",
      fromDate
        ? momentClient.toISOStringFromDateWithDayBoundary(fromDate, true)
        : undefined,
    )
    handleSearchTransactionFieldUpdate(
      "createdAtTo",
      toDate
        ? momentClient.toISOStringFromDateWithDayBoundary(toDate, false)
        : undefined,
    )
  }

  const handleFromDate = (date: Date) => {
    setFromDate(date)
    handleSearchTransactionFieldUpdate("createdAtFrom", momentClient.toISOStringFromDateWithDayBoundary(date, true))
  }

  const handleToDate = (date: Date) => {
    setToDate(date)
    handleSearchTransactionFieldUpdate("createdAtTo", momentClient.toISOStringFromDateWithDayBoundary(date, false))
  }

  const handleMinAmountRange = (amount: number) => {
    setMinAmountRange(amount)
    handleSearchTransactionFieldUpdate("minUsdAmount", amount)
  }

  const handleMaxAmountRange = (amount: number) => {
    setMaxAmountRange(amount)
    handleSearchTransactionFieldUpdate("maxUsdAmount", amount)
  }

  const handleSelectedCryptoId = (cryptoId: string) => {
    setSelectedCryptoId(cryptoId)
    handleSearchTransactionFieldUpdate("cryptoCurrencyId", cryptoId)
  }

  const handleSelectedStatus = (status: TransactionStatus | "ALL") => {
    setSelectedStatus(status)
    handleSearchTransactionFieldUpdate("status", status === "ALL" ? undefined : status)
    setSelectedPriority("ALL")
    handleSearchTransactionFieldUpdate("priority", undefined)
  }

  const handleSelectedPriority = (priority: string | "ALL") => {
    setSelectedPriority(priority)
    handleSearchTransactionFieldUpdate("priority", priority === "ALL" ? undefined : priority)
    setSelectedStatus("ALL")
    handleSearchTransactionFieldUpdate("status", undefined)
  }

  useEffect(() => {
    const { fromDate, toDate } = getTimelineDateRange(selectedTimeline)
    setFromDate(fromDate)
    setToDate(toDate)
    dispatch(setSearchTransactionsField({
      field: 'createdAtFrom',
      value: fromDate
        ? momentClient.toISOStringFromDateWithDayBoundary(fromDate, true)
        : undefined,
    }))
    dispatch(setSearchTransactionsField({
      field: 'createdAtTo',
      value: toDate
        ? momentClient.toISOStringFromDateWithDayBoundary(toDate, false)
        : undefined,
    }))
    dispatch(setSearchTransactionsField({
      field: 'page',
      value: 1,
    }))
  }, [dispatch, selectedTimeline])
  
  return {
    // 🧩 Values
    query,
    pageSize,
    showFilter,
    showApplyActionPanel,
    fromDate,
    toDate,
    minAmountRange,
    maxAmountRange,
    selectedCryptoId,
    selectedStatus,
    selectedPriority,

    // ⚙️ Functions
    toggleApplyAction,
    toggleApplyFilter,
    handleSearchQuery,
    handlePageChange,
    handlePageSizeChange,
    resetSearchFilter,
    handleFromDate,
    handleToDate,
    handleMinAmountRange,
    handleMaxAmountRange,
    handleSelectedCryptoId,
    handleSelectedStatus,
    handleSelectedPriority,
    handleViewTransactionDetails,
  }
}
