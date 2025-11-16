import type { AdminSearchUserRequestType } from "../../schemas/user.schema";

export const adminSearchUsersInitialState: AdminSearchUserRequestType = {
  // Common Search Fields
  id: undefined,
  searchField: undefined,
  searchQuery: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  createdAtFrom: undefined,
  createdAtTo: undefined,

  email: undefined,
  status: undefined,
  hasDispute: undefined,
  name: undefined,
  lastLoginFrom: undefined,
  lastLoginTo: undefined,
  isVerified: undefined,

  // Include Relations
  includeProfile: true,
  includeBankDetails: undefined,
  includeCryptoWallets: undefined,
  includeTransactions: false,
  includeNotifications: false,

  // Include Sums
  includeTradeVolume: true,
  includeTradeVolumeInUSD: true,
  includeTradeCount: false,
  includeDisputeCount: false,

  // BasicSearchQuerySchema fields
  page: 1,
  size: 10,
  sortModel: {
    colId: 'createdAt',
    orderBy: 'DESC',
  }
}