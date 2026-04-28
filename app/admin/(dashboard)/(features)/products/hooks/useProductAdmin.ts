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

  fetchProducts: () => Promise<void>;
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
