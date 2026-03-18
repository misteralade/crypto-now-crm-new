import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  createKycTierLimitInitialState,
  updateKycTierLimitInitialState,
} from "./states/kyc-tier-limit.states";
import type { CreateKycTierLimitRequestType, UpdateKycTierLimitRequestType } from "../schemas/kyc.schema";

const kycTierLimitSlice = createSlice({
  name: "kycTierLimit",
  initialState: {
    create: createKycTierLimitInitialState,
    update: {
      id: undefined as string | undefined,
      data: updateKycTierLimitInitialState,
    },
    delete: {
      id: undefined as string | undefined,
    },
  },
  reducers: {
    // Create Sets
    setCreateKycTierLimitField: (state, action: PayloadAction<{ field: keyof CreateKycTierLimitRequestType; value: any }>) => {
      const { field, value } = action.payload;
      (state.create as any)[field] = value;
    },
    setCreateKycTierLimit: (state, action: PayloadAction<CreateKycTierLimitRequestType>) => {
      state.create = action.payload;
    },

    // Update Sets
    setUpdateKycTierLimitId: (state, action: PayloadAction<string>) => {
      state.update.id = action.payload;
    },
    setUpdateKycTierLimitField: (state, action: PayloadAction<{ field: keyof UpdateKycTierLimitRequestType; value: any }>) => {
      const { field, value } = action.payload;
      (state.update.data as any)[field] = value;
    },
    setUpdateKycTierLimit: (state, action: PayloadAction<UpdateKycTierLimitRequestType>) => {
      state.update.data = action.payload;
    },

    // Delete Sets
    setDeleteKycTierLimitId: (state, action: PayloadAction<string>) => {
      state.delete.id = action.payload;
    },

    // Clears
    clearCreateKycTierLimit: (state) => {
      state.create = { ...createKycTierLimitInitialState };
    },
    clearUpdateKycTierLimit: (state) => {
      state.update.id = undefined;
      state.update.data = { ...updateKycTierLimitInitialState };
    },
    clearDeleteKycTierLimitId: (state) => {
      state.delete.id = undefined;
    },
  },
});

export const {
  // Create Sets
  setCreateKycTierLimitField,
  setCreateKycTierLimit,

  // Update Sets
  setUpdateKycTierLimitId,
  setUpdateKycTierLimitField,
  setUpdateKycTierLimit,

  // Delete Sets
  setDeleteKycTierLimitId,

  // Clears
  clearCreateKycTierLimit,
  clearUpdateKycTierLimit,
  clearDeleteKycTierLimitId,
} = kycTierLimitSlice.actions;

export default kycTierLimitSlice.reducer;
