import axios from "axios";

// Central API Base URL Configuration (Strips trailing slashes and trailing /api to prevent duplication)
const RAW_API_URL = import.meta.env.VITE_API_URL || "https://flipshop-mjz2.onrender.com";
export const API_URL = RAW_API_URL.replace(/\/$/, "").replace(/\/api$/, "");

// Create Centralized Axios Instance with Auto Token Header Injection
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor to Attach JWT Token
api.interceptors.request.use(
  (config) => {
    try {
      const userInfoStr = localStorage.getItem("userInfo");
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        if (userInfo && userInfo.token) {
          config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
      }
    } catch (e) {
      console.error("Error reading userInfo from localStorage:", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Safely resolves product or user image URLs.
 * @param {string} path - Relative image path or absolute URL.
 * @returns {string} Fully qualified image URL.
 */
export const getImageUrl = (path) => {
  if (!path) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};

export default api;
