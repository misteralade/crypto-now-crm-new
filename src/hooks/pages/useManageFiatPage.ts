import {useMemo, useState} from "react";
import { useDispatch } from "react-redux";
import {useBankQuery} from "../../queries/bank.querries";
import {
  clearSelectedBankId,
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
    await adminCreateBankAccountMutation.mutateAsync();
    toggleBankModal();
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
  
  // toggle functions can be added here if needed in the future
  const toggleBankModal = () => setOpenBankModal(!openBankModal);

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
    toggleBankModal,
    handleMakeDefault,
    handleDeleteBank,
    handleCreateBankField,
    handleAdminCreateBank,
    handleSearchChange,
  }
}