import axios from "axios";
import {
  type StartResponse,
  type CreateStudentData,
  type CreateStudentResponse,
  type FinishData,
  type TestDataResponse,
  type ValidateStudentAttemptResponse,
  type ValidateStudentAttemptByEmailAndTestData,
  type ValidateStudentAttemptByEmailAndTestIdResponse,
  type StudentData,
  type GetTestDataByStudentAttemptIdResponse,
  type SaveDraftData,
  type RunCodeData,
  type RunCodeRespone,
  type WorkerResponse,
  type SubmitCodeData,
  type SubmitCodeResponse,
  type ValidateStudentAttemptById,
} from "../types/testFlow.types";
import type { axiosResponse } from "../types/index.types";
import type { StudentAttemptResponse } from "../types/studentAttempts.types";

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
    const response = await axios.get<axiosResponse<TestDataResponse>>(
      `${API_BASE_URL}/test/${slug}`,
      getCommonHeaders(),
    );
    return response.data;
  },

  validateStudentAttemptByEmailAndTestId: async (
    data: ValidateStudentAttemptByEmailAndTestData,
  ) => {
    const response = await axios.post<
      axiosResponse<ValidateStudentAttemptByEmailAndTestIdResponse>
    >(
      `${API_BASE_URL}/student-attempt/validate-student-attempt-by-email-and-test-id`,
      data,
      getCommonHeaders(),
    );
    return response.data;
  },

  completeStudentDetails: async (data: StudentData, id: string) => {
    const response = await axios.put<axiosResponse>(
      `${API_BASE_URL}/student/complete-student-profile/${id}`,
      data,
      getCommonHeaders(),
    );
    return response.data;
  },
  
  validateStudentAttempt: async (id: string) => {
    const response = await axios.get<
      axiosResponse<ValidateStudentAttemptResponse>
    >(
      `${API_BASE_URL}/student-attempt/${id}/get-problem-id`,
      getCommonHeaders(),
    );
    return response.data;
  },

  createStudent: async (data: CreateStudentData) => {
    const response = await axios.post<axiosResponse<CreateStudentResponse>>(
      `${API_BASE_URL}/student/create-student`,
      data,
      getCommonHeaders(),
    );
    return response.data;
  },

  startTest: async (slug: string, testId: string, studentId: string) => {
    const response = await axios.get<axiosResponse<StartResponse>>(
      `${API_BASE_URL}/test/${slug}/start`,
      {
        params: {
          test_id: testId,
          student_id: studentId,
        },
        ...getCommonHeaders(),
      },
    );
    return response.data;
  },

  getTestDataByStudentAttemptId: async (
    slug: string,
    studentAttemptId: string,
  ) => {
    const response = await axios.get<
      axiosResponse<GetTestDataByStudentAttemptIdResponse>
    >(
      `${API_BASE_URL}/test/${slug}/get-test-data/${studentAttemptId}`,
      getCommonHeaders(),
    );
    return response.data;
  },

  attempted: async (id: string) => {
    const response = await axios.put<axiosResponse>(
      `${API_BASE_URL}/student-assigned-problem/attempted/${id}`,
      {},
      getCommonHeaders(),
    );
    return response.data;
  },

  saveDraft: async (id: string, data: SaveDraftData) => {
    const response = await axios.put<axiosResponse>(
      `${API_BASE_URL}/student-assigned-problem/save-draft/${id}`,
      data,
      getCommonHeaders(),
    );
    return response.data;
  },

  submitted: async (id: string) => {
    const response = await axios.put<axiosResponse>(
      `${API_BASE_URL}/student-assigned-problem/submitted/${id}`,{},
      getCommonHeaders(),
    );
    return response.data;
  },

  runCodeService: async (data: RunCodeData) => {
    const response = await axios.post<axiosResponse<WorkerResponse>>(`${API_BASE_URL}/executor/run`, data, getCommonHeaders());
    return response.data;
  },
  
  submitCodeService: async (data: SubmitCodeData) => {
    const response = await axios.post<axiosResponse<SubmitCodeResponse>>(`${API_BASE_URL}/executor/submit`, data, getCommonHeaders());
    return response.data;
  },

  finishTestService: async (slug: string, data: FinishData) => {
    const response = await axios.post<axiosResponse<StudentAttemptResponse>>(
      `${API_BASE_URL}/test/${slug}/finish`,
      data,
      getCommonHeaders(),
    );
    return response.data;
  },
  validateStudentAttemptById: async (id: string) => {
    const response = await axios.get<axiosResponse<ValidateStudentAttemptById>>(`${API_BASE_URL}/student-attempt/validate-student-attempt/${id}`,getCommonHeaders());
    return response.data;
  }
};

export default testFlowService;
