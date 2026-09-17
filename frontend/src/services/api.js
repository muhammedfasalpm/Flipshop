// Central API Service Configuration
export const API_URL = (import.meta.env.VITE_API_URL || "https://flipshop-mjz2.onrender.com").replace(/\/$/, "");

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

export default API_URL;
