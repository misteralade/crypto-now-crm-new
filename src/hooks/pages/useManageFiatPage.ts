import {useEffect, useMemo, useState} from "react";
import { useDispatch } from "react-redux";
import {useBankQuery} from "../../queries/bank.querries";
import { usePayoutAutoApprovalLimitQuery } from "../../queries/settings.querries";
import {
  clearSelectedBankId,
  clearCreateBankField,
  setCreateBankField, setSearchFiatField,
  setSelectedBankId,
} from '../../redux/fiat.slice'
import type {CreateBankAccountRequestType} from "../../schemas/bank.schema";
import {debounce} from "../../util/debouce.util.ts";
import {TIME_IN_MILLISECONDS} from "../../util/constants.util.ts";
import { toast } from "react-toastify";

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
  const {
    payoutAutoApprovalLimitQuery,
    updatePayoutAutoApprovalLimitMutation,
  } = usePayoutAutoApprovalLimitQuery();
  
  const [searchQuery, setSearchQuery] = useState('')
  const [payoutAutoApprovalLimitInput, setPayoutAutoApprovalLimitInput] = useState("");
  
  const [openBankModal, setOpenBankModal] = useState(false)

  useEffect(() => {
    const threshold = payoutAutoApprovalLimitQuery.data?.thresholdNgn;

    if (typeof threshold === "number" && Number.isFinite(threshold)) {
      setPayoutAutoApprovalLimitInput(String(threshold));
    }
  }, [payoutAutoApprovalLimitQuery.data?.thresholdNgn]);

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

  const handlePayoutAutoApprovalLimitChange = (value: string) => {
    setPayoutAutoApprovalLimitInput(value);
  };

  const handleSavePayoutAutoApprovalLimit = async () => {
    const parsedThreshold = Number(
      payoutAutoApprovalLimitInput.replace(/,/g, ""),
    );

    if (!Number.isFinite(parsedThreshold) || parsedThreshold <= 0) {
      toast.error("Enter a valid payout approval limit.");
      return;
    }

    await updatePayoutAutoApprovalLimitMutation.mutateAsync(parsedThreshold);
  };
  
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
    payoutAutoApprovalLimitQuery,
    payoutAutoApprovalLimitInput,
    savingPayoutAutoApprovalLimit:
      updatePayoutAutoApprovalLimitMutation.isPending,

    // ⚙️ Functions
    handleOpenBankModal,
    handleCloseBankModal,
    handleMakeDefault,
    handleDeleteBank,
    handleCreateBankField,
    handleAdminCreateBank,
    handleSearchChange,
    handlePayoutAutoApprovalLimitChange,
    handleSavePayoutAutoApprovalLimit,
  }
}
