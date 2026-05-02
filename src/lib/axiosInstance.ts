import axios from "axios";
import { useAuthStore } from "../../app/admin/(features)/login/hooks/useAuthStore";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});


axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Prevent browser caching
  config.headers['Cache-Control'] = 'no-cache';
  config.headers['Pragma'] = 'no-cache';
  config.headers['Expires'] = '0';

  return config;
});


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");

    if (error.response?.status === 401 && !isLoginRequest) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;