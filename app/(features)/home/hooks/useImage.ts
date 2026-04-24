import { create } from "zustand";
import { Section, SectionImage, getImageBySection } from "../api/imageApi";
import { useEffect } from "react";

interface ImageState {
  images: Record<Section, SectionImage[]>;
  loading: Record<Section, boolean>;
  error: Record<Section, string | null>; 
  fetchImage: (section: Section) => Promise<void>;
}

const useImageStore = create<ImageState>((set, get) => ({
  images: {
    hero: [],
    about: [],
    "why-choose": [],
    cta: [],
  },
  loading: {
    hero: false,
    about: false,
    "why-choose": false,
    cta: false,
  },
  error: {
    hero: null,
    about: null,
    "why-choose": null,
    cta: null,
  },

  fetchImage: async (section) => {
    try {
      set((state) => ({
        loading: {
          ...state.loading,
          [section]: true,
        },
        error: {
          ...state.error,
          [section]: null, 
        },
      }));

      const data = await getImageBySection(section);

      set((state) => ({
        images: {
          ...state.images,
          [section]: data,
        },
        loading: {
          ...state.loading,
          [section]: false,
        },
      }));
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch image";

      set((state) => ({
        error: {
          ...state.error,
          [section]: message, 
        },
        loading: {
          ...state.loading,
          [section]: false,
        },
      }));
    }
  },
}));

export const useImage = (section: Section) => {
  const { images, loading, error, fetchImage } = useImageStore();

  const sectionImages = images[section];
  const isLoading = loading[section];
  const sectionError = error[section]; 

  useEffect(() => {
    if (sectionImages.length === 0 && !isLoading) {
      fetchImage(section);
    }
  }, [section]);

  return { images: sectionImages, loading: isLoading, error: sectionError };
};