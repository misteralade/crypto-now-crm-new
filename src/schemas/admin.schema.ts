import z from 'zod'
import { BasicSearchQuerySchema, EmailSchema } from './common.schema'

export const CreateNewRoleRequestSchema = z.object({
  permissionIds: z.array(z.string().uuid()).min(1, "At least one role ID must be provided"),
  name: z.string().min(3, "Role name must be at least 3 characters long").max(100, "Role name must be at most 50 characters long"),
  description: z.string().max(255, "Description must be at most 255 characters long").optional(),
})

export const CreateNewAdminRequestSchema = z.object({
  email: EmailSchema.describe(`Invalid email address`),
  username: z.string().min(3, "Username must be at least 3 characters long").max(50, "Username must be at most 50 characters long"),
  firstName: z.string().min(1, "First name must be at least 1 character long").max(50, "First name must be at most 50 characters long"),
  lastName: z.string().min(1, "Last name must be at least 1 character long").max(50, "Last name must be at most 50 characters long"),
  roleId: z.string().uuid("Invalid role ID"),
  active: z.boolean().default(false),
});

export const SearchAdminRequestSchema = BasicSearchQuerySchema.extend({
  email: z.string().optional(),
  username: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  roleId: z.string().uuid("Invalid role ID").optional(),
  active: z.boolean().optional(),

  // Relations
  includeRole: z.boolean().default(false),
});

export type CreateNewRoleRequestType = z.infer<typeof CreateNewRoleRequestSchema>;
export type CreateNewAdminRequestType = z.infer<typeof CreateNewAdminRequestSchema>;
export type SearchAdminRequestType = z.infer<typeof SearchAdminRequestSchema>;
