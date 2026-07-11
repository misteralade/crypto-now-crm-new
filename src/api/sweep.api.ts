import {
  axiosGetRequestHandler,
  axiosPostRequestHandler,
} from './index.js';
import type { BaseApiResponse } from '../types/response.payload.types.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SweepStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'PARTIAL';

export interface SweepPreviewData {
  cryptocurrencyId: string;
  network: string;
  blockchainEnvironment: string;
  targetAdminWallet: { id: string; address: string };
  totalWallets: number;
  estimatedAmount: number;
  liveBalanceAmount: number;
  estimatedSweepableAmount: number;
  estimatedFeeAmount: number;
  feeAssetSymbol: string;
  feeHandling: 'deducted_from_swept_asset' | 'paid_from_source_native_balance';
  walletsSweepable: number;
  walletsBlockedByFee: number;
  walletsWithoutSpendableBalance: number;
  walletsMissingSweepSetup: number;
  walletsSkippedBelowThreshold: number;
  filteredToSpecific: boolean;
  /** ISO timestamp of the oldest cached balance across the eligible wallets */
  oldestRefreshedAt: string | null;
  /** Number of wallets in this scope that have never been reconciled from chain */
  neverRefreshedCount: number;
  /**
   * Present only when feeHandling is paid_from_source_native_balance (ERC20/TRC20).
   * Tells you directly whether the platform's fueling wallet can cover gas for this sweep.
   */
  fuelingWalletStatus: {
    address: string;
    balance: number;
    requiredEstimate: number;
    sufficient: boolean;
  } | null;
}

// Per-asset row driving the Treasury summary grid.
export interface BalanceSummaryRow {
  cryptocurrencyId: string;
  network: string;
  symbol: string;
  name: string;
  walletCount: number;
  totalBalance: number;
  oldestRefreshedAt: string | null;
  neverRefreshedCount: number;
}

// Result payload returned by POST /balances/refresh.
export interface RefreshBalancesResult {
  cryptocurrencyId: string;
  network: string;
  walletsConsidered: number;
  refreshed: number;
  failed: number;
  totalBalance: number;
  startedAt: string;
  completedAt: string;
}

export interface RefreshBalancesParams {
  cryptocurrencyId: string;
  network: string;
}

export interface SweepWalletResult {
  walletAddress: string;
  derivationPath: string;
  status: 'pending' | 'success' | 'failed' | 'skipped';
  balance?: number;
  amount: number;
  txHash: string | null;
  error: string | null;
  btcBatchIndex?: number;
  grossInputAmount?: number;
  allocatedFeeAmount?: number;
  inputCount?: number;
}

export interface SweepBatchSummary {
  batchIndex: number;
  walletCount: number;
  txHash: string | null;
  grossInputAmount: number;
  feeAmount: number;
  netAmount: number;
  inputCount: number;
}

export interface SweepRequest {
  id: string;
  cryptocurrencyId: string;
  network: string;
  blockchainEnvironment?: string;
  adminWalletId: string;
  initiatedBy: string;
  status: SweepStatus;
  totalWalletsFound: number;
  totalWalletsSwept: number;
  totalWalletsFailed: number;
  totalWalletsSkipped: number;
  estimatedTotalAmount: number;
  actualTotalAmount: number;
  targetAddress: string;
  sweepResults: SweepWalletResult[] | null;
  isBatchTransaction?: boolean;
  batchCount?: number;
  batchSummaries?: SweepBatchSummary[];
  failureReason: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  options?: {
    dustThresholdOverride?: number;
    targetWalletAddresses?: string[];
    note?: string;
    autoFuel?: boolean;
    maxTotalAmount?: number;
  } | null;
}

export interface SweepHistoryData {
  data: SweepRequest[];
  total: number;
  page: number;
  size: number;
}

export interface SweepPreviewParams {
  cryptocurrencyId: string;
  network: string;
  targetWalletAddresses?: string[];
  dustThresholdOverride?: number;
  maxTotalAmount?: number;
}

export interface InitiateSweepParams {
  cryptocurrencyId: string;
  network: string;
  options?: {
    dustThresholdOverride?: number;
    targetWalletAddresses?: string[];
    note?: string;
    /** Stop sweeping (largest wallets first) once cumulative cachedBalance reaches this cap */
    maxTotalAmount?: number;
  };
}

export interface SweepHistoryParams {
  page?: number;
  size?: number;
  cryptocurrencyId?: string;
  network?: string;
  status?: SweepStatus;
}

export interface RestartSweepResult {
  sweepId: string;
  restartedFromSweepId: string;
}

// ─── API Class ────────────────────────────────────────────────────────────────

class SweepServiceApi {
  private static instance: SweepServiceApi;

  private constructor() {}

  public static getInstance(): SweepServiceApi {
     
    if (!SweepServiceApi.instance) {
      SweepServiceApi.instance = new SweepServiceApi();
    }
    return SweepServiceApi.instance;
  }

  /** Sweep preview — returns cached totals plus live sweepability estimates */
  async previewSweep(params: SweepPreviewParams) {
    return await axiosPostRequestHandler('/sweep/admin/sweep/preview', params) as BaseApiResponse<SweepPreviewData>;
  }

  /** Initiate a real sweep — returns immediately with sweepId */
  async initiateSweep(params: InitiateSweepParams) {
    return await axiosPostRequestHandler('/sweep/admin/sweep/initiate', params) as BaseApiResponse<{ sweepId: string }>;
  }

  /** Restart a sweep using the persisted options from an existing run */
  async restartSweep(sweepId: string) {
    return await axiosPostRequestHandler(`/sweep/admin/sweep/${sweepId}/restart`, {}) as BaseApiResponse<RestartSweepResult>;
  }

  /** Poll real-time status of a specific sweep */
  async getSweepById(sweepId: string) {
    return await axiosGetRequestHandler(`/sweep/admin/sweep/${sweepId}`) as BaseApiResponse<SweepRequest>;
  }

  /** Paginated history of all sweep requests */
  async getSweepHistory(params?: SweepHistoryParams) {
    return await axiosGetRequestHandler('/sweep/admin/sweep/history', params) as BaseApiResponse<SweepHistoryData>;
  }

  /** Per-asset cached balance grid for the Treasury page (DB-only, fast) */
  async getBalanceSummary() {
    return await axiosGetRequestHandler('/sweep/admin/balances/summary') as BaseApiResponse<BalanceSummaryRow[]>;
  }

  /** Trigger an admin reconciliation of cached balances for one (crypto+network) pair */
  async refreshBalances(params: RefreshBalancesParams) {
    return await axiosPostRequestHandler('/sweep/admin/balances/refresh', params) as BaseApiResponse<RefreshBalancesResult>;
  }
}

export const sweepServiceApi = SweepServiceApi.getInstance();
