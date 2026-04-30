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

export const getAllGalleryImagesServer = async (page: number = 1, limit: number = 15): Promise<GalleryResponse | null> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    try {
        const res = await fetch(`${baseUrl}/gallery?page=${page}&limit=${limit}`, {
            next: { revalidate: 3600 }
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error("Error fetching gallery images on server:", error);
        return null;
    }
};
