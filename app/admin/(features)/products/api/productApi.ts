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

export const getAllProducts = async (page: number = 1, limit: number = 12): Promise<PaginatedProducts> => {
  const response = await axiosInstance.get(`/products?page=${page}&limit=${limit}`);
  return response.data;
};

export const createProduct = async (formData: FormData): Promise<Product> => {
  const response = await axiosInstance.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateProduct = async (id: string, formData: FormData): Promise<Product> => {
  const response = await axiosInstance.patch(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/products/${id}`);
};
