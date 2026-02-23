import axios from 'axios';
import { type StartResponse, type CreateStudentData, type CreateStudentResponse, type FinishData,type TestDataResponse, type ValidateStudentAttemptResponse } from '../types/testFlow.types';
import type { axiosResponse } from '../types/index.types';

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_API_URL}`;

const getCommonHeaders = () => {
  const token = localStorage.getItem("admin_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "69420",
    },
    withCredentials: true,
  };
};

const testFlowService = {

   getTestBySlug: async (slug: string) => {
    const response = await axios.get<axiosResponse<TestDataResponse>>(`${API_BASE_URL}/test/${slug}`,getCommonHeaders());
    return response.data;
  },
  
  createStudent: async (data: CreateStudentData) => {
    const response = await axios.post<axiosResponse<CreateStudentResponse>>(`${API_BASE_URL}/student/create-student`,data,getCommonHeaders());
    return response.data;
  },

  validateStudentAttempt: async (id: string) => {
    const response = await axios.get<axiosResponse<ValidateStudentAttemptResponse>>(`${API_BASE_URL}/student-attempt/${id}/get-problem-id`,getCommonHeaders());
    return response.data;
  },

  startTest: async (slug: string, testId: string, studentId: string) => {
    const response = await axios.get<axiosResponse<StartResponse>>(`${API_BASE_URL}/test/${slug}/start`, {
      params: {
        test_id: testId,
        student_id: studentId,
      },
      ...getCommonHeaders(),
    });
    return response.data;
  },
  
  finishTest: async(slug: string, data: FinishData) => {
    const response = await axios.post<axiosResponse>(`${API_BASE_URL}/test/${slug}/finish`, data, getCommonHeaders());
    return response.data;
  }
};

export default testFlowService;

