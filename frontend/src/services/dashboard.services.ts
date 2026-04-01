// import axios from "axios";
import type { axiosResponse } from "../types/index.types";
import type { IGlobalResponse, ISingleTestResponse } from "../types/dashboard.types";
import api from "./api";

// const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}/dashboard`;
const API_URL = api.defaults.baseURL + "/dashboard";


const getAuthHeaders = () => {
  const token = localStorage.getItem("admin_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "69420",
    },
    withCredentials: true,
  };
};

const dashboardService = {
  getDashboardService: async (id?: string) => {
    const url = id
      ? `${API_URL}/test-analytics/${id}`
      : `${API_URL}/test-analytics`;
    const response = await api.get<axiosResponse>(url, getAuthHeaders());
    return response.data.payload;
  },

  fetchAllTestsAnalytics: async () => {
    const url = `${API_URL}/test/global`;
    const response = await api.get<axiosResponse<IGlobalResponse>>(url, getAuthHeaders());
    return response.data.payload;
  },

  fetchSingleTestAnalytics: async (id: string) => {
    const url = `${API_URL}/test/${id}`;
    const response = await api.get<axiosResponse<ISingleTestResponse>>(url, getAuthHeaders());
    return response.data.payload;
  },
};

export default dashboardService;