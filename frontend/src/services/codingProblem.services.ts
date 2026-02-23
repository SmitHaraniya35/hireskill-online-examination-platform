import axios from "axios";
import type { axiosResponse } from "../types/index.types";
import type {
    CodingProblemData,
  CodingProblemResponse,
  GelAllCodingProblemWithTestCases,
  GetAllCodingProblemsResponse,
} from "../types/codingProblem.types";

const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}/coding-problem`;

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

const codingProblemService = {
  createCodingProblemWithTestCases: async (data: CodingProblemData) => {
    const response = await axios.post<axiosResponse<CodingProblemResponse>>(`${API_URL}/create-coding-problem-with-testcases`,data, getAuthHeaders());
    console.log(response.data);
    return response.data;
  },

  updateCodingProblemWithTestCases: async (id: string, data: CodingProblemData) => {
      const response = await axios.patch<axiosResponse<CodingProblemResponse>>(`${API_URL}/update-coding-problem-with-testcases/${id}`,data,getAuthHeaders());
      return response.data;
  },

  getCodingProblem: async (id: string) => {
      const response = await axios.get(`${API_URL}/get-coding-problem/${id}`,getAuthHeaders());
      return response.data;
  },

  getCodingProblemWithTestCases: async (id: string) => {
    const response = await axios.get<axiosResponse<GelAllCodingProblemWithTestCases>>(`${API_URL}/get-coding-problem-with-testcases/${id}`, getAuthHeaders());
    return response.data;
  },

  getAllCodingProblems: async () => {
    const response = await axios.get<axiosResponse<GetAllCodingProblemsResponse>>(`${API_URL}/get-all-coding-problems`, getAuthHeaders());
    return response.data;
  },

  deleteCodingProblem: async (id: string) => {
    const response = await axios.delete<axiosResponse>(`${API_URL}/delete-coding-problem/${id}`,getAuthHeaders(),);
    return response.data;
  },
};

export default codingProblemService;
