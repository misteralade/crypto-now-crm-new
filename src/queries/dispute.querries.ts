import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMatchRoute } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { ROUTES } from '../util/constants.util.ts'
import { QUERY_KEYS } from './querries.keys.js'
import { type RootState, store } from "../store";
import { disputeServiceApi } from "../api/dispute.api.ts";
import type { AxiosServerError, MessageAttachment } from '../types/response.payload.types.ts';
import { transactionServiceApi } from "../api/transaction.api.ts";
import type { SearchTransactionsRequestType } from "../schemas/transaction.schema.ts";
import { searchTransactionsInitialState } from "../redux/states/initial-transaction-management.states.ts";

export const useDisputeQuery = () => {
  const matchRoute = useMatchRoute();
  const queryClient = useQueryClient();
  const search = useSelector((state: RootState) => state.dispute.manage.search);
  
  const { data: searchDispute, isLoading: loadingSearchDispute } = useQuery({
    queryKey: [QUERY_KEYS.DISPUTE.ADMIN_SEARCH_DISPUTES, search],
    queryFn: async () => {
      const { data, success } = await disputeServiceApi.adminSearchDisputes(search);
      
      if (success) {
        return data;
      }
      
      return null;
    },
    enabled: !!(matchRoute({ to: ROUTES.DISPUTES })) && !!search,
  });
  
  const { data: disputeMessages, isLoading: loadingDisputeMessages } = useQuery({
    queryKey: [QUERY_KEYS.DISPUTE.DISPUTE_MESSAGES],
    queryFn: async () => {
      const disputeId = (store.getState() as RootState).dispute.details.id;
      if (!disputeId) return null;
      
      const { data, success } = await disputeServiceApi.getDisputeMessages(disputeId);
      
      if (success) {
        return data;
      }
      
      return null;
    },
    enabled: !!matchRoute({ to: ROUTES.DISPUTE_DETAILS }) && !!(store.getState() as RootState).dispute.details.id,
  });
  
  const { data: disputeDetails, isLoading: loadingDisputeDetails } = useQuery({
    queryKey: [QUERY_KEYS.DISPUTE.DISPUTE_DETAILS, store.getState().dispute.details.id],
    queryFn: async () => {
      const disputeId = (store.getState() as RootState).dispute.details.id ;
      if (!disputeId) return null;
      
      const { data, success } = await disputeServiceApi.getDisputeDetails(disputeId);
      
      if (success) {
        return data;
      }
      
      return null;
    },
    enabled: !!(matchRoute({ to: ROUTES.DISPUTE_DETAILS })) && !!((store.getState() as RootState).dispute.details.id),
  });
  
  const { data: editDisputeDetails, isLoading: loadingEditDisputeDetails } = useQuery({
    queryKey: [QUERY_KEYS.DISPUTE.DISPUTE_DETAILS, (store.getState() as RootState).dispute.edit.id],
    queryFn: async () => {
      const disputeId = (store.getState() as RootState).dispute.edit.id;
      if (!disputeId) return null;
      
      const { data, success } = await disputeServiceApi.getDisputeDetails(disputeId);
      
      if (success) {
        return data;
      }
      
      return null;
    },
    enabled: !!matchRoute({ to: ROUTES.EDIT_DISPUTE }) && !!(store.getState() as RootState).dispute.edit.id,
  });
  
  const { data: transactionDetails, isLoading: loadingTransactionDetails } = useQuery({
    queryKey: [QUERY_KEYS.DISPUTE.SEARCH_TRANSACTIONS_DISPUTE_DETAILS],
    queryFn: async () => {
      const payload: SearchTransactionsRequestType = {
        ...searchTransactionsInitialState,
        sessionId: (store.getState() as RootState).dispute.edit.transactionId || undefined,
        includeUser: true,
        includeUserBankAccount: true,
        includeUserCryptoWallet: true,
        includeCryptoCurrency: true,
        includeProcessedBy: true,
      }
      
      const { data, success } = await transactionServiceApi.searchTransactions(payload);
      
      if (success) {
        return data.transactions[0];
      }
      
      return null;
    },
    enabled: !!matchRoute({ to: ROUTES.EDIT_DISPUTE }),
  });
  
  const adminSendDisputeMutation = useMutation({
    mutationKey: [QUERY_KEYS.DISPUTE.ADMIN_SEND_DISPUTE_MESSAGE],
    mutationFn: async () => {
      const message = (store.getState() as RootState).dispute.details.message.text;
      const attachments = (store.getState() as RootState).dispute.details.message.attachments;
      const disputeId = (store.getState() as RootState).dispute.details.id;
      
      if (!disputeId || !message) {
        throw new Error("Dispute ID and message are required to send a dispute message.");
      }
      
      toast.loading(`Sending message...`, { toastId: QUERY_KEYS.DISPUTE.ADMIN_SEND_DISPUTE_MESSAGE });
      return await disputeServiceApi.sendDisputeMessage(disputeId, message, attachments as Array<MessageAttachment>);
    },
    onSuccess: ({ message }) => {
      toast.dismiss(QUERY_KEYS.DISPUTE.ADMIN_SEND_DISPUTE_MESSAGE);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DISPUTE.DISPUTE_MESSAGES]
      });
      toast.success(message);
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss(QUERY_KEYS.DISPUTE.ADMIN_SEND_DISPUTE_MESSAGE);
      const { response } = error;
      const message = response ? response.data.error.message : 'Failed to send dispute message. Please try again.'
      toast.error(message);
    },
  });
  
  const updateDisputeStatusMutation = useMutation({
    mutationKey: [QUERY_KEYS.DISPUTE.UPDATE_DISPUTE_STATUS],
    mutationFn: async () => {
      toast.loading(`Update dispute status...`);
      const disputeId = (store.getState() as RootState).dispute.edit.id
      const status = (store.getState() as RootState).dispute.edit.statusModal.status;
      const note = (store.getState() as RootState).dispute.edit.statusModal.note;
      const resolution = (store.getState() as RootState).dispute.edit.statusModal.resolution;
      
      if (!status || !disputeId) {
        throw new Error("Dispute status missing");
      }
      
      return await disputeServiceApi.updateDisputeStatus(disputeId as string, status, note, resolution);
    },
    onSuccess: ({ success, message}) => {
      toast.dismiss();
      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    },
    onError: ( error: AxiosServerError ) => {
      toast.dismiss();
      const { response } = error;
      const message = response ? response.data.error.message : 'Failed to update dispute status'
      toast.error(message);
    },
  })
  
  return {
    // 🧩 Values
    searchDispute,
    loadingSearchDispute,
    disputeMessages,
    loadingDisputeMessages,
    disputeDetails,
    loadingDisputeDetails,
    editDisputeDetails,
    loadingEditDisputeDetails,
    transactionDetails,
    loadingTransactionDetails,
    
    // Mutations
    adminSendDisputeMutation,
    updateDisputeStatusMutation,
  };
};
