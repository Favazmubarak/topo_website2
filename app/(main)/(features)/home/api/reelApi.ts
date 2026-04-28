import axiosInstance from "@/src/lib/axiosInstance";

export interface Reel {
    _id: string;
    thumbnail: string;
    link: string;
    createdAt: string;
    updatedAt: string;
}

export const getAllReels = async (): Promise<Reel[]> => {
    const res = await axiosInstance.get<Reel[]>("/reels");
    return res.data;
};
