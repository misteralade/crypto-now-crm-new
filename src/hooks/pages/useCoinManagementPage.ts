import {useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "@tanstack/react-router";
import {
  clearDeleteCoinId,
  clearEditCoinId,
  clearEditCoinPayload, setDeleteCoinId,
  setEditCoinId,
  setEditCoinPayloadField,
  setSearchSupportedCrypto,
  setSearchSupportedCryptoField,
} from '../../redux/coin-management.slice'
import { useCryptoQuery } from '../../queries/crypto.querries'
import { ROUTES } from "../../util/constants.util.ts";
import {searchSupportedCryptoInitialState} from "../../redux/states/initial-coin-management.states";

export const useCoinManagementPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { supportedCrypto, loadingSupportedCrypto, updateCryptoCurrencyMutation, adminDeleteCryptoCurrencyMutation } = useCryptoQuery()

  const [query, setQuery] = useState('')
  const [pageSize, setPageSize] = useState<number>(10);
  
  // Modal
  const [deleteCoinModal, setDeleteCoinModal] = useState(false);

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

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    dispatch(setSearchSupportedCrypto({
      ...searchSupportedCryptoInitialState,
      size: size,
    }))
  }

  const handlePageChange = (page: number) => {
    dispatch(setSearchSupportedCryptoField({
      field: 'page',
      value: page,
    }));
  }

  const handleViewCoinDetails = (id: string) => {
    navigate({ to: ROUTES.EDIT_COIN.replace('$coinId', id) })
  }

  const handleDisableCoin = async (id: string, status: boolean) => {
    dispatch(setEditCoinId(id));
    dispatch(setEditCoinPayloadField({
      field: 'isActive',
      value: !status,
    }))
    const { success } = await updateCryptoCurrencyMutation.mutateAsync()
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
    pageSize,
    deleteCoinModal,


    // ⚙️ Functions
    openAddCoin,
    handleCoinSearchChange,
    handlePageSizeChange,
    handlePageChange,
    handleViewCoinDetails,
    handleDisableCoin,
    handleDeleteCryptoCurrency,
    toggleDeleteCoinModal,
    handleConfirmDeleteCryptoCurrency,
  }
}