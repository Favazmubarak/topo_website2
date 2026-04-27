import axiosInstance from "@/src/lib/axiosInstance";

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export const getAllFAQs = async (): Promise<FAQ[]> => {
  const response = await axiosInstance.get("/faqs");
  return response.data;
};

export const getFAQById = async (id: string): Promise<FAQ> => {
  const response = await axiosInstance.get(`/faqs/${id}`);
  return response.data;
};

export const createFAQ = async (faqData: { question: string; answer: string }): Promise<FAQ> => {
  const response = await axiosInstance.post("/faqs", faqData);
  return response.data;
};

export const updateFAQ = async (id: string, faqData: { question: string; answer: string }): Promise<FAQ> => {
  const response = await axiosInstance.put(`/faqs/${id}`, faqData);
  return response.data;
};

export const deleteFAQ = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/faqs/${id}`);
};
