import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  createTestimonialInitialState,
  searchTestimonialInitialState,
  updateTestimonialInitialState
} from "./states/testimonial.states";
import type {
  CreateTestimonialRequestType,
  GetTestimonialsQueryType,
  UpdateTestimonialRequestType,
} from "../schemas/testimonial.schema";

const testimonialSlice = createSlice({
  name: "testimonial",
  initialState: {
    create: createTestimonialInitialState,
    update: {
      id: undefined as string | undefined,
      data: updateTestimonialInitialState,
    },
    search: searchTestimonialInitialState,
    details: {
      id: undefined as string | undefined,
    },
    delete: {
      id: undefined as string | undefined,
    },
  },
  reducers: {
    // Create Sets
    setCreateTestimonialField: (state, action: PayloadAction<{ field: keyof CreateTestimonialRequestType; value: any }>) => {
      const { field, value } = action.payload;
      (state.create as any)[field] = value;
    },
    setCreateTestimonial: (state, action: PayloadAction<CreateTestimonialRequestType>) => {
      state.create = action.payload;
    },

    // Update Sets
    setUpdateTestimonialId: (state, action: PayloadAction<string>) => {
      state.update.id = action.payload;
    },
    setUpdateTestimonialField: (state, action: PayloadAction<{ field: keyof UpdateTestimonialRequestType; value: any }>) => {
      const { field, value } = action.payload;
      (state.update.data as any)[field] = value;
    },
    setUpdateTestimonial: (state, action: PayloadAction<UpdateTestimonialRequestType>) => {
      state.update.data = action.payload;
    },

    // Search Sets
    setSearchTestimonialField: (state, action: PayloadAction<{ field: keyof GetTestimonialsQueryType; value: any }>) => {
      const { field, value } = action.payload;
      (state.search as any)[field] = value;
    },
    setSearchTestimonial: (state, action: PayloadAction<GetTestimonialsQueryType>) => {
      state.search = action.payload;
    },

    // Details Sets
    setSelectedTestimonialId: (state, action: PayloadAction<string>) => {
      state.details.id = action.payload;
    },

    // Delete Sets
    setDeleteTestimonialId: (state, action: PayloadAction<string>) => {
      state.delete.id = action.payload;
    },

    // Clears
    clearCreateTestimonial: (state) => {
      state.create = { ...createTestimonialInitialState };
    },
    clearUpdateTestimonial: (state) => {
      state.update.id = undefined;
      state.update.data = { ...updateTestimonialInitialState };
    },
    clearSearchTestimonial: (state) => {
      state.search = { ...searchTestimonialInitialState };
    },
    clearSelectedTestimonialId: (state) => {
      state.details.id = undefined;
    },
    clearDeleteTestimonialId: (state) => {
      state.delete.id = undefined;
    },
  },
});

export const {
  setCreateTestimonialField,
  setCreateTestimonial,
  setUpdateTestimonialId,
  setUpdateTestimonialField,
  setUpdateTestimonial,
  setSearchTestimonialField,
  setSearchTestimonial,
  setSelectedTestimonialId,
  setDeleteTestimonialId,
  
  clearCreateTestimonial,
  clearUpdateTestimonial,
  clearSearchTestimonial,
  clearSelectedTestimonialId,
  clearDeleteTestimonialId,
} = testimonialSlice.actions;

export default testimonialSlice.reducer;

