import {
  axiosDeleteRequestHandler,
  axiosGetRequestHandler,
  axiosPatchRequestHandler,
  axiosPostRequestHandler
} from "./index";
import type {
  BaseApiResponse,
  GetTestimonialDetailsAPIResponse,
  GetTestimonialsAPIResponse
} from "../types/response.payload.types";
import type {
  CreateTestimonialRequestType,
  GetTestimonialsQueryType,
  UpdateTestimonialRequestType
} from "../schemas/testimonial.schema";

class TestimonialServiceApi {
  private static instance: TestimonialServiceApi;

  private constructor() {
  }

  public static getInstance(): TestimonialServiceApi {
     
    if (!TestimonialServiceApi.instance) {
      TestimonialServiceApi.instance = new TestimonialServiceApi();
    }
    return TestimonialServiceApi.instance;
  }

  async getTestimonials(payload: GetTestimonialsQueryType) {
    return await axiosGetRequestHandler("/testimonial/admin/all", payload) as GetTestimonialsAPIResponse;
  }

  async getTestimonialDetails(testimonialId: string) {
    return await axiosGetRequestHandler(`/testimonial/admin/${testimonialId}`) as GetTestimonialDetailsAPIResponse;
  }

  async createTestimonial(payload: CreateTestimonialRequestType) {
    return await axiosPostRequestHandler("/testimonial/admin/create", payload) as BaseApiResponse<null>;
  }

  async updateTestimonial(testimonialId: string, payload: UpdateTestimonialRequestType) {
    return await axiosPatchRequestHandler(`/testimonial/admin/${testimonialId}`, payload) as BaseApiResponse<null>;
  }

  async deleteTestimonial(testimonialId: string) {
    return await axiosDeleteRequestHandler(`/testimonial/admin/${testimonialId}`) as BaseApiResponse<null>;
  }

  async togglePublishStatus(testimonialId: string) {
    return await axiosPatchRequestHandler(`/testimonial/admin/${testimonialId}/toggle-publish`) as BaseApiResponse<null>;
  }
}

export const testimonialServiceApi = TestimonialServiceApi.getInstance();

