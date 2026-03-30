import axios from 'axios';
import type{ axiosResponse } from '../types/index.types';
import type { GetStudentAttemptSubmissionDetailsAndResultResponse, StudentAttemptResponse, StudentAttemptsDetailsResponse } from '../types/studentAttempts.types';
import api from './api';

// const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}/student-attempt`;
const API_URL = api.defaults.baseURL + "/student-attempt";

const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420"
        },
        withCredentials: true
    };
};

const StudentAttemptService = {
    getStudentAttempt: async (studentAttemptId: string) => {
        const response = await api.get<axiosResponse<StudentAttemptResponse>>(`${API_URL}/get-student-attempt/${studentAttemptId}`,getAuthHeaders());
        return response.data;
    },

    getStudentAttemptsDetails: async (testId: string) => {
        const response = await api.get<axiosResponse<StudentAttemptsDetailsResponse>>(`${API_URL}/get-student-attempts-details/${testId}`,getAuthHeaders());
        return response.data;
    },

    getStudentAttemptSubmissionDetailsAndResult: async (id: string ) => {
        const response = await api.get<axiosResponse<GetStudentAttemptSubmissionDetailsAndResultResponse>>(`${API_URL}/get-student-attempt-submission-details-and-result/${id}`,getAuthHeaders());
        return response.data;
    },

    deleteStudentAttempt: async (id: string) => {
        const response = await api.delete<axiosResponse>(`${API_URL}/delete-student-attempt/${id}`,getAuthHeaders());
        return response.data;
    }

};
    
export default StudentAttemptService;