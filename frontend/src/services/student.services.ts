import axios from "axios";
import type { GetAllStudentsListData, Student, StudentInfoData, StudentListData } from "../types/student.types";
import type { axiosResponse } from "../types/index.types";
import type { StudentData } from "../types/testFlow.types";

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
  getStudentById: async (id: string) => {
    const response = await axios.get<axiosResponse<StudentInfoData>>(`${API_URL}/get-student/${id}`, getAuthHeaders());
    return response.data;
  },

  excelImport: async(data: StudentListData) => {
    const response = await axios.post<axiosResponse>(`${API_URL}/import`,data, getAuthHeaders());
    return response.data;
  },

  getAllStudentsList: async() => {
    const response = await axios.get<axiosResponse<GetAllStudentsListData>>(`${API_URL}/get-all-student`, getAuthHeaders());
    return response.data;
  },

  updateStudent: async (id: string) => {
    const response = await axios.put<axiosResponse>(`${API_URL}/update-student/${id}`, getAuthHeaders());
    return response.data;
  },

   deleteStudent: async (id: string) => {
    const response = await axios.delete<axiosResponse>(`${API_URL}/delete-student/${id}`, getAuthHeaders());
    return response.data;
  }
};
    
export default StudentService;