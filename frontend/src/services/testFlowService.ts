import axios from '../services/axiosInstance';
import type { SubmissionData } from "./submissionService";

const API_BASE_URL = "https://marvella-uncontributed-stephania.ngrok-free.dev/api";

const getCommonHeaders = () => ({
  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
  withCredentials: true,
});

const testService = {
  createStudent: async (data: { name: string; email: string; phone: string }) => {
    const response = await axios.post(
      `${API_BASE_URL}/student/create-student`,
      data,
      getCommonHeaders()
    );
    return response.data;
  },

  getTestBySlug: async (slug: string) => {
    const response = await axios.get(
      `${API_BASE_URL}/test/${slug}`,
      getCommonHeaders()
    );
    return response.data;
  },

  startTest: async (slug: string, testId: string, studentId: string) => {
    const response = await axios.get(`${API_BASE_URL}/test/${slug}/start`, {
      params: {
        test_id: testId,
        student_id: studentId,
      },
      ...getCommonHeaders(),
    });
    return response.data;
  },
  
  finishTest: async(data: SubmissionData, slug: string) => {
    const response = await axios.post(`${API_BASE_URL}/test/${slug}/finish`, {
      ...data
    }, getCommonHeaders());
    console.log(response.data.payload);
    return response.data.payload;
  }
};

export default testService;

