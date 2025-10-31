import { createSlice} from "@reduxjs/toolkit";
import {adminSearchUsersInitialState} from "./states/initial-users-management.states";
import type {UserStatusVariant} from "../types/global.types";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {AdminSearchUserRequestType} from "../schemas/user.schema";

const userSlice = createSlice({
  name: "bank",
  initialState: {
    search: {
      users: adminSearchUsersInitialState,
    },
    details: {
      userId: undefined as string | undefined,
      status: undefined as UserStatusVariant | undefined,
    }
  },
  reducers: {
    // Sets
    setSearchUsersField: (state, action: PayloadAction<{ field: keyof AdminSearchUserRequestType; value: any }>) => {
      const { field, value } = action.payload;
      state.search.users[field] = value;
    },
    setSelectedUserDetailId: (state, action: PayloadAction<string>) => {
      state.details.userId = action.payload;
    },
    setSelectedUserStatus: (state, action: PayloadAction<UserStatusVariant | undefined>) => {
      state.details.status = action.payload;
    },
    setSearchUsers: (state, action: PayloadAction<AdminSearchUserRequestType>) => {
      state.search.users = action.payload;
    },

    // Clears
    clearSearchUsers: (state) => {
      state.search.users = { ...adminSearchUsersInitialState };
    },
    clearSelectedUserDetailId: (state) => {
      state.details.userId = undefined;
    },
    clearSelectedUserStatus: (state) => {
      state.details.status = undefined;
    }
  },
});

export const {
  setSearchUsersField,
  setSelectedUserDetailId,
  setSelectedUserStatus,
  setSearchUsers,

  clearSearchUsers,
  clearSelectedUserDetailId,
  clearSelectedUserStatus,
} = userSlice.actions;

export default userSlice.reducer;
