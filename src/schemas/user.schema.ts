import z from 'zod'
import {
  BasicSearchQuerySchema,
  EmailSchema,
  IsoDateStringSchema,
  PasswordSchema,
} from './common.schema'
import {UserStatus} from "./enum.schema";

export const UserSignupRequestSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  firstName: z.coerce.string().min(2).max(50),
  lastName: z.coerce.string().min(2).max(50),
  phone: z.coerce.string().min(10).max(15).optional(),
  dob: IsoDateStringSchema.optional(),
  address: z.coerce.string().max(255).optional(),
  city: z.coerce.string().max(255).optional(),
  state: z.coerce.string().max(255).optional(),
  country: z.coerce.string().max(255).optional(),
  zipCode: z.coerce.string().max(20).optional(),
});

export const PasswordResetUpdateRequestSchema = z.object({
  token: z.coerce.string(),
  password: PasswordSchema,
  confirmPassword: PasswordSchema,
});

export const AdminSearchUserRequestSchema = BasicSearchQuerySchema.extend({
  email: z.coerce.string().max(255).optional().describe("Email address"),
  status: UserStatus.optional().describe("User account status"),
  hasDispute: z.coerce.boolean().optional().describe("Filter users who have disputes"),
  name: z.coerce.string().max(100).optional().describe("First or last name"),
  lastLoginFrom: IsoDateStringSchema.optional().describe("Filter users with last login from this date (inclusive)"),
  lastLoginTo: IsoDateStringSchema.optional().describe("Filter users with last login to this date (inclusive)"),
  isVerified: z.coerce.boolean().default(true).optional().describe("Filter users by verification status"),
  
  // Include Sums
  includeTradeVolume: z.coerce.boolean().default(false).optional().describe("Include total trade volume"),
  includeTradeVolumeInUSD: z.coerce.boolean().default(false).optional().describe("Include total trade volume in USD"),
  includeTradeCount: z.coerce.boolean().default(false).optional().describe("Include total trade count"),
  includeDisputeCount: z.coerce.boolean().default(false).optional().describe("Include total dispute count"),
  
  // Include related entities
  includeProfile: z.coerce.boolean().default(false).optional().describe("Include user profile information"),
  includeBankDetails: z.coerce.boolean().default(false).optional().describe("Include user bank details"),
  includeCryptoWallets: z.coerce.boolean().default(false).optional().describe("Include user crypto wallets"),
  includeTransactions: z.coerce.boolean().default(false).optional().describe("Include user transactions"),
  includeNotifications: z.coerce.boolean().default(false).optional().describe("Include user notifications"),
})

export type UserSignupRequestType = z.infer<typeof UserSignupRequestSchema>;
export type PasswordResetUpdateRequestType = z.infer<typeof PasswordResetUpdateRequestSchema>;
export type AdminSearchUserRequestType = z.infer<typeof AdminSearchUserRequestSchema>;
