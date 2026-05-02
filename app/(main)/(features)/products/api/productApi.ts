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

export const getAllProductsServer = async (page: number = 1, limit: number = 12): Promise<PaginatedProducts | null> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  try {
    const res = await fetch(`${baseUrl}/products?page=${page}&limit=${limit}`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching products on server:", error);
    return null;
  }
};
