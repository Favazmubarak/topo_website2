import { create } from "zustand";
import { useEffect } from "react";
import { getAllProducts, Product } from "../api/productApi"; 

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  fetchProducts: (page?: number) => Promise<void>;
}

const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  hasFetched: false,
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  fetchProducts: async (page: number = 1) => {
    try {
      set({ loading: true, error: null });
      const data = await getAllProducts(page, 12);
      
      if (data && data.products && Array.isArray(data.products)) {
        set({
          products: data.products,
          currentPage: data.pagination?.page || page,
          totalPages: data.pagination?.totalPages || 1,
          totalProducts: data.pagination?.total || data.products.length,
          loading: false,
          hasFetched: true,
        });
      } else if (Array.isArray(data)) {
        set({
          products: data,
          currentPage: 1,
          totalPages: 1,
          totalProducts: data.length,
          loading: false,
          hasFetched: true,
        });
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || "Failed to fetch products",
        loading: false,
        hasFetched: true,
      });
    }
  },
}));

export const useProduct = () => {
  const {
    products,
    loading,
    error,
    hasFetched,
    fetchProducts,
    currentPage,
    totalPages,
    totalProducts,
  } = useProductStore();

  useEffect(() => {
    if (!hasFetched) {
      fetchProducts(1);
    }
  }, [hasFetched, fetchProducts]);

  return {
    products,
    loading,
    error,
    currentPage,
    totalPages,
    totalProducts,
    fetchProducts,
  };
};