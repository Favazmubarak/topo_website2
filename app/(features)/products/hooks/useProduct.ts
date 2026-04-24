import { create } from "zustand";
import { useEffect } from "react";
import { getAllProducts, Product } from "../api/productApi";

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,
  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const data = await getAllProducts();
      set({ products: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch products", loading: false });
    }
  },
}));

export const useProduct = () => {
  const { products, loading, error, fetchProducts } = useProductStore();
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  return { products, loading, error };
};
