import { create } from "zustand";
import {
    addSectionImage,
    updateSectionImage,
    deleteSectionImage,
} from "../api/imageApi";

interface ImageState {
    loading: boolean;
    error: string | null;
    successMessage: string | null;

    addImage: (formData: FormData) => Promise<void>;
    updateImage: (id: string, formData: FormData) => Promise<void>;
    deleteImage: (id: string) => Promise<void>;
    clearStatus: () => void;
}

const useImageAdminStore = create<ImageState>((set) => ({
    loading: false,
    error: null,
    successMessage: null,
    addImage: async (formData) => {
        set({
            loading: true,
            error: null,
            successMessage: null,
        });

        try {
            const res = await addSectionImage(formData);

            set({
                successMessage: res.message || "Image added successfully",
                error: null, // Explicitly clear error
            });
        } catch (err: any) {
            const message =
                err.response?.data?.message || err.message || "Failed to add image";

            set({
                error: message,
                successMessage: null, // Clear success message on error
            });
        } finally {
            set({
                loading: false,
            });
        }
    },

    // ✅ UPDATE - PUT /api/images/:id
    updateImage: async (id, formData) => {
        set({
            loading: true,
            error: null,
            successMessage: null,
        });

        try {
            const res = await updateSectionImage(id, formData);

            set({
                loading: false,
                successMessage: res.message || "Image updated successfully",
            });
        } catch (err: any) {
            const message =
                err.response?.data?.message || err.message || "Failed to update image";

            set({
                error: message,
                loading: false,
            });
        }
    },

    // ✅ DELETE - DELETE /api/images/:id
    deleteImage: async (id) => {
        set({
            loading: true,
            error: null,
            successMessage: null,
        });

        try {
console.log("djfklsj")
            if (!id || id.trim() === "") {
                throw new Error("Image ID is required");
            }
            await deleteSectionImage(id);

            set({
                loading: false,
                successMessage: "Image deleted successfully",
            });
        } catch (err: any) {
            console.log("sfd")
            const message =
                err.response?.data?.message || err.message || "Failed to delete image";

            set({
                error: message,
                loading: false,
            });

        }
    },

    // ✅ UTILITY - Clear status messages
    clearStatus: () =>
        set({
            error: null,
            successMessage: null,
        }),
}));

// =====================
// CUSTOM HOOK
// =====================

// ✅ Hook for admin CRUD operations
export const useImageAdmin = () => {
    const loading = useImageAdminStore((state) => state.loading);
    const error = useImageAdminStore((state) => state.error);
    const successMessage = useImageAdminStore((state) => state.successMessage);
    const addImage = useImageAdminStore((state) => state.addImage);
    const updateImage = useImageAdminStore((state) => state.updateImage);
    const deleteImage = useImageAdminStore((state) => state.deleteImage);
    const clearStatus = useImageAdminStore((state) => state.clearStatus);

    return {
        loading,
        error,
        successMessage,
        addImage,
        updateImage,
        deleteImage,
        clearStatus,
    };
};