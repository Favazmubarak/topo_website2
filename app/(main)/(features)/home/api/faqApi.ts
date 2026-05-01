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

export const getAllFAQsServer = async (): Promise<FAQ[]> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    try {
        const res = await fetch(`${baseUrl}/faqs`, {
            next: { revalidate: 0 }
        });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Error fetching FAQs on server:", error);
        return [];
    }
};