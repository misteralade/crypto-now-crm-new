import {z} from "zod";
import { BasicSearchQuerySchema } from './common.schema'
import { RequestTypeEnum, UserTypeEnum } from './enum.schema'

export const SearchAuditLogsRequestSchema = BasicSearchQuerySchema.extend({
  userId: z.string().uuid().optional(),
  method: RequestTypeEnum.optional(),
  userType: UserTypeEnum.optional(),
  deviceType: z.coerce.string().optional(),
  success: z.coerce.boolean().optional(),
  
  // Includes Relations
  includeAdmin: z.coerce.boolean().optional().default(false),
  includeUser: z.coerce.boolean().optional().default(false),
})

export type SearchAuditLogsRequestType = z.infer<typeof SearchAuditLogsRequestSchema>;
