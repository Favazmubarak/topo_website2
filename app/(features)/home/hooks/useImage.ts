
import { create } from "zustand";
import { Section, SectionImage, getImageBySection } from "../api/imageApi";
import { useEffect } from "react";

interface ImageState {
  images: Record<Section, SectionImage[]>;
  loading: Record<Section, boolean>;
  error: Record<Section, string | null>; 
  isFetched: Record<Section, boolean>;
  fetchImage: (section: Section) => Promise<void>;
}

const useImageStore = create<ImageState>((set, get) => ({
  isFetched: {
    hero: false,
    about: false,
    "why-choose": false,
    cta: false,
  },
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
    if (get().loading[section]) return;
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
        isFetched: { ...state.isFetched, [section]: true },
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
        isFetched: { ...state.isFetched, [section]: true },
      }));
    }
  },
}));

export const useImage = (section: Section) => {
  const sectionImages = useImageStore((state) => state.images[section]);
  const isLoading = useImageStore((state) => state.loading[section]);
  const sectionError = useImageStore((state) => state.error[section]);
  const fetchImage = useImageStore((state) => state.fetchImage);
  const isFetched = useImageStore((state) => state.isFetched[section]);
  useEffect(() => {
    if (!isFetched) {
      fetchImage(section);
    }
  }, [isFetched,section,fetchImage]);

  return { images: sectionImages, loading: isLoading, error: sectionError, fetchImage };
};