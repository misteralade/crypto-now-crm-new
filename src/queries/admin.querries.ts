import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import { useMatchRoute } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import {toast} from "react-toastify";
import { ROUTES } from '../util/constants.util.ts'
import { adminServiceApi } from "../api/admin.api";
import { store} from "../store";
import { QUERY_KEYS } from './querries.keys.js'
import type {RootState} from "../store";
import type {AxiosServerError} from "../types/response.payload.types";

export const useAdminQuery = () => {
  const queryClient = useQueryClient();
  const matchRoute = useMatchRoute();
  const searchAdmin = useSelector((state: RootState) => state.admin.search.admin);

  const { data: allPermissions, isLoading: loadingAllPermissions } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN.GET_ALL_ADMIN_PERMISSIONS],
    queryFn: async () => {
      const { data, success } = await adminServiceApi.getAllPermissions();

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!(matchRoute({ to: ROUTES.MANAGE_ADMINS })),
  });

  const { data: allRoles, isLoading: loadingAllRoles } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN.GET_ALL_ADMIN_ROLES],
    queryFn: async () => {
      const { data, success } = await adminServiceApi.getAllRoles();

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!(matchRoute({ to: ROUTES.MANAGE_ADMINS })),
  });

  const { data: searchedAdmins, isLoading: loadingSearchedAdmins } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN.SEARCH_ADMINS, searchAdmin],
    queryFn: async () => {
      const { data, success } = await adminServiceApi.searchAdmin(searchAdmin);

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!(matchRoute({ to: ROUTES.MANAGE_ADMINS }) && searchAdmin),
  });

  const createRoleMutation = useMutation({
    mutationKey: [QUERY_KEYS.ADMIN.CREATE_NEW_ROLE],
    mutationFn: async () => {
      const payload = (store.getState() as RootState).admin.create.role;

      const { message, success } = await adminServiceApi.adminCreateNewRole(payload);
      return { message, success };
    },
    onSuccess: ({ message, success }) => {
      toast.dismiss();
      toast.success(message || "Successfully Created new Role");
      return success;
    },
    onError: (error: AxiosServerError) => {
      toast.dismiss()
      const { data } = error.response as { data: { error: { message: string } } };
      toast.error(`Failed to create new Role: ${data.error.message}`)
    },
  });

  const createAdminMutation = useMutation({
    mutationKey: [QUERY_KEYS.ADMIN.CREATE_NEW_ADMIN],
    mutationFn: async () => {
      toast.loading(`Creating new Admin...`, { toastId: QUERY_KEYS.ADMIN.CREATE_NEW_ADMIN });
      const payload = (store.getState() as RootState).admin.create.admin;

      const { message, success } = await adminServiceApi.createAdmin(payload);
      return { message, success };
    },
    onSuccess: ({ message, success }) => {
      toast.dismiss();
      toast.success(message || "Successfully Created new Admin");
      return success;
    },
    onError: (error: AxiosServerError) => {
      toast.dismiss()
      const { data } = error.response as { data: { error: { message: string } } };
      toast.error(`Failed to create new Admin: ${data.error.message}`)
    },
  });
  
  const updateAdminActiveStatusMutation = useMutation({
    mutationKey: [QUERY_KEYS.ADMIN.UPDATE_ADMIN_ACTIVE_STATUS],
    mutationFn: async () => {
      toast.loading(`Updating Admin Status...`, { toastId: QUERY_KEYS.ADMIN.UPDATE_ADMIN_ACTIVE_STATUS });
      
      const { id, active } = (store.getState() as RootState).admin.update.admin

      const { message, success } = await adminServiceApi.updateAdminActiveStatus(id as string, active as boolean);
      return { message, success };
    },
    onSuccess: ({ message, success }) => {
      toast.dismiss();
      toast.success(message || "Successfully Updated Admin Status");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN.SEARCH_ADMINS] });
      return success;
    },
    onError: (error: AxiosServerError) => {
      toast.dismiss()
      const { data } = error.response as { data: { error: { message: string } } };
      toast.error(`Failed to update Admin Status: ${data.error.message}`)
    }
  });
  
  const adminSoftDeleteAdminMutation = useMutation({
    mutationKey: [QUERY_KEYS.ADMIN.SOFT_DELETE_ADMIN],
    mutationFn: async () => {
      toast.loading(`Deleting Admin...`, { toastId: QUERY_KEYS.ADMIN.SOFT_DELETE_ADMIN });
      
      const adminId = (store.getState() as RootState).admin.delete.adminId;
      
      if (!adminId) {
        throw new Error("Admin ID is required to delete an admin.");
      }
      
      const { message, success } = await adminServiceApi.adminSoftDeleteAdmin(adminId);
      return { message, success };
    },
    onSuccess: ({ message, success }) => {
      toast.dismiss();
      toast.success(message || "Successfully Deleted Admin");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN.SEARCH_ADMINS] });
      return success;
    },
    onError: (error: AxiosServerError) => {
      toast.dismiss()
      const { data } = error.response as { data: { error: { message: string } } };
      toast.error(`Failed to delete Admin: ${data.error.message}`)
    }
  });

  return {
    // 🧩 Values
    allPermissions,
    loadingAllPermissions,
    allRoles,
    loadingAllRoles,
    searchedAdmins,
    loadingSearchedAdmins,

    // Mutations
    createRoleMutation,
    createAdminMutation,
    updateAdminActiveStatusMutation,
    adminSoftDeleteAdminMutation,
  };
};
