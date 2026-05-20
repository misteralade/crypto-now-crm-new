import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {useNavigate, useParams} from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {clearTransactionDetailSessionId, setTransactionDetailSessionId } from "../../redux/transaction-management.slice";
import {useTransactionQuery} from "../../queries/transaction.query.ts";
import {ROUTES} from "../../util/constants.util.ts";
import { transactionServiceApi } from "../../api/transaction.api";

export const useTransactionDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    transactionInfo,
    loadingTransactionInfo,
    refetchTransactionInfo,
    adminRetryPendingPayoutsMutation,
  } = useTransactionQuery();
  
  const { id } = useParams({ from: '/dashboard/transaction/$id' })
  
  useEffect(() => {
    if (id) {
      dispatch(setTransactionDetailSessionId(id))
    }
  }, [id, dispatch]);

  const exportLedgerMutation = useMutation({
    mutationFn: async () => {
      if (!id) {
        throw new Error("Transaction session ID is missing");
      }

      return await transactionServiceApi.adminDownloadTransactionLedgerCsv(id);
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `transaction-${id}-ledger.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Ledger CSV exported successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to export ledger CSV");
        return;
      }

      toast.error("Failed to export ledger CSV");
    },
  });

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
      await refetchTransactionInfo();
    }
  };
  
  const goBack = () => {
    dispatch(clearTransactionDetailSessionId());
    if (window.history.length > 1) {
      window.history.back()
      return
    }
    navigate({ to: ROUTES.TRANSACTIONS })
  }
  
  return {
    // 🧩 Values
    transactionInfo,
    loadingTransactionInfo,
    ledgerEntries: transactionInfo?.ledgerEntries || [],
    exportingLedgerCsv: exportLedgerMutation.isPending,
    retryingPayout: adminRetryPendingPayoutsMutation.isPending,
    
    
    // ⚙️ Functions
    goBack,
    handleExportLedgerCsv: () => exportLedgerMutation.mutate(),
    handleManualPayoutRetry,
  }
}
