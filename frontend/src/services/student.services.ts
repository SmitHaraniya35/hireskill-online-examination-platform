import axios from "axios";
import type { Student, StudentListData } from "../types/student.types";
import type { axiosResponse } from "../types/index.types";

const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}/student`;

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

const StudentService = {

  createStudent: async(data: Student) => {
    const response = await axios.post<axiosResponse>(`${API_URL}/create-student`,data, getAuthHeaders());
    return response.data;
  },

  excelImport: async(data: StudentListData) => {
    const response = await axios.post<axiosResponse>(`${API_URL}/import`,data, getAuthHeaders());
    return response.data;
  }
};
    
export default StudentService;