import { create } from "zustand";
import * as galleryApi from "../api/galleryApi";
import { GalleryImage } from "../api/galleryApi";

export type FieldErrors = Partial<Record<"image" | "general", string>>;

const extractFieldErrors = (err: any): FieldErrors => {
  const data = err?.response?.data;
  if (data?.errors && typeof data.errors === "object") return data.errors as FieldErrors;
  return {};
};

interface GalleryAdminState {
  images: GalleryImage[];
  loading: boolean;
  error: string | null;
  fieldErrors: FieldErrors;
  successMessage: string | null;
  hasMore: boolean;
  page: number;

  fetchImages: (page?: number) => Promise<void>;
  createImage: (formData: FormData) => Promise<void>;
  updateImage: (id: string, formData: FormData) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;
  clearStatus: () => void;
}

export const useGalleryAdminStore = create<GalleryAdminState>((set, get) => ({
  images: [],
  loading: false,
  error: null,
  fieldErrors: {},
  successMessage: null,
  hasMore: false,
  page: 1,

  fetchImages: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await galleryApi.getAllGalleryImages(page);
      set((state) => ({ 
        images: page === 1 ? response.data : [...state.images, ...response.data], 
        hasMore: response.hasMore,
        page,
        loading: false 
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch images", loading: false });
    }
  },

  createImage: async (formData) => {
    set({ loading: true, error: null, fieldErrors: {}, successMessage: null });
    try {
      await galleryApi.createGalleryImage(formData);
      await get().fetchImages(1);
      set({ loading: false, successMessage: "Image added successfully!" });
    } catch (err: any) {
      const fieldErrors = extractFieldErrors(err);
      const hasFieldErrors = Object.keys(fieldErrors).length > 0;
      const message = hasFieldErrors ? null : (err.response?.data?.message || "Failed to add image");
      set({ error: message, fieldErrors, loading: false });
    }
  },

  updateImage: async (id, formData) => {
    set({ loading: true, error: null, fieldErrors: {}, successMessage: null });
    try {
      await galleryApi.updateGalleryImage(id, formData);
      await get().fetchImages(1);
      set({ loading: false, successMessage: "Image updated successfully!" });
    } catch (err: any) {
      const fieldErrors = extractFieldErrors(err);
      const hasFieldErrors = Object.keys(fieldErrors).length > 0;
      const message = hasFieldErrors ? null : (err.response?.data?.message || "Failed to update image");
      set({ error: message, fieldErrors, loading: false });
    }
  },

  deleteImage: async (id) => {
    set({ loading: true, error: null, fieldErrors: {}, successMessage: null });
    try {
      await galleryApi.deleteGalleryImage(id);
      await get().fetchImages(1);
      set({ loading: false, successMessage: "Image deleted successfully!" });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to delete image", loading: false });
    }
  },

  clearStatus: () => set({ error: null, fieldErrors: {}, successMessage: null }),
}));

export const useGalleryAdmin = () => useGalleryAdminStore();
