import { create } from "zustand";
import * as reelApi from "../api/reelApi";
import { Reel } from "../api/reelApi";

export type FieldErrors = Partial<Record<"thumbnail" | "link" | "general", string>>;

const extractFieldErrors = (err: any): FieldErrors => {
  const data = err?.response?.data;
  if (data?.errors && typeof data.errors === "object") return data.errors as FieldErrors;
  return {};
};

interface ReelAdminState {
  reels: Reel[];
  loading: boolean;
  error: string | null;
  fieldErrors: FieldErrors;
  successMessage: string | null;

  fetchReels: () => Promise<void>;
  createReel: (data: FormData) => Promise<void>;
  updateReel: (id: string, data: FormData) => Promise<void>;
  deleteReel: (id: string) => Promise<void>;
  clearStatus: () => void;
}

export const useReelAdminStore = create<ReelAdminState>((set, get) => ({
  reels: [],
  loading: false,
  error: null,
  fieldErrors: {},
  successMessage: null,

  fetchReels: async () => {
    set({ loading: true, error: null });
    try {
      const reels = await reelApi.getAllReels();
      set({ reels, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch reels", loading: false });
    }
  },

  createReel: async (data) => {
    set({ loading: true, error: null, fieldErrors: {}, successMessage: null });
    try {
      await reelApi.createReel(data);
      await get().fetchReels();
      set({ loading: false, successMessage: "Reel created successfully!" });
    } catch (err: any) {
      const fieldErrors = extractFieldErrors(err);
      const hasFieldErrors = Object.keys(fieldErrors).length > 0;
      const message = hasFieldErrors ? null : (err.response?.data?.message || "Failed to create reel");
      set({ error: message, fieldErrors, loading: false });
    }
  },

  updateReel: async (id, data) => {
    set({ loading: true, error: null, fieldErrors: {}, successMessage: null });
    try {
      await reelApi.updateReel(id, data);
      await get().fetchReels();
      set({ loading: false, successMessage: "Reel updated successfully!" });
    } catch (err: any) {
      const fieldErrors = extractFieldErrors(err);
      const hasFieldErrors = Object.keys(fieldErrors).length > 0;
      const message = hasFieldErrors ? null : (err.response?.data?.message || "Failed to update reel");
      set({ error: message, fieldErrors, loading: false });
    }
  },

  deleteReel: async (id) => {
    set({ loading: true, error: null, fieldErrors: {}, successMessage: null });
    try {
      await reelApi.deleteReel(id);
      await get().fetchReels();
      set({ loading: false, successMessage: "Reel deleted successfully!" });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to delete reel", loading: false });
    }
  },

  clearStatus: () => set({ error: null, fieldErrors: {}, successMessage: null }),
}));

export const useReelAdmin = () => useReelAdminStore();
