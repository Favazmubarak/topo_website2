import { create } from "zustand";
import { useEffect } from "react";
import { getAllProducts, Product } from "../api/productApi"; interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean; 
  fetchProducts: () => Promise<void>;
}

const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,
  hasFetched: false, 
  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const data = await getAllProducts();
      set({ products: data, loading: false, hasFetched: true }); 
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
  const { products, loading, error, hasFetched, fetchProducts } = useProductStore();

  useEffect(() => {
    if (!hasFetched) { 
      fetchProducts();
    }
  }, [hasFetched, fetchProducts]);

  return { products, loading, error };
};