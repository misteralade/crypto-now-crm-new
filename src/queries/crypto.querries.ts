import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useMatchRoute} from "@tanstack/react-router";
import { toast } from 'react-toastify'
import {useSelector} from "react-redux";
import { store} from "../store";
import { ROUTES } from '../util/constants.js'
import { cryptoServiceApi } from '../api/crypto.api.js'
import { QUERY_KEYS } from './querries.keys.js'
import type {AxiosServerError} from "../types/response.payload.types";
import type {RootState} from "../store";

export const useCryptoQuery = () => {
  const queryClient = useQueryClient();
  const matchRoute = useMatchRoute();
  const search = useSelector((state: RootState) => state.coinManagement.search.supportedCrypto);

  const { data: supportedCrypto, isLoading: loadingSupportedCrypto } = useQuery({
    queryKey: [QUERY_KEYS.CRYPTO.SEARCH_SUPPORTED_CRYPTO_CURRENCIES, search],
    queryFn: async () => {
      const payload = (store.getState() as RootState).coinManagement.search.supportedCrypto;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!payload) return null;

      const { data, success } = await cryptoServiceApi.searchSupportedCryptoCurrencies(payload);

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!(matchRoute({ to: ROUTES.COIN_MANAGEMENT })) && !!search,
  });

  const { data: allSupportedCrypto, isLoading: loadingAllSupportedCrypto } = useQuery({
    queryKey: [QUERY_KEYS.CRYPTO.ALL_SUPPORTED_CRYPTO_CURRENCIES],
    queryFn: async () => {
      const { data, success } = await cryptoServiceApi.adminGetAllSupportedCryptoCurrencies();

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!(matchRoute({ to: ROUTES.TRANSACTIONS }) || matchRoute({ to: ROUTES.USERS_DETAILS })),
  });

  const { data: adminCryptoDetails, isLoading: loadingAdminCryptoDetails } = useQuery({
    queryKey: [QUERY_KEYS.CRYPTO.ADMIN_GET_SUPPORTED_CRYPTO_CURRENCY, (store.getState() as RootState).coinManagement.edit.coinId],
    queryFn: async () => {
      const cryptoId = (store.getState() as RootState).coinManagement.edit.coinId;
       
      if (!cryptoId) return null;

      const { data, success } = await cryptoServiceApi.adminGetSupportedCrypto(cryptoId);

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!(matchRoute({ to: ROUTES.EDIT_COIN })) && !!(store.getState() as RootState).coinManagement.edit.coinId,
  });

  const uploadCryptoLogoIconMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      toast.loading("Uploading coin logo...");
      const { data } = await cryptoServiceApi.uploadCoinLogo(formData);
      return data.url;
    },
    onError: async (error: Error) => {
      toast.dismiss()
      toast.error(`Failed to upload logo: ${error.message}`)
    },
    onSuccess: async ( url: string | undefined ) => {
      toast.dismiss();
      toast.success("Upload coin logo successfully.");
      return url;
    },
  })

  const createCryptoCurrencyMutation = useMutation({
    mutationFn: async () => {
      const payload = (store.getState() as RootState).coinManagement.addCoin

       
      if (!payload) throw new Error("Missing payload to create new coin.")

      toast.loading("Creating new coin...");
      const { message, success } = await cryptoServiceApi.createSupportedCryptoAndAdminWallet(payload);
      if (!success) {
        throw new Error(message);
      }
      return { message, success };
    },
    onSuccess: ({ message, success }) => {
      toast.dismiss();
      toast.success(message || "Create new coin successfully.");
      return success;
    },
    onError: (error: AxiosServerError) => {
      toast.dismiss()
      const { data } = error.response as { data: { error: { message: string } } };
      toast.error(`Failed to create new coin: ${data.error.message}`)
    },
  });

  const updateCryptoCurrencyMutation = useMutation({
    mutationFn: async () => {
      toast.loading("Updating coin...");
      const payload = (store.getState() as RootState).coinManagement.edit.payload
      const cryptoId = (store.getState() as RootState).coinManagement.edit.coinId

       
      if (!cryptoId) throw new Error("Missing crypto ID to update coin.")

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!payload) throw new Error("Missing payload to update coin.")
      const { message, success } = await cryptoServiceApi.adminUpdateSupportedCryptoAndAdminWallet(cryptoId, payload);
      if (!success) {
        throw new Error(message);
      }
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CRYPTO.SEARCH_SUPPORTED_CRYPTO_CURRENCIES]
      });
      return { message, success };
    },
    onSuccess: ({ message, success }) => {
      toast.dismiss();
      toast.success(message || "Update coin successfully.");
      
      return success;
    },
    onError: (error: AxiosServerError) => {
      const { data } = error.response as { data: { error: { message: string } } };
      toast.dismiss()
      toast.error(`Failed to update coin: ${data.error.message}`)
    },
  });
  
  const adminDeleteCryptoCurrencyMutation = useMutation({
    mutationFn: async () => {
      toast.loading("Deleting coin...");
      const cryptoId = (store.getState() as RootState).coinManagement.delete.coinId;
      
      if (!cryptoId) throw new Error("Missing crypto ID to delete.")
      
      const { message, success } = await cryptoServiceApi.adminDeleteSupportedCrypto(cryptoId);
      if (!success) {
        throw new Error(message);
      }
      return { message, success };
    },
    onSuccess: ({ message, success }) => {
      toast.dismiss();
      toast.success(message || "Delete coin successfully.");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CRYPTO.SEARCH_SUPPORTED_CRYPTO_CURRENCIES]
      });
      return success;
    },
    onError: (error: AxiosServerError) => {
      const { data } = error.response as { data: { error: { message: string } } };
      toast.dismiss()
      toast.error(`Failed to delete coin: ${data.error.message}`)
    },
  })

  return {
    // 🧩 Values
    supportedCrypto,
    loadingSupportedCrypto,
    allSupportedCrypto,
    loadingAllSupportedCrypto,
    adminCryptoDetails,
    loadingAdminCryptoDetails,
    
    // Mutations
    uploadCryptoLogoIconMutation,
    createCryptoCurrencyMutation,
    updateCryptoCurrencyMutation,
    adminDeleteCryptoCurrencyMutation,
  };
};
