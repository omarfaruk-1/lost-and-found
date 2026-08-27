import axios from "axios";
import { API_URL } from "../config";

import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "./tokenStore";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Attach access token to requests
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Refresh access token using HttpOnly refresh-token cookie
export async function refreshAccessToken() {
  const { data } = await api.post("/users/refresh-token");

  if (data.accessToken) {
    setAccessToken(data.accessToken);

    return data.accessToken;
  }

  return null;
}

// Handle expired access tokens
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    const isAuthEndpoint =
      original?.url?.includes("/users/log-in") ||
      original?.url?.includes("/users/register") ||
      original?.url?.includes("/users/refresh-token");

    if (
      error.response?.status === 401 &&
      !original?._retry &&
      !isAuthEndpoint
    ) {
      original._retry = true;

      try {
        const token = await refreshAccessToken();

        if (token) {
          original.headers.Authorization = `Bearer ${token}`;

          return api(original);
        }
      } catch {
        clearAccessToken();
        localStorage.removeItem("user");
      }
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  register: (payload) =>
    api.post("/users/register", payload),

  login: (payload) =>
    api.post("/users/log-in", payload),

  me: () =>
    api.get("/users/get-me"),

  verifyEmail: (token) =>
    api.get("/users/verify-email", {
      params: { token },
    }),

  resendVerification: (email) =>
    api.post("/users/resend-verification", { email }),

  forgotPassword: (email) =>
    api.post("/users/forgot-password", { email }),

  resetPassword: ({ token, password }) =>
  api.post(
    `/users/reset-password?token=${encodeURIComponent(token)}`,
    { password }
  ),

  logout: () =>
    api.post("/users/log-out"),

  logoutAll: () =>
    api.post("/users/log-out-all"),

  refreshToken: () =>
    api.post("/users/refresh-token"),

};

export const itemApi = {
  list: (params) =>
    api.get("/items", { params }),

  mine: (params) =>
    api.get("/items/my-items", { params }),

  get: (id) =>
    api.get(`/items/${id}`),

  create: (formData) =>
    api.post("/items", formData),

  update: (id, formData) =>
    api.patch(`/items/${id}`, formData),

  remove: (id) =>
    api.delete(`/items/${id}`),
};

export const claimApi = {
  list: (params) =>
    api.get("/claim", { params }),

  mine: () =>
    api.get("/claim/my-claims"),

  get: (id) =>
    api.get(`/claim/${id}`),

  create: (itemId, formData) =>
    api.post(`/claim/${itemId}`, formData),

  updateStatus: (claimId, payload) =>
    api.patch(`/claim/${claimId}`, payload),
};

export const dashboardApi = {
  getStats: () =>
    api.get("/users/dashboard"),
};

export const adminApi = {
  dashboard: () =>
    api.get("/admin/dashboard"),
};

export default api;