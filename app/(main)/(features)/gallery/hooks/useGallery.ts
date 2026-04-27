import { create } from "zustand";
import { useEffect } from "react";
import { getAllGalleryImages, GalleryImage } from "../api/galleryApi"; interface GalleryState {
  galleryImages: GalleryImage[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean; 
  fetchGalleryImages: () => Promise<void>;
}

const useGalleryStore = create<GalleryState>((set) => ({
  galleryImages: [],
  loading: false,
  error: null,
  hasFetched: false, 
  fetchGalleryImages: async () => {
    try {
      set({ loading: true, error: null });
      const data = await getAllGalleryImages();
      set({ galleryImages: data }); 
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || "Failed to fetch gallery images", 
      });
    }finally{
        set({ loading: false,hasFetched: true });
    }
  },
}));

export const useGallery = () => {
  const { galleryImages, loading, error, hasFetched, fetchGalleryImages } = useGalleryStore();
  useEffect(() => {
    if (!hasFetched) { 
      fetchGalleryImages();
    }
  }, [hasFetched]);

  return { galleryImages, loading, error };
};