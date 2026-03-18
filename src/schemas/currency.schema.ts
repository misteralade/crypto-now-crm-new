import { z } from "zod";

export const CreateCurrencyRequestSchema = z.object({
  name: z.coerce.string()
    .min(1, { message: "Currency name is required" })
    .max(100, { message: "Currency name must be at most 100 characters" }),
  code: z.coerce.string()
    .min(1, { message: "Currency code is required" })
    .max(3, { message: "Currency code must be at most 3 characters" }),
  description: z.coerce.string()
    .max(500, { message: "Description must be at most 500 characters" })
    .optional(),
  isActive: z.coerce.boolean().default(true),
  logoUrl: z.coerce.string()
    .url({ message: "Logo URL must be a valid URL" })
    .optional()
    .or(z.literal('')),
  additionalInfo: z.record(z.string(), z.unknown()).optional().nullable(),
});

export const UpdateCurrencyRequestSchema = z.object({
  name: z.coerce.string()
    .min(1, { message: "Currency name is required" })
    .max(100, { message: "Currency name must be at most 100 characters" })
    .optional(),
  code: z.coerce.string()
    .min(1, { message: "Currency code is required" })
    .max(3, { message: "Currency code must be at most 3 characters" })
    .optional(),
  description: z.coerce.string()
    .max(500, { message: "Description must be at most 500 characters" })
    .optional(),
  isActive: z.coerce.boolean().optional(),
  logoUrl: z.coerce.string()
    .url({ message: "Logo URL must be a valid URL" })
    .optional()
    .or(z.literal('')),
  additionalInfo: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateCurrencyRequestType = z.infer<typeof CreateCurrencyRequestSchema>;
export type UpdateCurrencyRequestType = z.infer<typeof UpdateCurrencyRequestSchema>;
