import {useState} from "react";
import { useDispatch } from "react-redux";
import {useBankQuery} from "../../queries/bank.querries";
import {
  clearSelectedBankId,
  setCreateBankField,
  setSelectedBankId,
} from '../../redux/fiat.slice'
import type {CreateBankAccountRequestType} from "../../schemas/bank.schema";

export const useManageFiatPage = () => {
  const dispatch = useDispatch();
  const {
    // 🧩 Values
    platformBankAccounts,
    loadingPlatformBankAccounts,
    platformSupportedBanks,
    loadingPlatformSupportedBanks,

    // Mutations
    makeAdminBankAccountDefaultMutation,
    adminDeleteBankAccountMutation,
    adminCreateBankAccountMutation,
  } = useBankQuery();

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

  const handleAdminCreateBank = () => {
    adminCreateBankAccountMutation.mutate();
    toggleBankModal();
  }
  
  const handleCreateBankField = (field: keyof CreateBankAccountRequestType, value: any) => {
    dispatch(setCreateBankField({
      field,
      value
    }))
  }

  // toggle functions can be added here if needed in the future
  const toggleBankModal = () => setOpenBankModal(!openBankModal);

  return {
    // 🧩 Values
    platformBankAccounts,
    loadingPlatformBankAccounts,
    openBankModal,
    platformSupportedBanks,
    loadingPlatformSupportedBanks,

    // ⚙️ Functions
    toggleBankModal,
    handleMakeDefault,
    handleDeleteBank,
    handleCreateBankField,
    handleAdminCreateBank,
  }
}