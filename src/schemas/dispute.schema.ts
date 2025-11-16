import z from "zod";
import {BasicSearchQuerySchema, IdRequestSchema} from "./common.schema.ts";
import {
  AttachmentTypeEnum,
  DisputePriorityEnum,
  DisputeResolutionEnum,
  DisputeStatusEnum,
} from "./enum.schema.ts";

export const attachmentTypes = z.object({
  url: z.string().url().describe("The URL of the attachment."),
  type: AttachmentTypeEnum.describe("The type of the attachment."),
  filename: z.string().describe("The filename of the attachment."),
  size: z.number().min(0).describe("The size of the attachment in bytes."),
  mimeType: z.string().describe("The MIME type of the attachment."),
  uploadedAt: z.coerce.date().describe("The date and time when the attachment was uploaded."),
  metadata: z.record(z.any()).optional().describe("Optional metadata for the attachment."),
})

export const CreateDisputeRequestSchema = z.object({
  reason: z.string().min(10).max(2000).describe("The reason for creating the dispute."),
  sessionId: z.coerce.string().max(100, { message: "Session ID must be at most 100 characters long." }).describe("The session ID associated with the transaction to be disputed."),
  attachments: z.array(attachmentTypes).max(5).optional().describe("Optional list of attachments related to the dispute."),
});

export const UserSendDisputeMessageRequestSchema = IdRequestSchema.extend({
  message: z.string().min(1).max(5000).describe("The content of the dispute message."),
  attachments: z.array(attachmentTypes).max(5).optional().describe("Optional list of attachments for the dispute message."),
});

export const AdminSearchDisputesRequestSchema = BasicSearchQuerySchema.extend({
  transactionId: z.string().uuid().optional().describe("Filter disputes by the associated transaction ID."),
  createdBy: z.string().uuid().optional().describe("Filter disputes by the ID of the user who created them."),
  resolvedBy: z.string().uuid().optional().describe("Filter disputes by the ID of the admin who resolved them."),
  disputeReason: z.string().max(2000).optional().describe("Filter disputes by their reason."),
  status: DisputeStatusEnum.optional().describe("Filter disputes by their status."),
  resolution: DisputeResolutionEnum.optional().describe("Filter disputes by their resolution."),
  priority: DisputePriorityEnum.optional().describe("Filter disputes by their priority."),
})

export type CreateDisputeRequestType = z.infer<typeof CreateDisputeRequestSchema>;
export type UserSendDisputeMessageRequestType = z.infer<typeof UserSendDisputeMessageRequestSchema>;
export type AdminSearchDisputesRequestType = z.infer<typeof AdminSearchDisputesRequestSchema>;