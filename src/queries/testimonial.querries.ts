import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMatchRoute } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ROUTES } from '../util/constants.util';
import { testimonialServiceApi } from "../api/testimonial.api";
import { store } from "../store";
import { QUERY_KEYS } from './querries.keys';
import type { RootState } from "../store";
import type { AxiosServerError } from "../types/response.payload.types";

export const useTestimonialQuery = () => {
  const queryClient = useQueryClient();
  const matchRoute = useMatchRoute();
  const searchTestimonial = useSelector((state: RootState) => state.testimonial.search);
  const selectedTestimonialId = useSelector((state: RootState) => state.testimonial.details.id);

  const { data: testimonials, isLoading: loadingTestimonials, refetch: refetchTestimonials } = useQuery({
    queryKey: [QUERY_KEYS.TESTIMONIAL.GET_TESTIMONIALS, searchTestimonial],
    queryFn: async () => {
      const { data, success } = await testimonialServiceApi.getTestimonials(searchTestimonial);

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!(matchRoute({ to: ROUTES.TESTIMONIALS })),
  });

  const { data: testimonialDetails, isLoading: loadingTestimonialDetails } = useQuery({
    queryKey: [QUERY_KEYS.TESTIMONIAL.GET_TESTIMONIAL_DETAILS, selectedTestimonialId],
    queryFn: async () => {
      if (!selectedTestimonialId) return null;
      
      const { data, success } = await testimonialServiceApi.getTestimonialDetails(selectedTestimonialId);

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!selectedTestimonialId,
  });

  const createTestimonialMutation = useMutation({
    mutationKey: [QUERY_KEYS.TESTIMONIAL.CREATE_TESTIMONIAL],
    mutationFn: async () => {
      toast.loading(`Creating testimonial...`, { toastId: QUERY_KEYS.TESTIMONIAL.CREATE_TESTIMONIAL });
      const payload = (store.getState() as RootState).testimonial.create;

      const { message, success } = await testimonialServiceApi.createTestimonial(payload);
      return { message, success };
    },
    onSuccess: ({ message }) => {
      toast.dismiss();
      toast.success(message || "Successfully created testimonial");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TESTIMONIAL.GET_TESTIMONIALS] });
    },
    onError: (error: AxiosServerError) => {
      toast.dismiss();
      const { data } = error.response as { data: { error: { message: string } } };
      toast.error(`Failed to create testimonial: ${data.error.message}`);
    },
  });

  const updateTestimonialMutation = useMutation({
    mutationKey: [QUERY_KEYS.TESTIMONIAL.UPDATE_TESTIMONIAL],
    mutationFn: async () => {
      toast.loading(`Updating testimonial...`, { toastId: QUERY_KEYS.TESTIMONIAL.UPDATE_TESTIMONIAL });
      const { id, data: payload } = (store.getState() as RootState).testimonial.update;

      if (!id) {
        throw new Error("Testimonial ID is required to update a testimonial.");
      }

      const { message, success } = await testimonialServiceApi.updateTestimonial(id, payload);
      return { message, success };
    },
    onSuccess: ({ message }) => {
      toast.dismiss();
      toast.success(message || "Successfully updated testimonial");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TESTIMONIAL.GET_TESTIMONIALS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TESTIMONIAL.GET_TESTIMONIAL_DETAILS] });
    },
    onError: (error: AxiosServerError) => {
      toast.dismiss();
      const { data } = error.response as { data: { error: { message: string } } };
      toast.error(`Failed to update testimonial: ${data.error.message}`);
    },
  });

  const deleteTestimonialMutation = useMutation({
    mutationKey: [QUERY_KEYS.TESTIMONIAL.DELETE_TESTIMONIAL],
    mutationFn: async () => {
      toast.loading(`Deleting testimonial...`, { toastId: QUERY_KEYS.TESTIMONIAL.DELETE_TESTIMONIAL });
      const testimonialId = (store.getState() as RootState).testimonial.delete.id;

      if (!testimonialId) {
        throw new Error("Testimonial ID is required to delete a testimonial.");
      }

      const { message, success } = await testimonialServiceApi.deleteTestimonial(testimonialId);
      return { message, success };
    },
    onSuccess: ({ message }) => {
      toast.dismiss();
      toast.success(message || "Successfully deleted testimonial");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TESTIMONIAL.GET_TESTIMONIALS] });
    },
    onError: (error: AxiosServerError) => {
      toast.dismiss();
      const { data } = error.response as { data: { error: { message: string } } };
      toast.error(`Failed to delete testimonial: ${data.error.message}`);
    },
  });

  const togglePublishStatusMutation = useMutation({
    mutationKey: [QUERY_KEYS.TESTIMONIAL.TOGGLE_PUBLISH_STATUS],
    mutationFn: async ({ id }: { id: string }) => {
      toast.loading(`Toggling publish status...`, { 
        toastId: QUERY_KEYS.TESTIMONIAL.TOGGLE_PUBLISH_STATUS 
      });

      const { message, success } = await testimonialServiceApi.togglePublishStatus(id);
      return { message, success };
    },
    onSuccess: ({ message }) => {
      toast.dismiss();
      toast.success(message || "Successfully updated publish status");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TESTIMONIAL.GET_TESTIMONIALS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TESTIMONIAL.GET_TESTIMONIAL_DETAILS] });
    },
    onError: (error: AxiosServerError) => {
      toast.dismiss();
      const { data } = error.response as { data: { error: { message: string } } };
      toast.error(`Failed to update publish status: ${data.error.message}`);
    },
  });

  return {
    // 🧩 Values
    testimonials,
    loadingTestimonials,
    testimonialDetails,
    loadingTestimonialDetails,

    // Mutations
    createTestimonialMutation,
    updateTestimonialMutation,
    deleteTestimonialMutation,
    togglePublishStatusMutation,
    
    // Refetch
    refetchTestimonials,
  };
};

