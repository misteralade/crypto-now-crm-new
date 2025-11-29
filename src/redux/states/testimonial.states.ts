import type {
  CreateTestimonialRequestType,
  GetTestimonialsQueryType,
  UpdateTestimonialRequestType,
} from "../../schemas/testimonial.schema";

export const createTestimonialInitialState: CreateTestimonialRequestType = {
  contentLink: "",
  name: undefined,
  description: undefined,
  contentType: "VIDEO",
  isPublished: false,
};

export const updateTestimonialInitialState: UpdateTestimonialRequestType = {
  contentLink: undefined,
  name: undefined,
  description: undefined,
  contentType: undefined,
  isPublished: undefined,
};

export const searchTestimonialInitialState: GetTestimonialsQueryType = {
  isPublished: undefined,
  contentType: undefined,
  name: undefined,
  description: undefined,
  
  // BasicSearchQuerySchema fields
  page: 1,
  size: 10,
};

