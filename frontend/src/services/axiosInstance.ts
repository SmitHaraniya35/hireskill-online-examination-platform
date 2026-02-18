import axios from "axios";

const axiosInstance = axios.create({
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // token/cookie invalid or deleted
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");

      // redirect to login
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
