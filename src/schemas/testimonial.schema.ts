import { z } from "zod";
import { BasicSearchQuerySchema } from "./common.schema";

const TestimonialContentTypeSchema = z.preprocess((val) => {
  if (typeof val === "string") return val.toUpperCase();
  return val;
}, z.enum(["VIDEO", "IMAGE", "TEXT"]));

export const CreateTestimonialRequestSchema = z.object({
  contentLink: z.coerce.string()
    .min(1, { message: "Content link is required" })
    .max(500, { message: "Content link must be at most 500 characters" })
    .url({ message: "Content link must be a valid URL" }),
  name: z.coerce.string()
    .max(200, { message: "Name must be at most 200 characters" })
    .optional(),
  description: z.coerce.string()
    .max(1000, { message: "Description must be at most 1000 characters" })
    .optional(),
  contentType: TestimonialContentTypeSchema.default("VIDEO"),
  isPublished: z.coerce.boolean().optional().default(false),
});

export const UpdateTestimonialRequestSchema = z.object({
  contentLink: z.coerce.string()
    .min(1, { message: "Content link is required" })
    .max(500, { message: "Content link must be at most 500 characters" })
    .url({ message: "Content link must be a valid URL" })
    .optional(),
  name: z.coerce.string()
    .max(200, { message: "Name must be at most 200 characters" })
    .optional(),
  description: z.coerce.string()
    .max(1000, { message: "Description must be at most 1000 characters" })
    .optional(),
  contentType: TestimonialContentTypeSchema.optional(),
  isPublished: z.coerce.boolean().optional(),
});

export const GetTestimonialsQuerySchema = BasicSearchQuerySchema.extend({
  isPublished: z.coerce.boolean().optional(),
  contentType: TestimonialContentTypeSchema.optional(),
  name: z.coerce.string()
    .max(200, { message: "Name must be at most 200 characters" })
    .optional(),
  description: z.coerce.string()
    .max(1000, { message: "Description must be at most 1000 characters" })
    .optional(),
});

export type CreateTestimonialRequestType = z.infer<typeof CreateTestimonialRequestSchema>;
export type UpdateTestimonialRequestType = z.infer<typeof UpdateTestimonialRequestSchema>;
export type GetTestimonialsQueryType = z.infer<typeof GetTestimonialsQuerySchema>;
export type TestimonialContentType = z.infer<typeof TestimonialContentTypeSchema>;

