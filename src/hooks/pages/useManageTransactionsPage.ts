import {useState} from "react";
import { useDispatch } from 'react-redux'
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

export const useManageTransactionsPage = () => {
  const dispatch = useDispatch()
  const {
    // Queries
    searchTransactions,
    loadingSearchTransactions,
    transactionDetail,
    loadingTransactionDetails,

    // Mutations
    adminUpdateTransactionMutation,
    adminUploadTransactionReceiptMutation,
  } = useTransactionQuery();
  
  const { allSupportedCrypto, loadingAllSupportedCrypto } = useCryptoQuery();
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<Array<string>>([])
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  const handleSearchTransactionFieldUpdate = (field: keyof SearchTransactionsRequestType, value: any ) => {
    dispatch(setSearchTransactionsField({
      field,
      value,
    }))
  }

  const handlePageSizeChange = (size: number) => {
    dispatch(setSearchTransactions({
      ...searchTransactionsInitialState,
      size: size,
    }))
  }
  
  const handleSelectTransactionId = (transactionId: string) => {
    let updatedSelectedIds = [...selectedTransactionIds];
    if (updatedSelectedIds.includes(transactionId)) {
      updatedSelectedIds = updatedSelectedIds.filter(id => id !== transactionId);
    } else {
      updatedSelectedIds.push(transactionId);
    }
    setSelectedTransactionIds(updatedSelectedIds);
  }

  const handleSelectAllTransactionIds = () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const transactionIds = searchTransactions && searchTransactions?.transactions?.map(tx => tx.id) || [];
    if (selectedTransactionIds.length === transactionIds.length) {
      setSelectedTransactionIds([]);
    } else {
      setSelectedTransactionIds(transactionIds);
    }
  }

  const handleSortBy = (columnKey: string) => {
    const sortModel = (store.getState() as RootState).transactionManagement.search.transactions.sortModel;
    handleSearchTransactionFieldUpdate("sortModel", {
      colId: columnKey,
      orderBy: sortModel && sortModel.colId === columnKey && sortModel.orderBy === 'ASC' ? 'DESC' : 'ASC',
    })
  }

  const handleShowTransactionDetails = (sessionId?: string) => {
    // If sessionId is present, then update the state
    if (sessionId) {
      dispatch(setTransactionDetailSessionId(sessionId));
      toggleShowTransactionDetails()
    } else {
      // If sessionId is not present, then just toggle the state and clear the redux
      dispatch(clearTransactionDetailSessionId())
      toggleShowTransactionDetails()
    }
  }

  const handleTransactionUpdateField = (field: (keyof UpdateTransactionStatusRequestType), value: any) => {
    dispatch(setTransactionDetailUpdateField({ field, value }))
  }

  const handleTransactionUpdate = async () => {
    await adminUpdateTransactionMutation.mutateAsync();
    toggleShowTransactionDetails();
    dispatch(clearTransactionDetailSessionId())
    dispatch(clearTransactionDetailUpdateField());
  }

  const handleTransactionReceiptUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const url = await adminUploadTransactionReceiptMutation.mutateAsync(formData);
    dispatch(setTransactionDetailUpdateField({
      field: "adminPaymentReceiptUrl",
      value: url,
    }))

    return url || '';
  }

  const toggleShowTransactionDetails = () => setShowTransactionDetails(!showTransactionDetails)

  return {
    // 🧩 Values
    searchTransactions,
    loadingSearchTransactions,
    allSupportedCrypto,
    loadingAllSupportedCrypto,
    selectedTransactionIds,
    transactionDetail,
    loadingTransactionDetails,
    showTransactionDetails,

    // ⚙️ Functions
    handleSelectTransactionId,
    handleSelectAllTransactionIds,
    handleSortBy,
    handleShowTransactionDetails,
    handleTransactionUpdateField,
    handleTransactionUpdate,
    handleTransactionReceiptUpload,
    handlePageSizeChange,
  }
}