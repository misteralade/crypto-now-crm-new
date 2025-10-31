import { createSlice } from "@reduxjs/toolkit";
import {createNewAdminInitialState, createNewRoleInitialState, searchAdminInitialState} from "./states/admin.states";
import type {CreateNewAdminRequestType, CreateNewRoleRequestType, SearchAdminRequestType} from "../schemas/admin.schema";
import type { PayloadAction } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "auditLog",
  initialState: {
    create: {
      role: createNewRoleInitialState,
      admin: createNewAdminInitialState,
    },
    search: {
      admin: searchAdminInitialState,
    },
    update: {
      admin: {
        id: undefined as string | undefined,
        active: undefined as boolean | undefined,
      }
    }
  },
  reducers: {
    // Sets
    setCreateRoleField: (state, action: PayloadAction<{ field: keyof CreateNewRoleRequestType; value: any }>) => {
      const { field, value } = action.payload;
      state.create.role[field] = value;
    },
    setCreateRole: (state, action: PayloadAction<CreateNewRoleRequestType>) => {
      state.create.role = action.payload;
    },
    setCreateAdminField: (state, action: PayloadAction<{ field: keyof CreateNewAdminRequestType; value: any }>) => {
      const { field, value } = action.payload;
      if (field in state.create.admin) {
        (state.create.admin as any)[field] = value;
      }
    },
    setCreateAdmin: (state, action: PayloadAction<CreateNewAdminRequestType>) => {
      state.create.admin = action.payload;
    },
    setSearchAdminField: (state, action: PayloadAction<{ field: keyof SearchAdminRequestType; value: any }>) => {
      const { field, value } = action.payload;
      (state.search.admin as any)[field] = value;
    },
    setSearchAdmin: (state, action: PayloadAction<SearchAdminRequestType>) => {
      state.search.admin = action.payload;
    },
    setUpdateAdminField: (state, action: PayloadAction<{ field: keyof typeof state.update.admin; value: any }>) => {
      const { field, value } = action.payload;
      (state.update.admin as any)[field] = value;
    },

    // Clears
    clearCreateRoleField: (state) => {
      state.create.role = { ...createNewRoleInitialState };
    },
    clearCreateAdminField: (state) => {
      state.create.admin = { ...createNewAdminInitialState };
    },
    clearSearchAdminField: (state) => {
      state.search.admin = { ...searchAdminInitialState };
    },
    clearUpdateAdminField: (state) => {
      state.update.admin = {
        id: undefined,
        active: undefined,
      }
    }
  },
});

export const {
  // Sets
  setCreateRoleField,
  setCreateRole,
  setCreateAdminField,
  setCreateAdmin,
  setSearchAdminField,
  setSearchAdmin,
  setUpdateAdminField,

  // Clears
  clearCreateRoleField,
  clearCreateAdminField,
  clearSearchAdminField,
  clearUpdateAdminField,
} = adminSlice.actions;

export default adminSlice.reducer;
