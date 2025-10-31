import z from 'zod'
import { BasicSearchQuerySchema } from './common.schema'
import { NotificationTypeEnum } from "./enum.schema";

export const SearchNotificationRequestSchema = BasicSearchQuerySchema.extend({
  userId: z.string().uuid().optional(),
  adminUserId: z.string().uuid().optional(),
  transactionId: z.string().uuid().optional(),
  title: z.string().min(1).max(255).optional(),
  message: z.string().min(1).max(1000).optional(),
  type: NotificationTypeEnum.optional(),

  // Include Relations
  includeUser: z.coerce.boolean().default(false).optional(),
  includeAdmin: z.coerce.boolean().default(false).optional(),
  includeTransaction: z.coerce.boolean().default(false).optional(),
});

export type SearchNotificationRequestType = z.infer<typeof SearchNotificationRequestSchema>;
