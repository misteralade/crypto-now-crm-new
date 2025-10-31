import type { SearchAuditLogsRequestType } from "../../schemas/audit.schema";

export const searchAuditLogInitialState: SearchAuditLogsRequestType = {
  createdAt: undefined,
  createdAtFrom: undefined,
  createdAtTo: undefined,
  deviceType: undefined,
  id: undefined,
  includeAdmin: true,
  includeUser: true,
  method: undefined,
  page: 1,
  searchField: undefined,
  searchQuery: undefined,
  size: 10,
  sortModel: {
    colId: 'createdAt',
    orderBy: 'DESC',
  },
  success: undefined,
  updatedAt: undefined,
  userId: undefined,
  userType: undefined
};