import { createSlice} from "@reduxjs/toolkit";
import {searchNotificationInitialState} from "./states/notification.states";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {SearchNotificationRequestType} from "../schemas/notification.schema";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    search: {
      notifications: searchNotificationInitialState,
    },
    selected: {
      userId: undefined as string | undefined,
      adminUserId: undefined as string | undefined,
      transactionId: undefined as string | undefined,
    }
  },
  reducers: {
    // Sets
    setSearchNotificationField: (state, action: PayloadAction<{ field: keyof SearchNotificationRequestType; value: any }>) => {
      const { field, value } = action.payload;
      state.search.notifications[field] = value;
    },
    setSearchNotification: (state, action: PayloadAction<SearchNotificationRequestType >) => {
      state.search.notifications = action.payload;
    },
    setSelectedUserId: (state, action: PayloadAction<string>) => {
      state.selected.userId = action.payload;
    },
    setSelectedAdminUserId: (state, action: PayloadAction<string>) => {
      state.selected.adminUserId = action.payload;
    },
    setSelectedTransactionId: (state, action: PayloadAction<string>) => {
      state.selected.transactionId = action.payload;
    },

    // Clears
    clearSearchNotification: (state) => {
      state.search.notifications = { ...searchNotificationInitialState };
    },
    clearSelectedUserId: (state) => {
      state.selected.userId = undefined;
    },
    clearSelectedAdminUserId: (state) => {
      state.selected.adminUserId = undefined;
    },
    clearSelectedTransactionId: (state) => {
      state.selected.transactionId = undefined;
    }
  },
});

export const {
  setSearchNotificationField,
  setSearchNotification,
  setSelectedUserId,
  setSelectedAdminUserId,
  setSelectedTransactionId,

  clearSearchNotification,
  clearSelectedUserId,
  clearSelectedAdminUserId,
  clearSelectedTransactionId,
} = notificationSlice.actions;

export default notificationSlice.reducer;
