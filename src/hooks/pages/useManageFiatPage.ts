import {useMemo, useState} from "react";
import { useDispatch } from "react-redux";
import {useBankQuery} from "../../queries/bank.querries";
import {
  clearSelectedBankId,
  clearCreateBankField,
  setCreateBankField, setSearchFiatField,
  setSelectedBankId,
} from '../../redux/fiat.slice'
import type {CreateBankAccountRequestType} from "../../schemas/bank.schema";
import {debounce} from "../../util/debouce.util.ts";
import {TIME_IN_MILLISECONDS} from "../../util/constants.util.ts";

export const useManageFiatPage = () => {
  const dispatch = useDispatch();
  const {
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
  } = useBankQuery();
  
  const [searchQuery, setSearchQuery] = useState('')
  
  const [openBankModal, setOpenBankModal] = useState(false)

  const handleMakeDefault = async (id: string) => {
    dispatch(setSelectedBankId(id));
    await makeAdminBankAccountDefaultMutation.mutateAsync();
    dispatch(clearSelectedBankId());
  }

  const handleDeleteBank = async (id: string) => {
    dispatch(setSelectedBankId(id));
    await adminDeleteBankAccountMutation.mutateAsync();
    dispatch(clearSelectedBankId());
  }

  const handleAdminCreateBank = async () => {
    try {
      await adminCreateBankAccountMutation.mutateAsync();
      // Only close modal on successful creation (handleCloseBankModal already clears the form)
      handleCloseBankModal();
    } catch (error) {
      // Error is already handled in the mutation's onError callback
      // Don't close modal on error so user can fix and retry
    }
  }
  
  const handleCreateBankField = (field: keyof CreateBankAccountRequestType, value: any) => {
    dispatch(setCreateBankField({
      field,
      value
    }))
  }
  
  const handleSearchChange = useMemo(() => {
    const debouncedUpdate = debounce(
      (query: string) => {
        dispatch(setSearchFiatField({
          field: "searchQuery",
          value: query
        }))
      },
      TIME_IN_MILLISECONDS.FIVE_HUNDRED_MILLISECONDS
    );
    
    return (query: string) => {
      setSearchQuery(query);
      debouncedUpdate(query);
    };
  }, [dispatch]);
  
  const handleOpenBankModal = () => {
    dispatch(clearCreateBankField());
    setOpenBankModal(true);
  };

  const handleCloseBankModal = () => {
    setOpenBankModal(false);
    dispatch(clearCreateBankField());
  };

  return {
    // 🧩 Values
    platformBankAccounts,
    loadingPlatformBankAccounts,
    openBankModal,
    platformSupportedBanks,
    loadingPlatformSupportedBanks,
    searchQuery,
    searchedSupportedBanks,
    loadingSearchedSupportedBanks,

    // ⚙️ Functions
    handleOpenBankModal,
    handleCloseBankModal,
    handleMakeDefault,
    handleDeleteBank,
    handleCreateBankField,
    handleAdminCreateBank,
    handleSearchChange,
  }
}