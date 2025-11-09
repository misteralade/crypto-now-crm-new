import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {searchDisputeInitialState} from "./states/dispute.states.ts";
import type {AdminSearchDisputesRequestType} from "../schemas/dispute.schema.ts";

const disputeSlice = createSlice({
  name: "dispute",
  initialState: {
    manage: {
      search: searchDisputeInitialState,
      transactionId: undefined as undefined | string,
    },
  },
  reducers: {
    // Sets
    setManageSearchDisputeField: (state, action: PayloadAction<{ field: (keyof AdminSearchDisputesRequestType), value: any }>) => {
      const { field, value } = action.payload;
      
      if (field in state.manage.search) {
        (state.manage.search as any)[field] = value;
      }
    },
    setManageSearchDispute: (state, action: PayloadAction<AdminSearchDisputesRequestType>) => {
      state.manage.search = action.payload;
    },
    setManageDisputeTransactionId: (state, action: PayloadAction<string>) => {
      state.manage.transactionId = action.payload;
    },
    
    // Clears
    clearManageSearchDisputeField: (state) => {
      state.manage.search = { ...searchDisputeInitialState }
    },
    clearManageDisputeTransactionId: (state) => {
      state.manage.transactionId = undefined;
    }
  },
});

export const {
  // Sets
  setManageSearchDisputeField,
  setManageSearchDispute,
  setManageDisputeTransactionId,
  
  // Clears
  clearManageSearchDisputeField,
  clearManageDisputeTransactionId,
} = disputeSlice.actions;

export default disputeSlice.reducer;
