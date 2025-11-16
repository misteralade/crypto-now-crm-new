import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useMatchRoute} from "@tanstack/react-router";
import {toast} from "react-toastify";
import {ROUTES} from "../util/constants.util.ts";
import { rateServiceApi } from "../api/rate.api";
import { store} from "../store";
import {QUERY_KEYS} from "./querries.keys";
import type {RootState} from "../store";

export const useRateQuery = () => {
  const queryClient = useQueryClient();
  const matchRoute = useMatchRoute();

  const { data: platformExchangeRates, isLoading: loadingPlatformExchangeRates } = useQuery({
    queryKey: [QUERY_KEYS.RATE.PLATFORM_EXCHANGE_RATES],
    queryFn: async () => {
      const { data, success } = await rateServiceApi.getAllPlatformRates()
      
      if (success) {
        return data;
      }
      
      return null;
    },
    enabled: !!matchRoute({ to: ROUTES.MANAGE_FIAT }),
  });

  const updateExchangeRateMutation = useMutation({
    mutationKey: [QUERY_KEYS.RATE.UPDATE_PLATFORM_EXCHANGE_RATE],
    mutationFn: async () => {
      toast.loading("Updating rate...");
      const payload = (store.getState() as RootState).fiat.rate.editRate;
      const id = (store.getState() as RootState).fiat.rate.selectedRateId;

      if (!id || (!payload.buyRate && !payload.sellRate)) {
        throw new Error("Invalid payload to update exchange rate");
      }

      const { message, success } = await rateServiceApi.updatePlatformExchangeRate(id, payload);
      if (!success) {
        throw new Error(message);
      }
      return { message, success };
    },
    onSuccess: ({ message, success }) => {
      toast.dismiss();
      toast.success(message || "Create new coin successfully.");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RATE.PLATFORM_EXCHANGE_RATES]
      });
      return success;
    },
    onError: (error: Error) => {
      toast.dismiss()
      toast.error(`Failed to create new coin: ${error.message}`)
    },
  })

  return {
    // 🧩 Values
    platformExchangeRates,
    loadingPlatformExchangeRates,

    // Mutations
    updateExchangeRateMutation,
  };
};