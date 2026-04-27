import { create } from "zustand";
import * as productApi from "../api/productApi";
import { Product } from "../api/productApi";

interface ProductAdminState {
  products: Product[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  
  fetchProducts: () => Promise<void>;
  createProduct: (formData: FormData) => Promise<void>;
  updateProduct: (id: string, formData: FormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearStatus: () => void;
}

export const useProductAdminStore = create<ProductAdminState>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  successMessage: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await productApi.getAllProducts();
      set({ products, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch products", loading: false });
    }
  },

  createProduct: async (formData: FormData) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      await productApi.createProduct(formData);
      await get().fetchProducts();
      set({ loading: false, successMessage: "Product created successfully" });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to create product", loading: false });
    }
  },

  updateProduct: async (id: string, formData: FormData) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      await productApi.updateProduct(id, formData);
      await get().fetchProducts();
      set({ loading: false, successMessage: "Product updated successfully" });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to update product", loading: false });
    }
  },

  deleteProduct: async (id: string) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      await productApi.deleteProduct(id);
      await get().fetchProducts();
      set({ loading: false, successMessage: "Product deleted successfully" });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to delete product", loading: false });
    }
  },

  clearStatus: () => set({ error: null, successMessage: null }),
}));

export const useProductAdmin = () => {
  const store = useProductAdminStore();
  return store;
};
