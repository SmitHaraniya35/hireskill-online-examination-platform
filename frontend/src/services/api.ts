// import axios from "axios";


// const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

// const api = axios.create({
//   baseURL: BACKEND_URL,
// });

// // Attach access token
// api.interceptors.request.use((config) => {
  
//   const token = localStorage.getItem("admin_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // 🔥 Handle token expiry
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     console.log("Api error interceptor hit", error.response?.status);
    
//     const originalRequest = error.config;

//     // If 401 and not already retried
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       console.log("Attempting token refresh...");
      
//       originalRequest._retry = true;

//       try {
//         // Call refresh token API
//         const res = await axios.post(`${BACKEND_URL}/auth/refresh-token`, {}, {
//           withCredentials: true, // important if refresh token is in cookies
//         });

//         const newAccessToken = res.data.payload.accessToken;

//         // Save new token
//         localStorage.setItem("admin_token", newAccessToken);

//         // Retry original request
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return api(originalRequest);

//       } catch (refreshError) {
//         // ❌ Refresh failed → logout
//         localStorage.removeItem("admin_token");
//         window.location.href = "/admin/login"; // force redirect
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from "axios";


const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;


// ─── Public API (no interceptors) ────────────────────────────────────────────
// Use this for unauthenticated routes: login, forgot-password, verify-otp, reset-password
export const publicApi = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});


// ─── Authenticated API (with refresh token interceptor) ──────────────────────
// Use this for all protected routes that require a valid access token
const api = axios.create({
  baseURL: BACKEND_URL,
});


// Attach access token to every authenticated request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Handle expired access tokens — silently refresh and retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;


    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;


      try {
        // Use a plain axios call (not api/publicApi) to avoid interceptor loops
        const res = await axios.post(`${BACKEND_URL}/auth/refresh-token`, {}, {
          withCredentials: true,
        });


        const newAccessToken = res.data.payload.accessToken;


        localStorage.setItem("admin_token", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;


        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token also expired → force logout
        localStorage.removeItem("admin_token");
        window.location.href = "/admin/login";
        return Promise.reject(refreshError);
      }
    }


    return Promise.reject(error);
  }
);


export default api;