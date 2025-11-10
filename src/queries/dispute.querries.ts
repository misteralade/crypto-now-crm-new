import {useSelector} from "react-redux";
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useMatchRoute} from "@tanstack/react-router";
import {toast} from "react-toastify";
import { ROUTES } from '../util/constants.util.ts'
import { QUERY_KEYS } from './querries.keys.js'
import {type RootState, store} from "../store";
import {disputeServiceApi} from "../api/dispute.api.ts";
import type {AxiosServerError, MessageAttachment} from '../types/response.payload.types.ts';

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
      const disputeId = (store.getState() as RootState).dispute.details.id;
      if (!disputeId) return null;
      
      const { data, success } = await disputeServiceApi.getDisputeDetails(disputeId);
      
      if (success) {
        return data;
      }
      
      return null;
    },
    enabled: !!matchRoute({ to: ROUTES.DISPUTE_DETAILS }) && !!(store.getState() as RootState).dispute.details.id,
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
  })
  
  return {
    // 🧩 Values
    searchDispute,
    loadingSearchDispute,
    disputeMessages,
    loadingDisputeMessages,
    disputeDetails,
    loadingDisputeDetails,
    
    // Mutations
    adminSendDisputeMutation
  };
};
