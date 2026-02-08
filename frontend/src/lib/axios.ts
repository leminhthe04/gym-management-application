import axios from "axios";
import { setAccessToken, signOut } from "@/redux/slices/authSlice";

let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Add access token to request headers
api.interceptors.request.use(
  (config) => {
    if (store) {
      const accessToken = store.getState().auth.accessToken;

      if (accessToken && !config.url?.includes("/auth/refresh")) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Automatically call refresh api when access token is expired
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // apis which do not need to check
    if (
      !originalRequest ||
      originalRequest.url.includes("auth/signin") ||
      originalRequest.url.includes("auth/signup") ||
      originalRequest.url.includes("auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (store && error.response?.status === 401 && originalRequest._retryCount < 4) {
      originalRequest._retryCount += 1;

      console.log("refresh", originalRequest._retryCount);

      try {
        const res = await api.post("/auth/refresh", { withCredentials: true });
        const newAccessToken = res.data.accessToken;

        if (newAccessToken) {
          store.dispatch(setAccessToken(newAccessToken));

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        store.dispatch(signOut());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
