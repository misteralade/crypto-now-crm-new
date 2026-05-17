import { useEffect } from 'react'
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "@tanstack/react-router";
import { toast } from 'react-toastify'
import {setSelectedUserDetailId} from "../../redux/user.slice";
import {searchUserTransactionHistoryInitialState} from "../../redux/states/initial-transaction-management.states";
import { setSearchUserTransactionHistory } from "../../redux/transaction-management.slice";
import {useTransactionQuery} from "../../queries/transaction.query";
import {useCryptoQuery} from "../../queries/crypto.querries";
import {ROUTES} from "../../util/constants.util.ts";
import type {SearchTransactionsResponse} from "../../types/response.payload.types";


export const useUserTransactionHistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchUserTransactions, loadingSearchUserTransactions, fetchingSearchUserTransactions, refetchSearchUserTransactions } = useTransactionQuery();
  const { allSupportedCrypto, loadingAllSupportedCrypto } = useCryptoQuery();
  
  const { userId } = useParams({ from: '/dashboard/users/transaction-history/$userId' })
  
  useEffect(() => {
    if (userId) {
      dispatch(setSelectedUserDetailId(userId));
      dispatch(setSearchUserTransactionHistory({
        ...searchUserTransactionHistoryInitialState,
        includeCryptoCurrency: true,
        userId,
      }))
    }
  }, [userId, dispatch]);

  const goBack = () => {
    if (userId) {
      navigate({ to: `${ROUTES.USERS_DETAILS.replace('$userId', userId)}` })
    }
  }
  
  const toCsv = (rows: Array<SearchTransactionsResponse>) => {
    const headers = [
      'Transaction ID',
      'Date',
      'Type',
      'Amount',
      'Rate',
      'Status',
    ]
    const lines = rows.map((itx) =>
      [itx.id, itx.createdAt, itx.type, itx.usdAmount, itx.stableToFiatRate, itx.status]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(','),
    )
    return [headers.join(','), ...lines].join('\n')
  }

  const downloadBlob = (
    content: BlobPart,
    fileName: string,
    mimeType = 'text/csv',
  ) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()

    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100)
  }

  const handleExportAll = () => {
    if (searchUserTransactions?.transactions && searchUserTransactions.transactions.length > 0) {
      const csv = toCsv(searchUserTransactions.transactions)
      downloadBlob(csv, `${userId || 'user'}_transactions.csv`)
    } else {
      toast.info('No transactions found.')
    }
  }

  const handleDownloadSingle = (id: string) => {
    const transaction = searchUserTransactions?.transactions.find(tx => tx.sessionId === id);
    if (!transaction) return
    const csv = toCsv([transaction])
    const safeId = id.replace(/[^\w-]+/g, '_')
    downloadBlob(csv, `transaction_${safeId}.csv`)
  }

  const handlePageSizeChange = (size: number) => {
    dispatch(setSearchUserTransactionHistory({
      ...searchUserTransactionHistoryInitialState,
      size: size,
      userId,
      includeCryptoCurrency: true,
    }))
  }

  // Provide useful values and helpers for the page
  return {
    // 🧩 Values
    userId,
    searchTransactions: searchUserTransactions,
    loadingSearchTransactions: loadingSearchUserTransactions,
    allSupportedCrypto,
    loadingAllSupportedCrypto,

    // ⚙️ Functions
    handleDownloadSingle,
    handleExportAll,
    handlePageSizeChange,
    handleRefreshTransactions: refetchSearchUserTransactions,
    isFetchingTransactions: fetchingSearchUserTransactions,
    goBack,
  };
};
