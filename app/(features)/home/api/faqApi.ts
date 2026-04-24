import axiosInstance from "@/src/lib/axiosInstance";

export interface FAQ {
    _id: string;
    question: string;
    answer: string;
    createdAt: string;
    updatedAt: string;
}

export const getAllFAQs = async (): Promise<FAQ[]> => {
    const res = await axiosInstance.get<FAQ[]>("/faqs");
    return res.data;
};