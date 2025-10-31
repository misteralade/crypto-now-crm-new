import { z } from "zod";
import {BankAndCryptoType} from './enum.schema'

export const CreateBankAccountRequestSchema = z.object({
  bankId: z.coerce.string().uuid({ message: "Invalid bank ID format" }),
  label: z.coerce.string().min(1, { message: "Label is required" }).max(100, { message: "Label must be at most 100 characters" }).optional(),
  accountNumber: z.coerce.string().min(1, { message: "Account number is required" }).max(50, { message: "Account number must be at most 50 characters" }),
  accountHolderName: z.coerce.string().min(1, { message: "Account holder name is required" }).max(100, { message: "Account holder name must be at most 100 characters" }),
  accountType: BankAndCryptoType.default("BOTH"),
  isActive: z.coerce.boolean().optional().default(true),
  isDefault: z.coerce.boolean().optional().default(false),
  instructions: z.coerce.string().max(1500).optional(),
});

export type CreateBankAccountRequestType = z.infer<typeof CreateBankAccountRequestSchema>;