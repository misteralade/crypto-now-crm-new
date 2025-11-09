import type {AdminSearchDisputesRequestType} from "../../schemas/dispute.schema.ts";

export const searchDisputeInitialState: AdminSearchDisputesRequestType = {
  // Common Search Fields
  id: undefined,
  searchField: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  createdAtFrom: undefined,
  createdAtTo: undefined,
  
  // Specific Search Fields
  transactionId: undefined,
  createdBy: undefined,
  resolvedBy: undefined,
  disputeReason: undefined,
  status: undefined,
  resolution:undefined,
  priority: undefined,
  
  // BasicSearchQuerySchema fields
  page: 1,
  size: 10,
  sortModel: {
    colId: 'createdAt',
    orderBy: 'DESC',
  }
}