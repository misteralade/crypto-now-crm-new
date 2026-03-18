import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMatchRoute } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { ROUTES } from '../util/constants.util';
import { kycServiceApi } from "../api/kyc.api";
import { store } from "../store";
import { QUERY_KEYS } from './querries.keys';
import type { RootState } from "../store";
import type { AxiosServerError } from "../types/response.payload.types";

export const useKycQuery = () => {
  const queryClient = useQueryClient();
  const matchRoute = useMatchRoute();

  const { data: kycTierLimits, isLoading: loadingKycTierLimits } = useQuery({
    queryKey: [QUERY_KEYS.KYC.GET_ALL_KYC_TIER_LIMITS],
    queryFn: async () => {
      const { data, success } = await kycServiceApi.getAllKycTierLimits();

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!(matchRoute({ to: ROUTES.KYC_TIER_LIMITS })),
  });

  const createKycTierLimitMutation = useMutation({
    mutationKey: [QUERY_KEYS.KYC.CREATE_KYC_TIER_LIMIT],
    mutationFn: async () => {
      toast.loading('Creating KYC tier limit...', { toastId: QUERY_KEYS.KYC.CREATE_KYC_TIER_LIMIT });
      const payload = (store.getState() as RootState).kycTierLimit.create;

      const { message, success } = await kycServiceApi.createKycTierLimit(payload);
      return { message, success };
    },
    onSuccess: ({ message }) => {
      toast.dismiss();
      toast.success(message || 'Successfully created KYC tier limit');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.KYC.GET_ALL_KYC_TIER_LIMITS] });
    },
    onError: (error: AxiosServerError) => {
      toast.dismiss();
      const { data } = error.response as { data: { error: { message: string } } };
      toast.error(`Failed to create KYC tier limit: ${data.error.message}`);
    },
  });

  const updateKycTierLimitMutation = useMutation({
    mutationKey: [QUERY_KEYS.KYC.UPDATE_KYC_TIER_LIMIT],
    mutationFn: async () => {
      toast.loading('Updating KYC tier limit...', { toastId: QUERY_KEYS.KYC.UPDATE_KYC_TIER_LIMIT });
      const { id, data: payload } = (store.getState() as RootState).kycTierLimit.update;

      if (!id) {
        throw new Error('KYC tier limit ID is required to update.');
      }

      const { message, success } = await kycServiceApi.updateKycTierLimit(id, payload);
      return { message, success };
    },
    onSuccess: ({ message }) => {
      toast.dismiss();
      toast.success(message || 'Successfully updated KYC tier limit');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.KYC.GET_ALL_KYC_TIER_LIMITS] });
    },
    onError: (error: AxiosServerError) => {
      toast.dismiss();
      const { data } = error.response as { data: { error: { message: string } } };
      toast.error(`Failed to update KYC tier limit: ${data.error.message}`);
    },
  });

  const deleteKycTierLimitMutation = useMutation({
    mutationKey: [QUERY_KEYS.KYC.DELETE_KYC_TIER_LIMIT],
    mutationFn: async () => {
      toast.loading('Deleting KYC tier limit...', { toastId: QUERY_KEYS.KYC.DELETE_KYC_TIER_LIMIT });
      const tierLimitId = (store.getState() as RootState).kycTierLimit.delete.id;

      if (!tierLimitId) {
        throw new Error('KYC tier limit ID is required to delete.');
      }

      const { message, success } = await kycServiceApi.deleteKycTierLimit(tierLimitId);
      return { message, success };
    },
    onSuccess: ({ message }) => {
      toast.dismiss();
      toast.success(message || 'Successfully deleted KYC tier limit');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.KYC.GET_ALL_KYC_TIER_LIMITS] });
    },
    onError: (error: AxiosServerError) => {
      toast.dismiss();
      const { data } = error.response as { data: { error: { message: string } } };
      toast.error(`Failed to delete KYC tier limit: ${data.error.message}`);
    },
  });

  return {
    // 🧩 Values
    kycTierLimits,
    loadingKycTierLimits,

    // ⚙️ Functions
    createKycTierLimitMutation,
    updateKycTierLimitMutation,
    deleteKycTierLimitMutation,
  };
};
