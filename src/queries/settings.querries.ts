import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { settingsServiceApi } from "../api/settings.api";
import { QUERY_KEYS } from "./querries.keys";

export const usePayoutAutoApprovalLimitQuery = () => {
  const queryClient = useQueryClient();

  const payoutAutoApprovalLimitQuery = useQuery({
    queryKey: [QUERY_KEYS.SETTINGS.PAYOUT_AUTO_APPROVAL_LIMIT],
    queryFn: async () => {
      const { data, success } = await settingsServiceApi.getPayoutAutoApprovalLimit();

      if (success) {
        return data;
      }

      return null;
    },
  });

  const updatePayoutAutoApprovalLimitMutation = useMutation({
    mutationKey: [QUERY_KEYS.SETTINGS.UPDATE_PAYOUT_AUTO_APPROVAL_LIMIT],
    mutationFn: async (thresholdNgn: number) => {
      toast.loading("Updating payout approval limit...");
      return await settingsServiceApi.updatePayoutAutoApprovalLimit(thresholdNgn);
    },
    onSuccess: ({ message }) => {
      toast.dismiss();
      toast.success(message || "Payout approval limit updated successfully.");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SETTINGS.PAYOUT_AUTO_APPROVAL_LIMIT],
      });
    },
    onError: (error: Error) => {
      toast.dismiss();
      toast.error(`Failed to update payout approval limit: ${error.message}`);
    },
  });

  return {
    payoutAutoApprovalLimitQuery,
    updatePayoutAutoApprovalLimitMutation,
  };
};
