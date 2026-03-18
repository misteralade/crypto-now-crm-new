import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  createCurrencyInitialState,
  updateCurrencyInitialState,
} from "./states/currency.states";
import type { CreateCurrencyRequestType, UpdateCurrencyRequestType } from "../schemas/currency.schema";

const currencySlice = createSlice({
  name: "currency",
  initialState: {
    create: createCurrencyInitialState,
    update: {
      id: undefined as string | undefined,
      data: updateCurrencyInitialState,
    },
    delete: {
      id: undefined as string | undefined,
    },
  },
  reducers: {
    // Create Sets
    setCreateCurrencyField: (state, action: PayloadAction<{ field: keyof CreateCurrencyRequestType; value: any }>) => {
      const { field, value } = action.payload;
      (state.create as any)[field] = value;
    },
    setCreateCurrency: (state, action: PayloadAction<CreateCurrencyRequestType>) => {
      state.create = action.payload;
    },

    // Update Sets
    setUpdateCurrencyId: (state, action: PayloadAction<string>) => {
      state.update.id = action.payload;
    },
    setUpdateCurrencyField: (state, action: PayloadAction<{ field: keyof UpdateCurrencyRequestType; value: any }>) => {
      const { field, value } = action.payload;
      (state.update.data as any)[field] = value;
    },
    setUpdateCurrency: (state, action: PayloadAction<UpdateCurrencyRequestType>) => {
      state.update.data = action.payload;
    },

    // Delete Sets
    setDeleteCurrencyId: (state, action: PayloadAction<string>) => {
      state.delete.id = action.payload;
    },

    // Clears
    clearCreateCurrency: (state) => {
      state.create = { ...createCurrencyInitialState };
    },
    clearUpdateCurrency: (state) => {
      state.update.id = undefined;
      state.update.data = { ...updateCurrencyInitialState };
    },
    clearDeleteCurrencyId: (state) => {
      state.delete.id = undefined;
    },
  },
});

export const {
  // Create Sets
  setCreateCurrencyField,
  setCreateCurrency,

  // Update Sets
  setUpdateCurrencyId,
  setUpdateCurrencyField,
  setUpdateCurrency,

  // Delete Sets
  setDeleteCurrencyId,

  // Clears
  clearCreateCurrency,
  clearUpdateCurrency,
  clearDeleteCurrencyId,
} = currencySlice.actions;

export default currencySlice.reducer;
