import { useEffect } from 'react'
import { useDispatch } from "react-redux";
import { useParams } from "@tanstack/react-router";
import { toast } from 'react-toastify'
import {setSelectedUserDetailId} from "../../redux/user.slice";
import {useUserQuery} from "../../queries/user.query";
import {searchTransactionsInitialState} from "../../redux/states/initial-transaction-management.states";
import { setSearchTransactions } from "../../redux/transaction-management.slice";
import {useTransactionQuery} from "../../queries/transaction.query";
import {useCryptoQuery} from "../../queries/crypto.querries";
import type {SearchTransactionsResponse} from "../../types/response.payload.types";


export const useUserDetailsPage = () => {
  const dispatch = useDispatch();
  const { userProfile, loadingUserProfile } = useUserQuery();
  const { searchTransactions, loadingSearchTransactions } = useTransactionQuery();
  const { allSupportedCrypto, loadingAllSupportedCrypto } = useCryptoQuery();
  
  const { userId } = useParams({ from: '/dashboard/users/$userId' })
  
  useEffect(() => {
    if (userId) {
      dispatch(setSelectedUserDetailId(userId));
      dispatch(setSearchTransactions({
        ...searchTransactionsInitialState,
        includeCryptoCurrency: true,
        userId,
      }))
    }
  }, [userId, dispatch]);
  
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
    if (searchTransactions?.transactions && searchTransactions.transactions.length > 0) {
      const csv = toCsv(searchTransactions.transactions)
      downloadBlob(csv, `${userId || 'user'}_transactions.csv`)
    } else {
      toast.info('No transactions found.')
    }
  }

  const handleDownloadSingle = (id: string) => {
    const transaction = searchTransactions?.transactions.find(tx => tx.sessionId === id);
    if (!transaction) return
    const csv = toCsv([transaction])
    const safeId = id.replace(/[^\w-]+/g, '_')
    downloadBlob(csv, `transaction_${safeId}.csv`)
  }

  const handlePageSizeChange = (size: number) => {
    dispatch(setSearchTransactions({
      ...searchTransactionsInitialState,
      size: size,
      userId,
    }))
  }

  // Provide useful values and helpers for the page
  return {
    // 🧩 Values
    userId,
    userProfile,
    loadingUserProfile,
    searchTransactions,
    loadingSearchTransactions,
    allSupportedCrypto,
    loadingAllSupportedCrypto,

    // ⚙️ Functions
    handleDownloadSingle,
    handleExportAll,
    handlePageSizeChange,
  };
};
