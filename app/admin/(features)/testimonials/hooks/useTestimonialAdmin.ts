import { create } from "zustand";
import * as testimonialApi from "../api/testimonialApi";
import { Testimonial } from "../api/testimonialApi";

export type FieldErrors = Partial<Record<"name" | "rating" | "review" | "avatar" | "general", string>>;

const extractFieldErrors = (err: any): FieldErrors => {
  const data = err?.response?.data;
  if (data?.errors && typeof data.errors === "object") {
    return data.errors as FieldErrors;
  }
  return {};
};

interface TestimonialAdminState {
  testimonials: Testimonial[];
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  fieldErrors: FieldErrors;
  successMessage: string | null;

  fetchTestimonials: (page?: number) => Promise<void>;
  createTestimonial: (formData: FormData) => Promise<void>;
  updateTestimonial: (id: string, formData: FormData) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  clearStatus: () => void;
}

export const useTestimonialAdminStore = create<TestimonialAdminState>((set, get) => ({
  testimonials: [],
  totalPages: 1,
  currentPage: 1,
  loading: false,
  error: null,
  fieldErrors: {},
  successMessage: null,

  fetchTestimonials: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await testimonialApi.getAllTestimonials(page, 15);
      set({ 
        testimonials: response.testimonials,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        loading: false 
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch testimonials", loading: false });
    }
  },

  createTestimonial: async (formData: FormData) => {
    set({ loading: true, error: null, fieldErrors: {}, successMessage: null });
    try {
      await testimonialApi.createTestimonial(formData);
      await get().fetchTestimonials(get().currentPage);
      set({ loading: false, successMessage: "Testimonial created successfully!" });
    } catch (err: any) {
      const fieldErrors = extractFieldErrors(err);
      const hasFieldErrors = Object.keys(fieldErrors).length > 0;
      const message = hasFieldErrors ? null : (err.response?.data?.message || "Failed to create testimonial");
      set({ error: message, fieldErrors, loading: false });
    }
  },

  updateTestimonial: async (id: string, formData: FormData) => {
    set({ loading: true, error: null, fieldErrors: {}, successMessage: null });
    try {
      await testimonialApi.updateTestimonial(id, formData);
      await get().fetchTestimonials(get().currentPage);
      set({ loading: false, successMessage: "Testimonial updated successfully!" });
    } catch (err: any) {
      const fieldErrors = extractFieldErrors(err);
      const hasFieldErrors = Object.keys(fieldErrors).length > 0;
      const message = hasFieldErrors ? null : (err.response?.data?.message || "Failed to update testimonial");
      set({ error: message, fieldErrors, loading: false });
    }
  },

  deleteTestimonial: async (id: string) => {
    set({ loading: true, error: null, fieldErrors: {}, successMessage: null });
    try {
      await testimonialApi.deleteTestimonial(id);
      await get().fetchTestimonials(get().currentPage);
      set({ loading: false, successMessage: "Testimonial deleted successfully!" });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to delete testimonial", loading: false });
    }
  },

  clearStatus: () => set({ error: null, fieldErrors: {}, successMessage: null }),
}));

export const useTestimonialAdmin = () => {
  const store = useTestimonialAdminStore();
  return store;
};
