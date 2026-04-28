import { create } from "zustand";
import {
    addSectionImage,
    updateSectionImage,
    deleteSectionImage,
    getImageBySection,
    Section,
    SectionImage,
} from "../api/imageApi";

interface ImageState {
    images: Record<Section, SectionImage[]>;
    isFetched: Record<Section, boolean>;
    loading: boolean;
    error: string | null;
    successMessage: string | null;

    fetchImage: (section: Section) => Promise<void>;
    refetchImage: (section: Section) => Promise<void>;
    addImage: (formData: FormData) => Promise<void>;
    updateImage: (id: string, formData: FormData) => Promise<void>;
    deleteImage: (id: string) => Promise<void>;
    clearStatus: () => void;
}

const defaultSectionRecord = <T>(value: T): Record<Section, T> => ({
    hero: value,
    about: value,
    "why-choose": value,
    cta: value,
});

const useImageAdminStore = create<ImageState>((set, get) => ({
    images: defaultSectionRecord([]) as Record<Section, SectionImage[]>,
    isFetched: defaultSectionRecord(false),
    loading: false,
    error: null,
    successMessage: null,

    fetchImage: async (section) => {
        if (get().isFetched[section]) return;
        set({ loading: true, error: null });
        try {
            const data = await getImageBySection(section);
            set((state) => ({
                images: { ...state.images, [section]: data },
                isFetched: { ...state.isFetched, [section]: true },
                loading: false,
            }));
        } catch (err: any) {
            set({
                error: err.response?.data?.message || err.message || "Failed to fetch images",
                loading: false,
            });
        }
    },

    refetchImage: async (section) => {
        set((state) => ({
            isFetched: { ...state.isFetched, [section]: false },
        }));
        await get().fetchImage(section);
    },

    addImage: async (formData) => {
        set({ loading: true, error: null, successMessage: null });
        try {
            const res = await addSectionImage(formData);
            set({ successMessage: res.message || "Image added successfully", error: null });
        } catch (err: any) {
            set({ error: err.response?.data?.message || err.message || "Failed to add image", successMessage: null });
        } finally {
            set({ loading: false });
        }
    },

    updateImage: async (id, formData) => {
        set({ loading: true, error: null, successMessage: null });
        try {
            const res = await updateSectionImage(id, formData);
            set({ loading: false, successMessage: res.message || "Image updated successfully" });
        } catch (err: any) {
            set({ error: err.response?.data?.message || err.message || "Failed to update image", loading: false });
        }
    },

    deleteImage: async (id) => {
        set({ loading: true, error: null, successMessage: null });
        try {
            if (!id || id.trim() === "") throw new Error("Image ID is required");
            await deleteSectionImage(id);
            set({ loading: false, successMessage: "Image deleted successfully" });
        } catch (err: any) {
            set({ error: err.response?.data?.message || err.message || "Failed to delete image", loading: false });
        }
    },

    clearStatus: () => set({ error: null, successMessage: null }),
}));

// =====================
// CUSTOM HOOK
// =====================

export const useImageAdmin = (section?: Section) => {
    const images = useImageAdminStore((state) => section ? state.images[section] : undefined);
    const isFetched = useImageAdminStore((state) => section ? state.isFetched[section] : false);
    const loading = useImageAdminStore((state) => state.loading);
    const error = useImageAdminStore((state) => state.error);
    const successMessage = useImageAdminStore((state) => state.successMessage);
    const fetchImage = useImageAdminStore((state) => state.fetchImage);
    const refetchImage = useImageAdminStore((state) => state.refetchImage);
    const addImage = useImageAdminStore((state) => state.addImage);
    const updateImage = useImageAdminStore((state) => state.updateImage);
    const deleteImage = useImageAdminStore((state) => state.deleteImage);
    const clearStatus = useImageAdminStore((state) => state.clearStatus);

    return {
        images,
        isFetched,
        loading,
        error,
        successMessage,
        fetchImage,
        refetchImage,
        addImage,
        updateImage,
        deleteImage,
        clearStatus,
    };
};

export { useImageAdminStore };