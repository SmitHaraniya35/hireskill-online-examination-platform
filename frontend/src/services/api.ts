import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

const api = axios.create({
  baseURL: BACKEND_URL,
});


// Attach access token
api.interceptors.request.use((config) => {
 
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// 🔥 Handle token expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;


    // Only trigger refresh if backend explicitly says the ACCESS TOKEN expired.
    // This errorCode is set ONLY in authMiddleware — never in login/OTP/reset-password routes.
    const isTokenExpired = error.response?.data?.errorCode === "TOKEN_EXPIRED";


    if (isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;


      try {
        // Call refresh token API
        const res = await axios.post(`${BACKEND_URL}/auth/refresh-token`, {}, {
          withCredentials: true,
        });


        const newAccessToken = res.data.payload.accessToken;


        // Save new token
        localStorage.setItem("admin_token", newAccessToken);


        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);


      } catch (refreshError) {
        // ❌ Refresh failed → logout
        localStorage.removeItem("admin_token");
        window.location.href = "/admin/login";
        return Promise.reject(refreshError);
      }
    }


    return Promise.reject(error);
  }
);


export default api;
