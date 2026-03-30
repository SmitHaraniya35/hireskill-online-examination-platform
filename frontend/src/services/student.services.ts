// import axios from "axios";
import type {
  GetAllStudentsListData,
  Student,
  StudentInfo,
  StudentInfoData,
  StudentListData,
} from "../types/student.types";
import type { axiosResponse } from "../types/index.types";
import api from "./api";

// const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}/student`;
const API_URL = api.defaults.baseURL + "/student";

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
  createStudent: async (data: Student) => {
    const response = await api.post<axiosResponse>(
      `${API_URL}/create-student`,
      data,
      getAuthHeaders(),
    );
    return response.data;
  },
  getStudentById: async (id: string) => {
    const response = await api.get<axiosResponse<StudentInfoData>>(
      `${API_URL}/get-student/${id}`,
      getAuthHeaders(),
    );
    return response.data;
  },

  excelImport: async (data: StudentListData) => {
    const response = await api.post<axiosResponse>(
      `${API_URL}/import`,
      data,
      getAuthHeaders(),
    );
    return response.data;
  },

  getAllStudentsList: async () => {
    const response = await api.get<axiosResponse<GetAllStudentsListData>>(
      `${API_URL}/get-all-student`,
      getAuthHeaders(),
    );
    return response.data;
  },

  updateStudent: async (id: string, data: StudentInfo) => {
    const response = await api.put<axiosResponse>(
      `${API_URL}/update-student-profile/${id}`,data,
      getAuthHeaders(),
    );
    return response.data;
  },

  deleteStudent: async (id: string) => {
    const response = await api.delete<axiosResponse>(
      `${API_URL}/delete-student/${id}`,
      getAuthHeaders(),
    );
    return response.data;
  },
  deleteManyStudent: async (ids: string[]) => {
    const response = await api.delete<axiosResponse>(
      `${API_URL}/delete-many-student`,
      {
        ...getAuthHeaders(),
        data: { ids },
      },
    );
    return response.data;
  },
};

export default StudentService;
