import axiosInstance from "@/src/lib/axiosInstance";

export interface GalleryImage {
    _id: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface GalleryResponse {
    data: GalleryImage[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

export const getAllGalleryImages = async (page: number = 1, limit: number = 15): Promise<GalleryResponse> => {
    const response = await axiosInstance.get(`/gallery?page=${page}&limit=${limit}`);
    return response.data;
};
