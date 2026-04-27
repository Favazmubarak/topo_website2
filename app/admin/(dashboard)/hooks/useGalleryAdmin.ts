import { create } from "zustand";
import * as galleryApi from "../api/galleryApi";
import { GalleryImage } from "../api/galleryApi";

interface GalleryAdminState {
  images: GalleryImage[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  
  fetchImages: () => Promise<void>;
  createImage: (formData: FormData) => Promise<void>;
  updateImage: (id: string, formData: FormData) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;
  clearStatus: () => void;
}

export const useGalleryAdminStore = create<GalleryAdminState>((set, get) => ({
  images: [],
  loading: false,
  error: null,
  successMessage: null,

  fetchImages: async () => {
    set({ loading: true, error: null });
    try {
      const images = await galleryApi.getAllGalleryImages();
      set({ images, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to fetch images", loading: false });
    }
  },

  createImage: async (formData) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      await galleryApi.createGalleryImage(formData);
      await get().fetchImages();
      set({ loading: false, successMessage: "Image added successfully" });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to add image", loading: false });
    }
  },

  updateImage: async (id, formData) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      await galleryApi.updateGalleryImage(id, formData);
      await get().fetchImages();
      set({ loading: false, successMessage: "Image updated successfully" });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to update image", loading: false });
    }
  },

  deleteImage: async (id) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      await galleryApi.deleteGalleryImage(id);
      await get().fetchImages();
      set({ loading: false, successMessage: "Image deleted successfully" });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to delete image", loading: false });
    }
  },

  clearStatus: () => set({ error: null, successMessage: null }),
}));

export const useGalleryAdmin = () => {
  const store = useGalleryAdminStore();
  return store;
};
