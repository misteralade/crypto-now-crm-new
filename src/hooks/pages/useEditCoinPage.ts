import {useEffect} from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import {useDispatch} from "react-redux";
import {
  clearEditCoinId,
  clearEditCoinPayload,
  setEditCoinId,
  setEditCoinPayloadField,
} from '../../redux/coin-management.slice'
import {useCryptoQuery} from "../../queries/crypto.querries";
import {ROUTES} from "../../util/constants.util.ts";
import type { EditSupportedCryptoAndAdminWalletRequestType } from "../../schemas/crypto.schema";

export const useEditCoinPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const {
    // 🧩 Values
    adminCryptoDetails,
    loadingAdminCryptoDetails,

    // ⚙️ Mutation Functions
    uploadCryptoLogoIconMutation,
    updateCryptoCurrencyMutation,
  } = useCryptoQuery();
  
  const { coinId } = useParams({ from: '/dashboard/coin-management/$coinId' })
  
  useEffect(() => {
    if (coinId) {
      dispatch(setEditCoinId(coinId))
    }
  }, [coinId, dispatch])
  
  const goBack = () => navigate({ to: ROUTES.COIN_MANAGEMENT })

  const handleEditCoinInputChange = (field: keyof EditSupportedCryptoAndAdminWalletRequestType, value: any ) => {
    dispatch(setEditCoinPayloadField({
      field,
      value: value === '' ? undefined : value,
    }))
  }

  const handleUpdateCrypto = async () => {
    const { success } = await updateCryptoCurrencyMutation.mutateAsync()
     
    if (success) {
      dispatch(clearEditCoinPayload())
      dispatch(clearEditCoinId())
      navigate({ to: ROUTES.COIN_MANAGEMENT } )
    }
  }

  return {
    // 🧩 Values
    adminCryptoDetails,
    loadingAdminCryptoDetails,

    // ⚙️ Functions
    uploadCryptoLogoIconMutation,
    handleEditCoinInputChange,
    goBack,
    handleUpdateCrypto,
  };
}