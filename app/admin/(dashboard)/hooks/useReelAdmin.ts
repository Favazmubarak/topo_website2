import { create } from "zustand";
import * as reelApi from "../api/reelApi";
import { Reel } from "../api/reelApi";

interface ReelAdminState {
  reels: Reel[];
  loading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  successMessage: string | null;

  fetchReels: () => Promise<void>;
  createReel: (data: { title: string; link: string }) => Promise<void>;
  updateReel: (id: string, data: { title: string; link: string }) => Promise<void>;
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
    set({ loading: true, error: null, successMessage: null });
    try {
      await reelApi.createReel(data);
      await get().fetchReels();
      set({ loading: false, successMessage: "Reel created successfully" });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to create reel", fieldErrors: err.response?.data?.errors || {}, loading: false });
    }
  },

  updateReel: async (id, data) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      await reelApi.updateReel(id, data);
      await get().fetchReels();
      set({ loading: false, successMessage: "Reel updated successfully" });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to update reel", fieldErrors: err.response?.data?.errors || {}, loading: false });
    }
  },

  deleteReel: async (id) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      await reelApi.deleteReel(id);
      await get().fetchReels();
      set({ loading: false, successMessage: "Reel deleted successfully" });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to delete reel", loading: false });
    }
  },

  clearStatus: () => set({ error: null, successMessage: null, fieldErrors: {} }),
}));

export const useReelAdmin = () => useReelAdminStore();
