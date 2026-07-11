import {useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "@tanstack/react-router";
import {
  clearDeleteCoinId,
  clearEditCoinId,
  clearEditCoinPayload, setDeleteCoinId,
  setEditCoinId,
  setEditCoinPayloadField,
  setSearchSupportedCryptoField,
} from '../../redux/coin-management.slice'
import { useCryptoQuery } from '../../queries/crypto.querries'
import { ROUTES } from "../../util/constants.util.ts";
import type { SearchSupportedCryptoData } from "../../types/response.payload.types";
import { cryptoServiceApi } from '../../api/crypto.api';

export const useCoinManagementPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { supportedCrypto, loadingSupportedCrypto, updateCryptoCurrencyMutation, adminDeleteCryptoCurrencyMutation } = useCryptoQuery()

  const [query, setQuery] = useState('')

  // Modals
  const [deleteCoinModal, setDeleteCoinModal] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<SearchSupportedCryptoData | null>(null);
  const [loadingCoinDetails, setLoadingCoinDetails] = useState(false);

  const openAddCoin = () => navigate({ to: ROUTES.ADD_COIN })

  const handleCoinSearchChange = (value: string) => {
    setQuery(value)
    dispatch(setSearchSupportedCryptoField({
      field: "searchQuery",
      value,
    }));
    dispatch(setSearchSupportedCryptoField({
      field: "searchField",
      value: "symbol",
    }));
  }

  const handleViewCoinDetails = (id: string) => {
    navigate({ to: ROUTES.EDIT_COIN.replace('$coinId', id) })
  }

  const handleOpenCoinDetails = async (id: string) => {
    setSelectedCoin(null)
    setLoadingCoinDetails(true)
    try {
      const { data, success } = await cryptoServiceApi.adminGetSupportedCrypto(id)
      if (success && data) setSelectedCoin(data)
    } finally {
      setLoadingCoinDetails(false)
    }
  }

  const handleCloseCoinDetails = () => setSelectedCoin(null)

  const handleDisableCoin = async (id: string, status: boolean) => {
    dispatch(setEditCoinId(id));
    dispatch(setEditCoinPayloadField({
      field: 'isActive',
      value: !status,
    }))
    const { success } = await updateCryptoCurrencyMutation.mutateAsync()
     
    if (success) {
      dispatch(clearEditCoinPayload())
      dispatch(clearEditCoinId())
    }
  }
  
  const handleDeleteCryptoCurrency = (id: string) => {
    dispatch(setDeleteCoinId(id))
    toggleDeleteCoinModal();
  }
  
  const handleConfirmDeleteCryptoCurrency = async () => {
    const { success } = await adminDeleteCryptoCurrencyMutation.mutateAsync()
    
    if (success) {
      dispatch(clearDeleteCoinId())
      toggleDeleteCoinModal();
    }
  }
  
  const toggleDeleteCoinModal = () => setDeleteCoinModal(!deleteCoinModal);

  
  return {
    // 🧩 Values
    query,
    supportedCrypto,
    loadingSupportedCrypto,
    deleteCoinModal,
    selectedCoin,
    loadingCoinDetails,

    // ⚙️ Functions
    openAddCoin,
    handleCoinSearchChange,
    handleViewCoinDetails,
    handleOpenCoinDetails,
    handleCloseCoinDetails,
    handleDisableCoin,
    handleDeleteCryptoCurrency,
    toggleDeleteCoinModal,
    handleConfirmDeleteCryptoCurrency,
  }
}