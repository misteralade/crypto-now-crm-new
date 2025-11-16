import { createSlice } from "@reduxjs/toolkit";
import {
  createAdminBankInitialState,
  editExchangeRateInitialState,
  searchSupportedBankInitialState
} from "./states/initial-fiat.states";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {AdminSearchSupportedBankRequestType, CreateBankAccountRequestType} from "../schemas/bank.schema";
import type { EditPlatformExchangeRateRequestType } from "../schemas/rate.schema";

const fiatSlice = createSlice({
  name: "fiat",
  initialState: {
    bank: {
      createBank: createAdminBankInitialState,
      selectedBankId: undefined as string | undefined,
      search: searchSupportedBankInitialState,
    },
    rate: {
      selectedRateId: undefined as string | undefined,
      editRate: editExchangeRateInitialState,
    }
  },
  reducers: {
    // Sets
    setCreateBankField: (state, action: PayloadAction<{ field: keyof CreateBankAccountRequestType; value: any }>) => {
      const { field, value } = action.payload;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state.bank.createBank[field] = value;
    },
    setSelectedBankId: (state, action: PayloadAction<string>) => {
      state.bank.selectedBankId = action.payload;
    },
    setSelectedRate: (state, action: PayloadAction<string>) => {
      state.rate.selectedRateId = action.payload;
    },
    setEditPlatformExchangeRate: (state, action: PayloadAction<{ field: (keyof EditPlatformExchangeRateRequestType), value: any }>) => {
      const { field, value } = action.payload;
      state.rate.editRate[field] = value;
    },
    setSearchFiatField: (state, action: PayloadAction<{ field: (keyof AdminSearchSupportedBankRequestType), value: any }>) => {
      const { field, value } = action.payload;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      state.bank.search[field] = value;
    },

    // Clears
    clearCreateBankField: (state) => {
      state.bank.createBank = { ...createAdminBankInitialState }
    },
    clearSelectedBankId: (state) => {
      state.bank.selectedBankId = undefined;
    },
    clearSelectedRate: (state) => {
      state.rate.selectedRateId = 'undefined';
    },
    clearEditPlatformExchangeRate: (state) => {
      state.rate.editRate = editExchangeRateInitialState;
    },
    clearSearchFiat: (state) => {
      state.bank.search = { ...searchSupportedBankInitialState }
    }
  },
});

export const {
  // Sets
  setCreateBankField,
  setSelectedBankId,
  setSelectedRate,
  setEditPlatformExchangeRate,
  setSearchFiatField,

  // Clears
  clearCreateBankField,
  clearSelectedBankId,
  clearSelectedRate,
  clearEditPlatformExchangeRate,
  clearSearchFiat,
} = fiatSlice.actions;

export default fiatSlice.reducer;
