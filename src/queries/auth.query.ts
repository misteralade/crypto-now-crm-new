import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authServiceApi } from "../api/auth.api";
import { QUERY_KEYS } from "./querries.keys";

export const useOwnAdminProfileQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.AUTH.GET_OWN_PROFILE],
    queryFn: async () => {
      const { data, success } = await authServiceApi.getOwnProfile();

      if (success) {
        return data;
      }

      return null;
    },
  });
};

export const useToggleTwoFactorAuthenticationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH.TOGGLE_TWO_FACTOR_AUTHENTICATION],
    mutationFn: async () => {
      toast.loading("Updating two-factor authentication...");
      return await authServiceApi.toggleTwoFactorAuthentication();
    },
    onSuccess: ({ success, message }) => {
      toast.dismiss();
      if (success) {
        toast.success(message || "Two-factor authentication updated successfully.");
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTH.GET_OWN_PROFILE] });
      } else {
        toast.error(message || "Failed to update two-factor authentication.");
      }
    },
    onError: (error: Error) => {
      toast.dismiss();
      toast.error(error.message || "Failed to update two-factor authentication.");
    },
  });
};

export const useVerifyTwoFactorCodeMutation = () => {
  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH.VERIFY_TWO_FACTOR_CODE],
    mutationFn: async (code: string) => {
      return await authServiceApi.verifyTwoFactorAuthenticationCode(code);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to verify your code.");
    },
  });
};

export const useResendTwoFactorCodeMutation = () => {
  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH.RESEND_TWO_FACTOR_CODE],
    mutationFn: async (email: string) => {
      toast.loading("Resending code...");
      return await authServiceApi.resendTwoFactorAuthenticationCode(email);
    },
    onSuccess: ({ success, message }) => {
      toast.dismiss();
      if (success) {
        toast.success(message || "Code resent successfully.");
      } else {
        toast.error(message || "Failed to resend code.");
      }
    },
    onError: (error: Error) => {
      toast.dismiss();
      toast.error(error.message || "Failed to resend code.");
    },
  });
};
