import axios from "axios"
import Swal from "sweetalert2"
import { emitForceLogout } from "../utils/auth-events";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      emitForceLogout(); // Cierra sesión desde contexto + redirige
    }

    const errorMessage = error.response?.data?.message || "Error en la operación";
    Swal.fire({
      icon: "error",
      title: "Error",
      text: errorMessage,
      confirmButtonColor: "#16423C",
      customClass: {
        popup: "rounded-lg",
        confirmButton: "rounded-lg",
      },
    });

    return Promise.reject(error);
  },
);


// Auth services
export const authService = {
  login: (credentials) => api.post("/api/auth", credentials),
  register: (userData) => api.post("/api/auth/register", userData),
  forgotPassword: (email) => api.get("/api/auth/forgotPassword", { params: { email } }),

}

// User services
export const userService = {
  getAll: () => api.get("/api/users"),
  create: (userData) => api.post("/api/users", userData),
  getById: (id) => api.get(`/api/users/${id}`),
  update: (id, userData) => api.put(`/api/users/${id}`, userData),
  delete: (id) => api.delete(`/api/users/${id}`),
  toggleStatus: (id) => api.put(`/api/users/${id}/toggle-status`),
  getByUuid: (uuid) => api.get(`/api/users/uuid/${uuid}`),
  getByUsername: (username) => api.get(`/api/users/username/${username}`),
  getByRole: () => api.get("/api/users/role"),
  getAvailableManagers: () => api.get("/api/users/available-managers"),
  getActive: () => api.get("/api/users/active"),
  changePassword: (id, currentPass, newPass) =>
    api.put("/api/users/change-password", {
      userId: id,
      currentPassword: currentPass,
      newPassword: newPass
    }),
}

// Storage services
export const storageService = {
  getAll: () => api.get("/api/storages"),
  create: (storageData) => api.post("/api/storages", storageData),
  getById: (id) => api.get(`/api/storages/${id}`),
  update: (id, storageData) => api.put(`/api/storages/${id}`, storageData),
  delete: (id) => api.delete(`/api/storages/${id}`),
  toggleStatus: (id) => api.put(`/api/storages/${id}/toggle-status`),
  assignResponsible: (storageId, userId) => api.put(`/api/storages/${storageId}/responsible/${userId}`),
  getByUuid: (uuid) => api.get(`/api/storages/uuid/${uuid}`),
  getByResponsible: (userId) => api.get(`/api/storages/responsible/${userId}`),
  getByIdentifier: (identifier) => api.get(`/api/storages/identifier/${identifier}`),
  getByCategory: (categoryId) => api.get(`/api/storages/category/${categoryId}`),
  getWithoutResponsible: () => api.get("/api/storages/without-responsible"),
  getActive: () => api.get("/api/storages/active"),
}

// Category services
export const categoryService = {
  getAll: () => api.get("/api/categories"),
  create: (category) => api.post("/api/categories", null, { params: { category } }),
  getById: (id) => api.get(`/api/categories/${id}`),
  update: (id, categoryDetails) => api.put(`/api/categories/${id}`, null, { params: { categoryDetails } }),
  delete: (id) => api.delete(`/api/categories/${id}`),
  getByUuid: (uuid) => api.get(`/api/categories/uuid/${uuid}`),
  getByName: (name) => api.get(`/api/categories/name/${name}`),
  getWithStorages: () => api.get("/api/categories/with-storages"),
  getWithArticles: () => api.get("/api/categories/with-articles"),
}

// Article services
export const articleService = {
  getAll: () => api.get("/api/articles"),
  create: (articleData) => api.post("/api/articles", articleData),
  getById: (id) => api.get(`/api/articles/${id}`),
  update: (id, articleData) => api.put(`/api/articles/${id}`, articleData),
  delete: (id) => api.delete(`/api/articles/${id}`),
  getByUuid: (uuid) => api.get(`/api/articles/uuid/${uuid}`),
  assignToStorage: (storageId, articleId, quantity) => api.put(`/api/articles/storage/${storageId}/article/${articleId}`, null, { params: { quantity } }),
  removeFromStorage: (storageId, articleId, quantity) => api.delete(`/api/storages/storage/${storageId}/article/${articleId}`, { params: { quantity } }),
  updateQuantity: (id, newQuantity) => api.put(`/api/articles/${id}/quantity`, null, { params: { newQuantity } }),
  incrementQuantity: (id, increment) => api.put(`/api/articles/${id}/increment`, null, { params: { increment } }),
  decrementQuantity: (id, decrement) => api.put(`/api/articles/${id}/decrement`, null, { params: { decrement } }),
  getByStorage: (storageId) => api.get(`/api/articles/storage/${storageId}`),
  getByCategory: (categoryId) => api.get(`/api/articles/category/${categoryId}`),
  search: (name, categoryId) => api.get("/api/articles/search", { params: { name, categoryId } }),
  getWithoutStock: () => api.get("/api/articles/no-stock"),
  getLowStock: (threshold) => api.get("/api/articles/low-stock", { params: { threshold } }),
  getTotalStock: () => api.get("/api/articles/total/stock"),
  getTotalByCategory: (categoryId) => api.get(`/api/articles/total/category/${categoryId}`),
  getArticlesByUser : (id) => api.get(`/api/articles/storage/user/${id}`),
}

export default api
