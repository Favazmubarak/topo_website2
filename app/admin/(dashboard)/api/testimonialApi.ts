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

export const getAllTestimonials = async (): Promise<Testimonial[]> => {
  const response = await axiosInstance.get("/testimonials");
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
