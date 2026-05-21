import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
  sweepServiceApi,
  type SweepHistoryParams,
  type SweepPreviewParams,
  type InitiateSweepParams,
  type RefreshBalancesParams,
} from '../api/sweep.api.js';
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

  // ─── History (Infinite) ──────────────────────────────────────────────────────
  const useSweepHistoryInfinite = (params?: Omit<SweepHistoryParams, 'page'>) => {
    return useInfiniteQuery({
      queryKey: [QUERY_KEYS.SWEEP.HISTORY, 'infinite', params],
      queryFn: async ({ pageParam = 1 }) => {
        const { data, success, message } = await sweepServiceApi.getSweepHistory({
          ...params,
          page: pageParam as number,
        });
        if (!success) throw new Error(message);
        return data;
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.page >= Math.ceil(lastPage.total / lastPage.size)) {
          return undefined;
        }
        return lastPage.page + 1;
      },
      initialPageParam: 1,
    });
  };

  // ─── History (Paginated) ─────────────────────────────────────────────────────
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

  // ─── Restart Sweep Mutation ─────────────────────────────────────────────────
  const restartSweepMutation = useMutation({
    mutationKey: [QUERY_KEYS.SWEEP.RESTART],
    mutationFn: async (sweepId: string) => {
      return await sweepServiceApi.restartSweep(sweepId);
    },
    onSuccess: ({ success, message }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SWEEP.HISTORY] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SWEEP.BY_ID] });
        toast.success(message || 'Sweep restarted');
      } else {
        toast.error(message);
      }
    },
    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : 'Failed to restart sweep';
      toast.error(msg);
    },
  });

  // ─── Cached Balance Summary (per-asset grid) ─────────────────────────────────
  const useBalanceSummary = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.SWEEP.BALANCE_SUMMARY],
      queryFn: async () => {
        const { data, success, message } = await sweepServiceApi.getBalanceSummary();
        if (!success) throw new Error(message);
        return data ?? [];
      },
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    });
  };

  // ─── Manual Balance Refresh Mutation ─────────────────────────────────────────
  const refreshBalancesMutation = useMutation({
    mutationKey: [QUERY_KEYS.SWEEP.BALANCE_REFRESH],
    mutationFn: async (params: RefreshBalancesParams) => {
      return await sweepServiceApi.refreshBalances(params);
    },
    onSuccess: ({ success, message }) => {
      if (success) {
        // Reflect new totals in the summary grid and the modal preview.
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SWEEP.BALANCE_SUMMARY] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SWEEP.PREVIEW] });
        toast.success(message || 'Balances refreshed');
      } else {
        toast.error(message);
      }
    },
    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : 'Failed to refresh balances';
      toast.error(msg);
    },
  });

  return {
    useSweepPreview,
    useSweepHistory,
    useSweepHistoryInfinite,
    useSweepStatus,
    initiateSweepMutation,
    restartSweepMutation,
    useBalanceSummary,
    refreshBalancesMutation,
  };
};
