import { createSlice } from "@reduxjs/toolkit";
import {searchAuditLogInitialState} from "./states/audit-log.states";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {SearchAuditLogsRequestType} from "../schemas/audit.schema";

const auditLogSlice = createSlice({
  name: "auditLog",
  initialState: {
    search: searchAuditLogInitialState,
  },
  reducers: {
    // Sets
    setSearchAuditLogField: (state, action: PayloadAction<{ field: (keyof SearchAuditLogsRequestType), value: any }>) => {
      const { field, value } = action.payload;

      if (field in state.search) {
        (state.search as any)[field] = value;
      }
    },
    setSearchAuditLog: (state, action: PayloadAction<SearchAuditLogsRequestType>) => {
      state.search = action.payload;
    },

    // Clears
    clearSearchAuditLogField: (state) => {
      state.search = { ...searchAuditLogInitialState }
    }
  },
});

export const {
  // Sets
  setSearchAuditLogField,
  setSearchAuditLog,

  // Clears
  clearSearchAuditLogField,
} = auditLogSlice.actions;

export default auditLogSlice.reducer;
