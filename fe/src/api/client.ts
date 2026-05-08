import axios, { type InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { useUserStore } from "../store/user";

const API_URL = import.meta.env.VITE_API_URL;
let isRefreshing = false;

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface FailedQueueItem {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

let failedQueue: FailedQueueItem[] = [];

const clearAuthSession = () => {
  Cookies.remove("token", { path: "/" });
  Cookies.remove("refreshToken", { path: "/" });
  useUserStore.getState().logout();
};

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const publicClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const privateClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

privateClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

privateClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.response || !error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryRequestConfig;
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return privateClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      const oldRefreshToken = Cookies.get("refreshToken");

      if (!oldRefreshToken) {
        clearAuthSession();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      isRefreshing = true;

      try {
        const response = await publicClient.post("/auth/refresh", { oldRefreshToken });
        const { accessToken, refreshToken } = response.data.data;
        Cookies.set("token", accessToken, { expires: 7, path: "/" });
        Cookies.set("refreshToken", refreshToken, {
          expires: 7,
          path: "/",
          sameSite: "strict",
        });
        privateClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        return privateClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthSession();
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
