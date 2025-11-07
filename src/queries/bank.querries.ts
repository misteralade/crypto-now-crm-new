import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import { useMatchRoute } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { ROUTES } from '../util/constants.js'
import { bankServiceApi } from "../api/bank.api";
import { store} from "../store";
import { QUERY_KEYS } from './querries.keys.js'
import type {RootState} from "../store";
import {useSelector} from "react-redux";

export const useBankQuery = () => {
  const queryClient = useQueryClient();
  const matchRoute = useMatchRoute();
  
  const searchBank = useSelector((state: RootState) => state.fiat.bank.search);

  const { data: platformBankAccounts, isLoading: loadingPlatformBankAccounts } = useQuery({
    queryKey: [QUERY_KEYS.BANK.PLATFORM_BANK_ACCOUNTS],
    queryFn: async () => {
      const { data, success } = await bankServiceApi.getPlatformBankAccounts();

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!(matchRoute({ to: ROUTES.MANAGE_FIAT })),
  });

  const { data: platformSupportedBanks, isLoading: loadingPlatformSupportedBanks } = useQuery({
    queryKey: [QUERY_KEYS.BANK.PLATFORM_SUPPORTED_BANKS],
    queryFn: async () => {
      const { data, success } = await bankServiceApi.getAllBanks();

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!(matchRoute({ to: ROUTES.MANAGE_FIAT })),
  });
  
  const { data: searchedSupportedBanks, isLoading: loadingSearchedSupportedBanks } = useQuery({
    queryKey: [QUERY_KEYS.BANK.SEARCHED_SUPPORTED_BANKS, searchBank],
    queryFn: async () => {
      const { data, success } = await bankServiceApi.adminSearchSupportedBanks(searchBank);

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!(matchRoute({ to: ROUTES.MANAGE_FIAT })) && !!searchBank,
  })

  const makeAdminBankAccountDefaultMutation = useMutation({
    mutationKey: [QUERY_KEYS.BANK.MAKE_ADMIN_BANK_ACCOUNT_DEFAULT],
    mutationFn: async () => {
      const selectedBankId = (store.getState() as RootState).fiat.bank.selectedBankId;
      if (!selectedBankId) throw new Error("Selected bank ID is undefined.");
      
      toast.loading("Making bank account default...");
      const { success, message } = await bankServiceApi.makeAdminBankAccountDefault(selectedBankId);
      return { success, message };
    },
    onSuccess: ({ message, success }) => {
      toast.dismiss();
      toast.success(message || "Create new coin successfully.");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.BANK.PLATFORM_BANK_ACCOUNTS]
      });
      return success;
    },
    onError: (error: Error) => {
      toast.dismiss()
      toast.error(`Failed to create new coin: ${error.message}`)
    },
  });
  
  const adminDeleteBankAccountMutation = useMutation({
    mutationKey: [QUERY_KEYS.BANK.ADMIN_DELETE_BANK_ACCOUNT],
    mutationFn: async () => {
      const selectedBankId = (store.getState() as RootState).fiat.bank.selectedBankId;
      if (!selectedBankId) throw new Error("Selected bank ID is undefined.");
      
      toast.loading("Deleting bank account...");
      const { success, message } = await bankServiceApi.adminDeleteBankAccount(selectedBankId);
      return { success, message };
    },
    onSuccess: ({ message, success }) => {
      toast.dismiss();
      toast.success(message || "Bank account deleted successfully.");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.BANK.PLATFORM_BANK_ACCOUNTS]
      });
      return success;
    },
    onError: (error: Error) => {
      toast.dismiss()
      toast.error(`Failed to delete bank account: ${error.message}`)
    },
  });
  
  const adminCreateBankAccountMutation = useMutation({
    mutationKey: [QUERY_KEYS.BANK.ADMIN_CREATE_BANK_ACCOUNT],
    mutationFn: async () => {
      const payload = (store.getState() as RootState).fiat.bank.createBank;
      
      if (!payload.bankId || !payload.accountNumber || !payload.accountHolderName) throw new Error("Incomplete bank account data.");
      
      toast.loading("Creating bank account...");
      const { success, message } = await bankServiceApi.adminCreateBankAccount(payload);
      return { success, message };
    },
    onSuccess: ({ message, success }) => {
      toast.dismiss();
      toast.success(message || "Bank account created successfully.");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.BANK.PLATFORM_BANK_ACCOUNTS, QUERY_KEYS.BANK.SEARCHED_SUPPORTED_BANKS]
      });
      return success;
    },
    onError: (error: Error) => {
      toast.dismiss()
      toast.error(`Failed to create bank account: ${error.message}`)
    },
  });

  return {
    // 🧩 Values
    platformBankAccounts,
    loadingPlatformBankAccounts,
    platformSupportedBanks,
    loadingPlatformSupportedBanks,
    searchedSupportedBanks,
    loadingSearchedSupportedBanks,
    
    // Mutations
    makeAdminBankAccountDefaultMutation,
    adminDeleteBankAccountMutation,
    adminCreateBankAccountMutation,
  };
};
