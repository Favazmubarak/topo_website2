
import { create } from "zustand";
import { Section, SectionImage, getImageBySection } from "../api/imageApi";
import { useEffect } from "react";

interface ImageState {
  images: Record<Section, SectionImage[]>;
  loading: Record<Section, boolean>;
  error: Record<Section, string | null>; 
  isFetched: Record<Section, boolean>;
  loadedUrls: Set<string>;
  fetchImage: (section: Section) => Promise<void>;
  markAsLoaded: (url: string) => void;
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
  loadedUrls: new Set(),

  markAsLoaded: (url: string) => {
    if (get().loadedUrls.has(url)) return;
    set((state) => {
      const newSet = new Set(state.loadedUrls);
      newSet.add(url);
      return { loadedUrls: newSet };
    });
  },

  fetchImage: async (section) => {
    if (get().loading[section] || get().isFetched[section]) return;
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
  const markAsLoaded = useImageStore((state) => state.markAsLoaded);
  const loadedUrls = useImageStore((state) => state.loadedUrls);
  
  useEffect(() => {
    fetchImage(section);
  }, [section, fetchImage]);

  return { 
    images: sectionImages, 
    loading: isLoading, 
    error: sectionError, 
    fetchImage,
    markAsLoaded,
    loadedUrls
  };
};