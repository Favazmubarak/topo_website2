import axiosInstance from "@/src/lib/axiosInstance";

export interface Testimonial {
  _id: string;
  name: string;
  avatar: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialsResponse {
  testimonials: Testimonial[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export const getAllTestimonials = async (page: number = 1, limit: number = 15): Promise<TestimonialsResponse> => {
  const response = await axiosInstance.get(`/testimonials?page=${page}&limit=${limit}`);
  return response.data;
};

export const createTestimonial = async (formData: FormData): Promise<Testimonial> => {
  const response = await axiosInstance.post("/testimonials", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateTestimonial = async (id: string, formData: FormData): Promise<Testimonial> => {
  const response = await axiosInstance.patch(`/testimonials/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/testimonials/${id}`);
};
