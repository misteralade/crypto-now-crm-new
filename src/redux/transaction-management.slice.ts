import { createSlice} from "@reduxjs/toolkit";
import {
  searchTransactionsInitialState,
  searchUserTransactionHistoryInitialState,
  updateTransactionInitialState
} from "./states/initial-transaction-management.states";
import type {SearchTransactionsRequestType, UpdateTransactionStatusRequestType} from "../schemas/transaction.schema";
import type {PayloadAction} from "@reduxjs/toolkit";

const transactionManagementSlice = createSlice({
  name: "bank",
  initialState: {
    search: {
      transactions: searchTransactionsInitialState,
      userTransactionHistory: searchUserTransactionHistoryInitialState,
    },
    details: {
      transactionSessionId: undefined as string | undefined,
      update: updateTransactionInitialState,
    },
  },
  reducers: {
    // Sets
    setSearchTransactionsField: (state, action: PayloadAction<{ field: keyof SearchTransactionsRequestType; value: any }>) => {
      const { field, value } = action.payload;
      state.search.transactions[field] = value;
    },
    setTransactionDetailSessionId: (state, action: PayloadAction<string>) => {
      state.details.transactionSessionId = action.payload;
    },
    setTransactionDetailUpdateField: (state, action: PayloadAction<{ field: keyof UpdateTransactionStatusRequestType; value: any }>) => {
      const { field, value } = action.payload;
      state.details.update[field] = value;
    },
    setSearchTransactions: (state, action: PayloadAction<SearchTransactionsRequestType>) => {
      state.search.transactions = action.payload;
    },
    setSearchUserTransactionHistoryField: (state, action: PayloadAction<{ field: keyof SearchTransactionsRequestType; value: any }>) => {
      const { field, value } = action.payload;
      state.search.userTransactionHistory[field] = value;
    },
    setSearchUserTransactionHistory: (state, action: PayloadAction<SearchTransactionsRequestType>) => {
      state.search.userTransactionHistory = action.payload;
    },

    // Clears
    clearSearchTransactions: (state) => {
      state.search.transactions = { ...searchTransactionsInitialState };
    },
    clearSearchUserTransactionHistory: (state) => {
      state.search.userTransactionHistory = { ...searchUserTransactionHistoryInitialState };
    },
    clearTransactionDetailSessionId: (state) => {
      state.details.transactionSessionId = undefined;
    },
    clearTransactionDetailUpdateField: (state) => {
      state.details.update = updateTransactionInitialState;
    }
  },
});

export const {
  setSearchTransactionsField,
  setTransactionDetailSessionId,
  setTransactionDetailUpdateField,
  setSearchTransactions,
  setSearchUserTransactionHistoryField,
  setSearchUserTransactionHistory,

  clearSearchTransactions,
  clearTransactionDetailSessionId,
  clearTransactionDetailUpdateField,
  clearSearchUserTransactionHistory,
} = transactionManagementSlice.actions;

export default transactionManagementSlice.reducer;
