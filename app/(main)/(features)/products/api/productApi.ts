import axiosInstance from "@/src/lib/axiosInstance";

export interface Product {
  _id: string;
  productName: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedProducts {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getAllProducts = async (page: number = 1, limit: number = 9): Promise<PaginatedProducts> => {
  const response = await axiosInstance.get(`/products?page=${page}&limit=${limit}`);
  return response.data;
};
