import axiosInstance from "./axiosInstance";

export const authService = {
  login: async (credentials: any) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
  },

  getToken: () => {
    return typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  },

  isAuthenticated: () => {
    return typeof window !== "undefined" && !!localStorage.getItem("accessToken");
  },
};
