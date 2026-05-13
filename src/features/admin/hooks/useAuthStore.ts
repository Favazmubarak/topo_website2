import { create } from "zustand";
import axiosInstance from "@/src/lib/axiosInstance";

interface AuthState {
  user: any | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("accessToken") : false,
  isLoading: false,
  error: null,

  setAccessToken: (token: string | null) => {
    if (token) {
      localStorage.setItem("accessToken", token);
      set({ accessToken: token, isAuthenticated: true });
    } else {
      localStorage.removeItem("accessToken");
      set({ accessToken: null, isAuthenticated: false, user: null });
    }
  },

  login: async (credentials: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      const { accessToken } = response.data;
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        set({ accessToken, isAuthenticated: true, isLoading: false });
        window.location.href = "/admin";
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try { await axiosInstance.post("/auth/logout"); } catch {}
    localStorage.removeItem("accessToken");
    set({ user: null, accessToken: null, isAuthenticated: false });
    window.location.href = "/admin/login";
  },

  checkAuth: () => {
    const token = localStorage.getItem("accessToken");
    if (token) set({ accessToken: token, isAuthenticated: true });
    else set({ accessToken: null, isAuthenticated: false });
  },
}));