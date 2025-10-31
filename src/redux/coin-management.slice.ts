import { createSlice} from "@reduxjs/toolkit";
import {
  createSupportedCryptoAndWalletInitialState, editSupportedCryptoInitialState,
  searchSupportedCryptoInitialState
} from "./states/initial-coin-management.states";
import type {
  CreateSupportedCryptoAndAdminWalletRequestType,
  EditSupportedCryptoAndAdminWalletRequestType,
  SearchSupportedCryptoWalletRequestSchema
} from "../schemas/crypto.schema";
import type {PayloadAction} from "@reduxjs/toolkit";

const coinManagementSlice = createSlice({
  name: 'bank',
  initialState: {
    search: {
      supportedCrypto: searchSupportedCryptoInitialState,
    },
    addCoin: createSupportedCryptoAndWalletInitialState,
    edit: {
      coinId: undefined as string | undefined,
      payload: editSupportedCryptoInitialState,
    },
  },
  reducers: {
    // Sets
    setSearchSupportedCryptoField: (
      state,
      action: PayloadAction<{
        field: keyof SearchSupportedCryptoWalletRequestSchema
        value: any
      }>,
    ) => {
      const { field, value } = action.payload
      state.search.supportedCrypto[field] = value
    },
    setAddCoinField: (
      state,
      action: PayloadAction<{
        field: keyof CreateSupportedCryptoAndAdminWalletRequestType
        value: any
      }>,
    ) => {
      const { field, value } = action.payload
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state.addCoin[field] = value
    },
    setSearchSupportedCrypto: (
      state,
      action: PayloadAction<SearchSupportedCryptoWalletRequestSchema>,
    ) => {
      state.search.supportedCrypto = action.payload
    },
    setEditCoinId: (state, action: PayloadAction<string | undefined>) => {
      state.edit.coinId = action.payload
    },
    setEditCoinPayloadField: (state, action: PayloadAction<{ field: keyof EditSupportedCryptoAndAdminWalletRequestType, value: any}>) => {
      const { field, value } = action.payload;
      state.edit.payload[field] = value;
    },

    // Clears
    clearSearchSupportedCrypto: (state) => {
      state.search.supportedCrypto = { ...searchSupportedCryptoInitialState }
    },
    clearAddCoin: (state) => {
      state.addCoin = { ...createSupportedCryptoAndWalletInitialState }
    },
    clearEditCoinId: (state) => {
      state.edit.coinId = undefined
    },
    clearEditCoinPayload: (state) => {
      state.edit.payload = { ...editSupportedCryptoInitialState }
    },
  },
})

export const {
  setSearchSupportedCryptoField,
  setAddCoinField,
  setSearchSupportedCrypto,
  setEditCoinId,
  setEditCoinPayloadField,

  clearSearchSupportedCrypto,
  clearAddCoin,
  clearEditCoinId,
  clearEditCoinPayload,
} = coinManagementSlice.actions;

export default coinManagementSlice.reducer;
