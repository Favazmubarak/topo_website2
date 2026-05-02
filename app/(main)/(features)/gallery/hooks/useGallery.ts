import { create } from "zustand";
import { useEffect } from "react";
import { getAllGalleryImages, GalleryImage } from "../api/galleryApi";
interface GalleryState {
  galleryImages: GalleryImage[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasFetched: boolean; 
  hasMore: boolean;
  page: number;
  fetchGalleryImages: (page?: number) => Promise<void>;
}

const useGalleryStore = create<GalleryState>((set) => ({
  galleryImages: [],
  loading: false,
  loadingMore: false,
  error: null,
  hasFetched: false, 
  hasMore: false,
  page: 1,

  fetchGalleryImages: async (page = 1) => {
    try {
      if (page === 1) set({ loading: true, error: null });
      else set({ loadingMore: true, error: null });

      const response = await getAllGalleryImages(page);
      
      set((state) => ({ 
        galleryImages: page === 1 ? response.data : [...state.galleryImages, ...response.data],
        hasMore: response.hasMore,
        page,
        loading: false,
        loadingMore: false,
        hasFetched: true 
      })); 
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || "Failed to fetch gallery images", 
        loading: false,
        loadingMore: false,
      });
    }
  },
}));

export const useGallery = () => {
  const store = useGalleryStore();
  useEffect(() => {
    // Always fetch page 1 on mount to ensure fresh data
    store.fetchGalleryImages(1);
  }, [store.fetchGalleryImages]);

  return store;
};