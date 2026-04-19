import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sweepServiceApi, type SweepHistoryParams, type SweepPreviewParams, type InitiateSweepParams } from '../api/sweep.api.js';
import { QUERY_KEYS } from './querries.keys.js';
import { toast } from 'react-toastify';

const TERMINAL_STATUSES = ['COMPLETED', 'FAILED', 'PARTIAL'];

export const useSweepQuery = () => {
  const queryClient = useQueryClient();

  // ─── Preview (dry-run) ────────────────────────────────────────────────────────
  const useSweepPreview = (params: SweepPreviewParams | null) => {
    return useQuery({
      queryKey: [QUERY_KEYS.SWEEP.PREVIEW, params],
      queryFn: async () => {
        const { data, success, message } = await sweepServiceApi.previewSweep(params!);
        if (!success) throw new Error(message);
        return data;
      },
      enabled: !!params?.cryptocurrencyId && !!params?.network,
      staleTime: 30_000,
      retry: 1,
    });
  };

  // ─── History ─────────────────────────────────────────────────────────────────
  const useSweepHistory = (params?: SweepHistoryParams) => {
    return useQuery({
      queryKey: [QUERY_KEYS.SWEEP.HISTORY, params],
      queryFn: async () => {
        const { data, success, message } = await sweepServiceApi.getSweepHistory(params);
        if (!success) throw new Error(message);
        return data;
      },
      staleTime: 15_000,
    });
  };

  // ─── Single sweep status (polling) ───────────────────────────────────────────
  const useSweepStatus = (sweepId: string | undefined) => {
    return useQuery({
      queryKey: [QUERY_KEYS.SWEEP.BY_ID, sweepId],
      queryFn: async () => {
        const { data, success, message } = await sweepServiceApi.getSweepById(sweepId!);
        if (!success) throw new Error(message);
        return data;
      },
      enabled: !!sweepId,
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        if (!status || TERMINAL_STATUSES.includes(status)) return false;
        return 3000; // Poll every 3s while IN_PROGRESS / PENDING
      },
    });
  };

  // ─── Initiate Sweep Mutation ──────────────────────────────────────────────────
  const initiateSweepMutation = useMutation({
    mutationKey: [QUERY_KEYS.SWEEP.INITIATE],
    mutationFn: async (params: InitiateSweepParams) => {
      return await sweepServiceApi.initiateSweep(params);
    },
    onSuccess: ({ success, message }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SWEEP.HISTORY] });
      } else {
        toast.error(message);
      }
    },
    onError: () => {
      toast.error('Failed to initiate sweep. Please try again.');
    },
  });

  return {
    useSweepPreview,
    useSweepHistory,
    useSweepStatus,
    initiateSweepMutation,
  };
};
