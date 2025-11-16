import {useNavigate} from "@tanstack/react-router";
import { useDispatch } from 'react-redux'
import { ROUTES } from '../../util/constants.util.ts'
import { useCryptoQuery } from '../../queries/crypto.querries.js'
import {setAddCoinField} from "../../redux/coin-management.slice";
import type { CreateSupportedCryptoAndAdminWalletRequestType } from '../../schemas/crypto.schema'

export const useAddCoinPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uploadCryptoLogoIconMutation, createCryptoCurrencyMutation } = useCryptoQuery()

  const goBack = () => navigate({ to: ROUTES.COIN_MANAGEMENT })

  const saveCoin = async () => {
    const { success } = await createCryptoCurrencyMutation.mutateAsync()

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (success) {
      navigate({ to: ROUTES.COIN_MANAGEMENT })
    }
  }
  
  const handleCreateCoinInputChange = (field: keyof CreateSupportedCryptoAndAdminWalletRequestType, value: any ) => {
    dispatch(setAddCoinField({
      field,
      value,
    }))
  }

  return {
    // 🧩 Values

    // Mutation
    uploadCryptoLogoIconMutation,

    // ⚙️ Functions
    saveCoin,
    goBack,
    handleCreateCoinInputChange,
  }
}