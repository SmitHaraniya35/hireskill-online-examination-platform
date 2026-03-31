// import axios from "axios";
import type { axiosResponse } from "../types/index.types";
import api from "./api";

// const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}/test-case`;
const API_URL = api.defaults.baseURL + "/test-case";

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

const testCaseService = {
  deleteTestCase: async (id: string) => {
    const response = await api.delete<axiosResponse>(
      `${API_URL}/delete-test-case/${id}`,
      getAuthHeaders(),
    );
    return response.data;
  },
};
export default testCaseService;
