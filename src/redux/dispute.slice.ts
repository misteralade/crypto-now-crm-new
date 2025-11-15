import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {searchDisputeInitialState} from "./states/dispute.states.ts";
import type {AdminSearchDisputesRequestType} from "../schemas/dispute.schema.ts";
import type {MessageAttachment} from "../types/response.payload.types.ts";
import type {DisputeResolution, DisputeStatus} from "../types/dispute.types.ts";

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
    },
    edit: {
      id: undefined as undefined | string,
      transactionId: undefined as undefined | string,
      statusModal: {
        note: undefined as string | undefined,
        status: undefined as DisputeStatus | undefined,
        resolution: undefined as DisputeResolution | undefined,
      }
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
    setEditDisputeId: (state, action: PayloadAction<string>) => {
      state.edit.id = action.payload;
    },
    setEditDisputeTransactionId: (state, action: PayloadAction<string>) => {
      state.edit.transactionId = action.payload;
    },
    setEditDisputeStatusModalNote: (state, action: PayloadAction<string>) => {
      state.edit.statusModal.note = action.payload;
    },
    setEditDisputeStatusModalStatus: (state, action: PayloadAction<DisputeStatus | undefined>) => {
      state.edit.statusModal.status = action.payload;
    },
    setEditDisputeStatusModalResolution: (state, action: PayloadAction<DisputeResolution | undefined>) => {
      state.edit.statusModal.resolution = action.payload;
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
    clearEditDisputeId: (state) => {
      state.edit.id = undefined;
    },
    clearEditDisputeTransactionId: (state) => {
      state.edit.transactionId = undefined;
    },
    clearEditDisputeStatusModalNote: (state) => {
      state.edit.statusModal.note = undefined;
    },
    clearEditDisputeStatusModalStatus: (state) => {
      state.edit.statusModal.status = undefined;
    },
    clearEditDisputeStatusModalResolution: (state) => {
      state.edit.statusModal.resolution = undefined;
    }
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
  setEditDisputeId,
  setEditDisputeTransactionId,
  setEditDisputeStatusModalNote,
  setEditDisputeStatusModalStatus,
  setEditDisputeStatusModalResolution,
  
  // Clears
  clearManageSearchDispute,
  clearManageDisputeTransactionId,
  clearDisputeDetailsId,
  clearDisputeMessageAttachments,
  clearDisputeMessageText,
  clearEditDisputeId,
  clearEditDisputeTransactionId,
  clearEditDisputeStatusModalNote,
  clearEditDisputeStatusModalStatus,
  clearEditDisputeStatusModalResolution,
} = disputeSlice.actions;

export default disputeSlice.reducer;
