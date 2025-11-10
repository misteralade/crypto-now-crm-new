import {useMemo, useState} from 'react'
import { useDispatch } from 'react-redux'
import { useAuditLogQuery } from '../../queries/audit-log.querries'
import {
  setSearchAuditLog,
  setSearchAuditLogField,
} from '../../redux/audit-log.slice'
import { searchAuditLogInitialState } from '../../redux/states/audit-log.states'
import {debounce} from "../../util/debouce.util";
import {TIME_IN_MILLISECONDS} from "../../util/constants.util.ts";

export const useAuditTrailsPage = () => {
  const dispatch = useDispatch()
  const { searchAuditLog, loadingSearchAuditLog } = useAuditLogQuery()

  const [pageSize, setPageSize] = useState<number>(10)
  const [showFilter, setShowFilter] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)

  // Filter
  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'SUCCESS' | 'FAILED'>('ALL')
  const [selectedUserType, setSelectedUserType] = useState<'ALL' | 'ADMIN' | 'USER' | 'ANONYMOUS'>('ALL')
  const [selectedDeviceType, setSelectedDeviceType] = useState<'ALL' | 'WEB' | 'MOBILE'>('ALL')

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    dispatch(
      setSearchAuditLog({
        ...searchAuditLogInitialState,
        size: size,
      }),
    )
  }

  const handlePageChange = (page: number) => {
    dispatch(
      setSearchAuditLogField({
        field: 'page',
        value: page,
      }),
    )
  }

  // Controls
  const toggleApplyFilter = () => setShowFilter((p) => !p)

  const handleSearchChange = useMemo(() => {
    const debouncedUpdate = debounce(
      (query: string) => setSearchAuditLogField({
        field: "searchQuery",
        value: query,
      }),
      TIME_IN_MILLISECONDS.FIVE_HUNDRED_MILLISECONDS
    );

    return (query: string) => {
      setSearchQuery(query);
      debouncedUpdate(query);
    };
  }, [dispatch]);

  // Date range
  const handleFromDate = (date: Date) => {
    setFromDate(date)
    dispatch(setSearchAuditLogField({ field: 'createdAtFrom', value: date }))
  }
  const handleToDate = (date: Date) => {
    setToDate(date)
    dispatch(setSearchAuditLogField({ field: 'createdAtTo', value: date }))
  }

  // Selectors
  const handleSelectedSuccess = (value: 'ALL' | 'SUCCESS' | 'FAILED') => {
    setSelectedStatus(value);
    const mapped = value === 'ALL' ? undefined : value === 'SUCCESS'
    dispatch(setSearchAuditLogField({ field: 'success', value: mapped }))
  }

  const handleSelectedUserType = (value: 'ALL' | 'ADMIN' | 'USER' | "ANONYMOUS") => {
    setSelectedUserType(value);
    dispatch(
      setSearchAuditLogField({
        field: 'userType',
        value: value === 'ALL' ? undefined : value,
      }),
    )
  }

  const handleSelectedDeviceType = (value: 'ALL' | 'WEB' | 'MOBILE') => {
    setSelectedDeviceType(value);
    dispatch(
      setSearchAuditLogField({
        field: 'deviceType',
        value: value === 'ALL' ? undefined : value,
      }),
    )
  }

  const resetSearchFilter = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setSelectedDeviceType('ALL')
    setSelectedUserType('ALL')
    setSelectedStatus('ALL')
    dispatch(
      setSearchAuditLog({
        ...searchAuditLogInitialState,
      }),
    )
  }

  return {
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
  }
}
