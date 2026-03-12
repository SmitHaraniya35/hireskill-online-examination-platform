import axios from "axios";
import type { axiosResponse } from "../types/index.types";

const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}/coding-problem-template`;

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

const codingProblemTemplateService = {
  deleteCodingTemplateProblem: async (id: string) => {
    const response = await axios.delete<axiosResponse>(
      `${API_URL}/delete-coding-problem-template/${id}`,
      getAuthHeaders(),
    );
    return response.data;
  },
};
export default codingProblemTemplateService;
