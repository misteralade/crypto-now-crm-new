import {useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "@tanstack/react-router";
import {
  clearEditCoinId,
  clearEditCoinPayload,
  setEditCoinId,
  setEditCoinPayloadField,
  setSearchSupportedCrypto,
  setSearchSupportedCryptoField,
} from '../../redux/coin-management.slice'
import { useCryptoQuery } from '../../queries/crypto.querries'
import { ROUTES } from "../../util/constants";
import {searchSupportedCryptoInitialState} from "../../redux/states/initial-coin-management.states";

export const useCoinManagementPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { supportedCrypto, loadingSupportedCrypto, updateCryptoCurrencyMutation } = useCryptoQuery()

  const [query, setQuery] = useState('')
  const [pageSize, setPageSize] = useState<number>(10);

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

  return {
    // 🧩 Values
    query,
    supportedCrypto,
    loadingSupportedCrypto,
    pageSize,


    // ⚙️ Functions
    openAddCoin,
    handleCoinSearchChange,
    handlePageSizeChange,
    handlePageChange,
    handleViewCoinDetails,
    handleDisableCoin,
  }
}