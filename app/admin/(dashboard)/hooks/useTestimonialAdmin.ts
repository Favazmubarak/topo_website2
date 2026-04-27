import { create } from "zustand";
import * as testimonialApi from "../api/testimonialApi";
import { Testimonial } from "../api/testimonialApi";

interface TestimonialAdminState {
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  
  fetchTestimonials: () => Promise<void>;
  createTestimonial: (formData: FormData) => Promise<void>;
  updateTestimonial: (id: string, formData: FormData) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  clearStatus: () => void;
}

export const useTestimonialAdminStore = create<TestimonialAdminState>((set, get) => ({
  testimonials: [],
  loading: false,
  error: null,
  successMessage: null,

  fetchTestimonials: async () => {
    set({ loading: true, error: null });
    try {
      const testimonials = await testimonialApi.getAllTestimonials();
      set({ testimonials, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch testimonials", loading: false });
    }
  },

  createTestimonial: async (formData: FormData) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      await testimonialApi.createTestimonial(formData);
      await get().fetchTestimonials();
      set({ loading: false, successMessage: "Testimonial created successfully" });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to create testimonial", loading: false });
    }
  },

  updateTestimonial: async (id: string, formData: FormData) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      await testimonialApi.updateTestimonial(id, formData);
      await get().fetchTestimonials();
      set({ loading: false, successMessage: "Testimonial updated successfully" });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to update testimonial", loading: false });
    }
  },

  deleteTestimonial: async (id: string) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      await testimonialApi.deleteTestimonial(id);
      await get().fetchTestimonials();
      set({ loading: false, successMessage: "Testimonial deleted successfully" });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to delete testimonial", loading: false });
    }
  },

  clearStatus: () => set({ error: null, successMessage: null }),
}));

export const useTestimonialAdmin = () => {
  const store = useTestimonialAdminStore();
  return store;
};
