import { z } from "zod";
import {emailRegex, passwordRegex} from '../util/regex'
import momentClient from '../util/moment'
import {TimelineEnumType} from "./enum.schema";


export const EmailSchema = z.coerce
  .string()
  .min(5, "Email must be at least 5 characters long")
  .max(150, "Email must not exceed 150 characters")
  .regex(
    emailRegex,
    "Please enter a valid email address",
  )
  .refine(
    (email) => {
      const parts = email.split("@");
      if (parts.length !== 2) return false;

      const [local, domain] = parts;

      if (local.length > 64) return false;
      if (/[.]{2,}/.test(local)) return false; // No consecutive dots
      if (/^[.]|[.]$/.test(local)) return false; // Cannot start or end with dot

      // Domain validation
      if (domain.length > 253) return false;
      if (/[.]{2,}/.test(domain)) return false; // No consecutive dots
      if (/^[.]|[.]$/.test(domain)) return false; // Cannot start or end with dot

      return true;
    },
    { message: "Invalid email address" },
  )
  .transform((email) => email.toLowerCase());

export const PasswordSchema = z.coerce.string()
  .min(5, "Password must be at least 5 characters long")
  .max(128, "Password must not exceed 128 characters")
  .regex(passwordRegex, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
  .refine((password) => {
    // Disallow spaces in the password
    return !/\s/.test(password);
  })

export const IsoDateStringSchema = z.coerce
  .string()
  .refine(
    (value) => {
      // Try to parse the date and check if it's valid
      const date = new Date(value);
      return !isNaN(date.getTime());
    },
    {
      message: 'Invalid date format',
    }
  )
  .transform((value) => {
    return momentClient.toISOStringFromDate(new Date(value))
  });

export const AuthenticationRequestSchema = z.object({
  email: EmailSchema,
  password: z.string().min(8).max(128),
  rememberMe: z.boolean().optional(),
});

export const IdRequestSchema = z.object({
  id: z.coerce.string().uuid(),
})

export const OrderBySchema = z.object({
  orderBy: z.enum(["ASC", "DESC"]).optional().default("DESC"),
  colId: z.string().optional().default("createdAt"),
});

export const GeneralFilterRequestSchema = z.object({
  timeline: TimelineEnumType.optional().default("WEEK"),
});

export const BasicSearchQuerySchema = z.object({
  id: z.coerce.string().uuid().optional(),
  sortModel: OrderBySchema.optional().describe("Sorting model for the results"),
  searchQuery: z.string().max(100).optional().describe("The text to search for"),
  searchField: z.string().max(50).optional().describe("The specific field to search within"),
  page: z.coerce.number().min(1).default(1).optional().describe("The page number to return"),
  size: z.coerce.number().min(1).max(100).default(10).optional().describe("The number of items to return per page"),
  createdAt: IsoDateStringSchema.optional().describe("Filter by creation date (ISO 8601 format)"),
  updatedAt: IsoDateStringSchema.optional().describe("Filter by update date (ISO 8601 format)"),
  createdAtFrom: IsoDateStringSchema.optional().describe("Filter results created after this date (ISO 8601 format)"),
  createdAtTo: IsoDateStringSchema.optional().describe("Filter results created after this date"),
})

export type AuthenticationRequestSchema = z.infer<typeof AuthenticationRequestSchema>;
export type IdRequestSchema = z.infer<typeof IdRequestSchema>;
