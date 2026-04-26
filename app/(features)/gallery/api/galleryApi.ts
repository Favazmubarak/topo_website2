import axiosInstance from "@/src/lib/axiosInstance";

export interface GalleryImage {
    _id: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}

export const getAllGalleryImages = async (): Promise<GalleryImage[]> => {
    const response = await axiosInstance.get("/gallery");
    return response.data;
};
