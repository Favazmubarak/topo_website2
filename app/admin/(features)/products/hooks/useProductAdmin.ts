import { create } from "zustand";
import * as productApi from "../api/productApi";
import { Product } from "../api/productApi";

export type FieldErrors = Partial<Record<"productName" | "title" | "description" | "image" | "general", string>>;

interface ProductAdminState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fieldErrors: FieldErrors;
  successMessage: string | null;
  totalProducts: number;
  currentPage: number;
  totalPages: number;

  fetchProducts: (page?: number) => Promise<void>;
  createProduct: (formData: FormData) => Promise<void>;
  updateProduct: (id: string, formData: FormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearStatus: () => void;
}

const extractFieldErrors = (err: any): FieldErrors => {
  const data = err?.response?.data;
  if (data?.errors && typeof data.errors === "object") {
    return data.errors as FieldErrors;
  }
  return {};
};

export const useProductAdminStore = create<ProductAdminState>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  fieldErrors: {},
  successMessage: null,
  totalProducts: 0,
  currentPage: 1,
  totalPages: 1,

  fetchProducts: async (page: number = 1) => {
    set({ loading: true, error: null });
    try {
      const data = await productApi.getAllProducts(page, 12);
      
      // Robustly handle different response formats
      if (data && data.products && Array.isArray(data.products)) {
        set({ 
          products: data.products, 
          totalProducts: data.pagination?.total || data.products.length,
          currentPage: data.pagination?.page || page,
          totalPages: data.pagination?.totalPages || 1,
          loading: false 
        });
      } else if (Array.isArray(data)) {
        set({ 
          products: data, 
          totalProducts: data.length, 
          currentPage: 1,
          totalPages: 1,
          loading: false 
        });
      } else {
        set({ 
          products: [], 
          totalProducts: 0, 
          currentPage: 1,
          totalPages: 1,
          loading: false, 
          error: "Invalid response format" 
        });
      }
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || "Failed to fetch products", 
        loading: false,
        products: [],
        totalProducts: 0,
        currentPage: 1,
        totalPages: 1
      });
    }
  },

  createProduct: async (formData: FormData) => {
    set({ loading: true, error: null, fieldErrors: {}, successMessage: null });
    try {
      await productApi.createProduct(formData);
      await get().fetchProducts();
      set({ loading: false, successMessage: "Product created successfully!" });
    } catch (err: any) {
      const fieldErrors = extractFieldErrors(err);
      const hasFieldErrors = Object.keys(fieldErrors).length > 0;
      const message = hasFieldErrors ? null : (err.response?.data?.message || "Failed to create product");
      set({ error: message, fieldErrors, loading: false });
    }
  },

  updateProduct: async (id: string, formData: FormData) => {
    set({ loading: true, error: null, fieldErrors: {}, successMessage: null });
    try {
      await productApi.updateProduct(id, formData);
      await get().fetchProducts();
      set({ loading: false, successMessage: "Product updated successfully!" });
    } catch (err: any) {
      const fieldErrors = extractFieldErrors(err);
      const hasFieldErrors = Object.keys(fieldErrors).length > 0;
      const message = hasFieldErrors ? null : (err.response?.data?.message || "Failed to update product");
      set({ error: message, fieldErrors, loading: false });
    }
  },

  deleteProduct: async (id: string) => {
    set({ loading: true, error: null, fieldErrors: {}, successMessage: null });
    try {
      await productApi.deleteProduct(id);
      await get().fetchProducts();
      set({ loading: false, successMessage: "Product deleted successfully!" });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to delete product", loading: false });
    }
  },

  clearStatus: () => set({ error: null, fieldErrors: {}, successMessage: null }),
}));

export const useProductAdmin = () => {
  const store = useProductAdminStore();
  return store;
};
