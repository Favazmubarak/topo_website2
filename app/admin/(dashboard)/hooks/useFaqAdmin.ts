import { create } from "zustand";
import * as faqApi from "../api/faqApi";
import { FAQ } from "../api/faqApi";

interface FAQAdminState {
  faqs: FAQ[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  
  fetchFAQs: () => Promise<void>;
  createFAQ: (faqData: { question: string; answer: string }) => Promise<void>;
  updateFAQ: (id: string, faqData: { question: string; answer: string }) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;
  clearStatus: () => void;
}

export const useFAQAdminStore = create<FAQAdminState>((set, get) => ({
  faqs: [],
  loading: false,
  error: null,
  successMessage: null,

  fetchFAQs: async () => {
    set({ loading: true, error: null });
    try {
      const faqs = await faqApi.getAllFAQs();
      set({ faqs, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to fetch FAQs", loading: false });
    }
  },

  createFAQ: async (faqData) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      await faqApi.createFAQ(faqData);
      await get().fetchFAQs();
      set({ loading: false, successMessage: "FAQ created successfully" });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to create FAQ", loading: false });
    }
  },

  updateFAQ: async (id, faqData) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      await faqApi.updateFAQ(id, faqData);
      await get().fetchFAQs();
      set({ loading: false, successMessage: "FAQ updated successfully" });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to update FAQ", loading: false });
    }
  },

  deleteFAQ: async (id) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      await faqApi.deleteFAQ(id);
      await get().fetchFAQs();
      set({ loading: false, successMessage: "FAQ deleted successfully" });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to delete FAQ", loading: false });
    }
  },

  clearStatus: () => set({ error: null, successMessage: null }),
}));

export const useFaqAdmin = () => {
  const store = useFAQAdminStore();
  return store;
};
