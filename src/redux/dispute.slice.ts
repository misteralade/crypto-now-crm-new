import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {searchDisputeInitialState} from "./states/dispute.states.ts";
import type {AdminSearchDisputesRequestType} from "../schemas/dispute.schema.ts";
import type {MessageAttachment} from "../types/response.payload.types.ts";

const disputeSlice = createSlice({
  name: "dispute",
  initialState: {
    manage: {
      search: searchDisputeInitialState,
      transactionId: undefined as undefined | string,
    },
    details: {
      id: undefined as undefined | string,
      message: {
        text: undefined as undefined | string,
        attachments: undefined as Array<MessageAttachment> | undefined,
      }
    }
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
    setDisputeDetailsId: (state, action: PayloadAction<string>) => {
      state.details.id = action.payload;
    },
    setDisputeAttachments: (state, action: PayloadAction<Array<MessageAttachment>>) => {
      state.details.message.attachments = action.payload;
    },
    addDisputeAttachment: (state, action: PayloadAction<MessageAttachment>) => {
      if (!state.details.message.attachments) {
        state.details.message.attachments = [];
      }
      state.details.message.attachments.push(action.payload);
    },
    removeDisputeAttachment: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (state.details.message.attachments && index >= 0 && index < state.details.message.attachments.length) {
        state.details.message.attachments.splice(index, 1);
      }
    },
    setDisputeMessageText: (state, action: PayloadAction<string>) => {
      state.details.message.text = action.payload;
    },
    
    // Clears
    clearManageSearchDispute: (state) => {
      state.manage.search = { ...searchDisputeInitialState }
    },
    clearManageDisputeTransactionId: (state) => {
      state.manage.transactionId = undefined;
    },
    clearDisputeDetailsId: (state) => {
      state.details.id = undefined;
    },
    clearDisputeMessageAttachments: (state) => {
      state.details.message.attachments = undefined;
    },
    clearDisputeMessageText: (state) => {
      state.details.message.text = undefined;
    },
  },
});

export const {
  // Sets
  setManageSearchDisputeField,
  setManageSearchDispute,
  setManageDisputeTransactionId,
  setDisputeDetailsId,
  setDisputeAttachments,
  addDisputeAttachment,
  removeDisputeAttachment,
  setDisputeMessageText,
  
  // Clears
  clearManageSearchDispute,
  clearManageDisputeTransactionId,
  clearDisputeDetailsId,
  clearDisputeMessageAttachments,
  clearDisputeMessageText,
} = disputeSlice.actions;

export default disputeSlice.reducer;
