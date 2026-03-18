import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMatchRoute } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { ROUTES } from '../util/constants.util';
import { currencyServiceApi } from "../api/currency.api";
import { QUERY_KEYS } from './querries.keys';
import type { AxiosServerError } from "../types/response.payload.types";
import type { CreateCurrencyRequestType, UpdateCurrencyRequestType } from '../schemas/currency.schema';

export const useCurrencyQuery = () => {
  const queryClient = useQueryClient();
  const matchRoute = useMatchRoute();

  const { data: currencies, isLoading: loadingCurrencies } = useQuery({
    queryKey: [QUERY_KEYS.CURRENCY.GET_ALL_CURRENCIES],
    queryFn: async () => {
      const { data, success } = await currencyServiceApi.getAllCurrencies();

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!(matchRoute({ to: ROUTES.SUPPORTED_CURRENCIES })),
  });

  const createCurrencyMutation = useMutation({
    mutationKey: [QUERY_KEYS.CURRENCY.CREATE_CURRENCY],
    mutationFn: async (payload: CreateCurrencyRequestType) => {
      toast.loading('Creating currency...', { toastId: QUERY_KEYS.CURRENCY.CREATE_CURRENCY });
      const { message, success } = await currencyServiceApi.createCurrency(payload);
      return { message, success };
    },
    onSuccess: ({ message }) => {
      toast.dismiss();
      toast.success(message || 'Successfully created currency');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CURRENCY.GET_ALL_CURRENCIES] });
    },
    onError: (error: AxiosServerError) => {
      toast.dismiss();
      const { data } = error.response as { data: { error: { message: string } } };
      toast.error(`Failed to create currency: ${data.error.message}`);
    },
  });

  const updateCurrencyMutation = useMutation({
    mutationKey: [QUERY_KEYS.CURRENCY.UPDATE_CURRENCY],
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateCurrencyRequestType }) => {
      toast.loading('Updating currency...', { toastId: QUERY_KEYS.CURRENCY.UPDATE_CURRENCY });
      const { message, success } = await currencyServiceApi.updateCurrency(id, payload);
      return { message, success };
    },
    onSuccess: ({ message }) => {
      toast.dismiss();
      toast.success(message || 'Successfully updated currency');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CURRENCY.GET_ALL_CURRENCIES] });
    },
    onError: (error: AxiosServerError) => {
      toast.dismiss();
      const { data } = error.response as { data: { error: { message: string } } };
      toast.error(`Failed to update currency: ${data.error.message}`);
    },
  });

  const deleteCurrencyMutation = useMutation({
    mutationKey: [QUERY_KEYS.CURRENCY.DELETE_CURRENCY],
    mutationFn: async (currencyId: string) => {
      toast.loading('Deleting currency...', { toastId: QUERY_KEYS.CURRENCY.DELETE_CURRENCY });
      const { message, success } = await currencyServiceApi.deleteCurrency(currencyId);
      return { message, success };
    },
    onSuccess: ({ message }) => {
      toast.dismiss();
      toast.success(message || 'Successfully deleted currency');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CURRENCY.GET_ALL_CURRENCIES] });
    },
    onError: (error: AxiosServerError) => {
      toast.dismiss();
      const { data } = error.response as { data: { error: { message: string } } };
      toast.error(`Failed to delete currency: ${data.error.message}`);
    },
  });

  return {
    // 🧩 Values
    currencies,
    loadingCurrencies,

    // ⚙️ Functions
    createCurrencyMutation,
    updateCurrencyMutation,
    deleteCurrencyMutation,
  };
};
