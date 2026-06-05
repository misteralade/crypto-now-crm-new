import {useState, useEffect} from "react";
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import {useTransactionQuery} from "../../queries/transaction.query";
import {
  clearTransactionDetailSessionId,
  clearTransactionDetailUpdateField,
  setSearchTransactions,
  setSearchTransactionsField,
  setTransactionDetailSessionId,
  setTransactionDetailUpdateField
} from '../../redux/transaction-management.slice'
import {useCryptoQuery} from "../../queries/crypto.querries";
import { store} from "../../store";
import {searchTransactionsInitialState} from "../../redux/states/initial-transaction-management.states";
import type {
  SearchTransactionsRequestType,
  UpdateTransactionStatusRequestType
} from "../../schemas/transaction.schema";
import type {RootState} from "../../store";
import type { TimelineFilter } from "../../types/global.types";
import type {AxiosServerError, SearchTransactionsResponse} from "../../types/response.payload.types";

export const useManageTransactionsPage = () => {
  const dispatch = useDispatch()
  const [selectedStatsTimeline, setSelectedStatsTimeline] =
    useState<TimelineFilter>('all')
  
  // Ensure userId is always undefined for manage transactions page
  useEffect(() => {
    dispatch(setSearchTransactionsField({
      field: 'userId',
      value: undefined,
    }))
  }, [dispatch])
  const {
    // Queries
    searchTransactions,
    loadingSearchTransactions,
    fetchingSearchTransactions,
    refetchSearchTransactions,
    transactionDetail,
    loadingTransactionDetails,
    refetchTransactionDetail,
    adminTransactionStats,
    loadingAdminTransactionStats,

    // Mutations
    adminUpdateTransactionMutation,
    adminUploadTransactionReceiptMutation,
    adminLockTransactionMutation,
    adminRetryPendingPayoutsMutation,
  } = useTransactionQuery({
    adminStatsTimeline: selectedStatsTimeline,
  });
  
  const { allSupportedCrypto, loadingAllSupportedCrypto } = useCryptoQuery();
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  const handleSearchTransactionFieldUpdate = (
    field: keyof SearchTransactionsRequestType,
    value: SearchTransactionsRequestType[keyof SearchTransactionsRequestType],
  ) => {
    dispatch(setSearchTransactionsField({
      field,
      value,
    }))
  }

  const handlePageSizeChange = (size: number) => {
    dispatch(setSearchTransactions({
      ...searchTransactionsInitialState,
      size: size,
      userId: undefined, // Explicitly ensure userId is not set
    }))
  }
  
  const handleSortBy = (columnKey: string) => {
    const sortModel = (store.getState() as RootState).transactionManagement.search.transactions.sortModel;
    handleSearchTransactionFieldUpdate("sortModel", {
      colId: columnKey,
      orderBy: sortModel && sortModel.colId === columnKey && sortModel.orderBy === 'ASC' ? 'DESC' : 'ASC',
    })
  }

  const handleShowTransactionDetails = async (sessionId?: string) => {
    if (!sessionId) {
      dispatch(clearTransactionDetailSessionId())
      setShowTransactionDetails(false)
      return
    }

    // Open drawer immediately — lock in the background, close only on failure
    dispatch(setTransactionDetailSessionId(sessionId))
    setShowTransactionDetails(true)

    try {
      await adminLockTransactionMutation.mutateAsync(sessionId)
    } catch (error) {
      const axiosError = error as AxiosServerError
      const errorMessage = axiosError.response?.data?.error?.message || 'Failed to lock transaction'
      toast.error(errorMessage)
      setShowTransactionDetails(false)
      dispatch(clearTransactionDetailSessionId())
    }
  }

  const handleTransactionUpdateField = (
    field: keyof UpdateTransactionStatusRequestType,
    value: UpdateTransactionStatusRequestType[keyof UpdateTransactionStatusRequestType],
  ) => {
    dispatch(setTransactionDetailUpdateField({ field, value }))
  }

  const handleTransactionUpdate = async () => {
    await adminUpdateTransactionMutation.mutateAsync();
    setShowTransactionDetails(false);
    dispatch(clearTransactionDetailSessionId())
    dispatch(clearTransactionDetailUpdateField());
  }

  const handleManualPayoutRetry = async (sessionId?: string) => {
    if (!sessionId) {
      toast.error("Transaction session ID is required to retry payout");
      return;
    }

    const res = await adminRetryPendingPayoutsMutation.mutateAsync({
      sessionId,
      forceProceed: true,
    });

    if (res?.success) {
      // Refresh both the drawer detail and the main table
      await Promise.all([
        refetchTransactionDetail(),
        refetchSearchTransactions(),
      ]);
    }
  }

  const handleTransactionReceiptUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const result = await adminUploadTransactionReceiptMutation.mutateAsync(formData);
    
    // Store url in Redux for saving (this is what gets sent to the backend)
    dispatch(setTransactionDetailUpdateField({
      field: "adminPaymentReceiptUrl",
      value: result?.url || '',
    }))

    // Return signedUrl for preview
    return result?.signedUrl || '';
  }

  const handleSelectedStatsTimelineChange = (timeline: TimelineFilter) => {
    setSelectedStatsTimeline(timeline)
  }

  const toCsv = (rows: Array<SearchTransactionsResponse>) => {
    const headers = [
      "Transaction ID",
      "Date",
      "Type",
      "Amount Fiat",
      "Amount Crypto",
      "Status",
      "Email",
      "Priority",
      "Currency",
    ];
    const lines = rows.map((row) =>
      [
        row.id,
        row.createdAt,
        row.type,
        row.amountFiat,
        row.amountCrypto,
        row.status,
        row.email ?? "",
        row.priority,
        row.currency,
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(","),
    );
    return [headers.join(","), ...lines].join("\n");
  };

  const downloadBlob = (content: BlobPart, fileName: string, mimeType = "text/csv") => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const handleExportAll = () => {
    const transactions = searchTransactions?.transactions ?? [];
    if (transactions.length === 0) {
      toast.info("No transactions found.");
      return;
    }

    const csv = toCsv(transactions);
    downloadBlob(csv, "transactions.csv");
  };

  return {
    // 🧩 Values
    searchTransactions,
    loadingSearchTransactions,
    allSupportedCrypto,
    loadingAllSupportedCrypto,
    transactionDetail,
    loadingTransactionDetails,
    showTransactionDetails,
    adminTransactionStats,
    loadingAdminTransactionStats,
    selectedStatsTimeline,

    // ⚙️ Functions
    handleSortBy,
    handleShowTransactionDetails,
    handleTransactionUpdateField,
    handleTransactionUpdate,
    handleTransactionReceiptUpload,
    handleManualPayoutRetry,
    retryingPayout: adminRetryPendingPayoutsMutation.isPending,
    handlePageSizeChange,
    handleSelectedStatsTimelineChange,
    handleExportAll,
    handleRefreshTransactions: refetchSearchTransactions,
    isFetchingTransactions: fetchingSearchTransactions,
  }
}
