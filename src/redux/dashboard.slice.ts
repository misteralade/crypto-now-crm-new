import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { TimelineFilter } from '../types/global.types'

const dashboardSlice = createSlice({
  name: "bank",
  initialState: {
    timelineFilter: "week" as TimelineFilter
  },
  reducers: {
    // Sets
    setSelectedTimeline: (state, payload: PayloadAction<TimelineFilter>) => {
      state.timelineFilter = payload.payload;
    },

    // Clears
    clearSelectedTimeline: (state) => {
      state.timelineFilter = "week";
    }
  },
});

export const {
  setSelectedTimeline,

  clearSelectedTimeline,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
