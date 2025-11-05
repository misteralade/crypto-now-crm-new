import type {SearchNotificationRequestType} from "../../schemas/notification.schema";

export const searchNotificationInitialState: SearchNotificationRequestType = {
  // Common Search Fields
  id: undefined,
  searchQuery: undefined,
  searchField: "message",
  createdAtFrom: undefined,
  createdAtTo: undefined,

  // Notification Specific Fields
  userId: undefined,
  adminUserId: undefined,
  transactionId: undefined,
  title: undefined,
  message: undefined,
  type: undefined,
  
  // Include Related Entities
  includeUser: false,
  includeAdmin: false,
  includeTransaction: true,

  // BasicSearchQuerySchema fields
  page: 1,
  size: 10,
  sortModel: {
    colId: 'createdAt',
    orderBy: 'DESC',
  }
};