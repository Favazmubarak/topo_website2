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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/faqs`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching FAQs on server:", error);
    return [];
  }
};

export const createFAQ = async (data: { question: string; answer: string }): Promise<FAQ> => {
  const res = await axiosInstance.post("/faqs", data);
  return res.data.data;
};

export const updateFAQ = async (id: string, data: { question: string; answer: string }): Promise<FAQ> => {
  const res = await axiosInstance.put(`/faqs/${id}`, data);
  return res.data.data;
};

export const deleteFAQ = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/faqs/${id}`);
};