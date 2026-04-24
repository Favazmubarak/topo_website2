import axiosInstance from "@/src/lib/axiosInstance";

export interface Product {
  _id: string;
  productName: string;
  title: string;
  description: string;
  imageUrl: string;
}

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await axiosInstance.get("/products");
  return response.data;
};
