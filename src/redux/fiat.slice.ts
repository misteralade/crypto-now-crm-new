import { createSlice } from "@reduxjs/toolkit";
import {createAdminBankInitialState, editExchangeRateInitialState} from "./states/initial-fiat.states";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CreateBankAccountRequestType } from "../schemas/bank.schema";
import type { EditPlatformExchangeRateRequestType } from "../schemas/rate.schema";

const fiatSlice = createSlice({
  name: "fiat",
  initialState: {
    bank: {
      createBank: createAdminBankInitialState,
      selectedBankId: undefined as string | undefined,
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
    }
  },
});

export const {
  // Sets
  setCreateBankField,
  setSelectedBankId,
  setSelectedRate,
  setEditPlatformExchangeRate,

  // Clears
  clearCreateBankField,
  clearSelectedBankId,
  clearSelectedRate,
  clearEditPlatformExchangeRate,
} = fiatSlice.actions;

export default fiatSlice.reducer;
