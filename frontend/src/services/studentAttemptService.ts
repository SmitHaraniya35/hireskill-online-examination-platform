import axios from '../services/axiosInstance';

import type { GetStudentAttemptsResponse } from "../types/StudentAttempts";

const API_URL = 'https://marvella-uncontributed-stephania.ngrok-free.dev/api/student-attempt';

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
    getStudentAttempts: async (problemId: string): Promise<GetStudentAttemptsResponse> => {
        const response = await axios.get<GetStudentAttemptsResponse>(
            `${API_URL}/get-student-attempts-details/${problemId}`,
            getAuthHeaders()
        );
        return response.data;
    },

    validateStudentAttempt: async (studentAttemptId: string) => {
        try {
            const response = await axios.get(
                `${API_URL}/${studentAttemptId}/get-problem-id`,
                getAuthHeaders()
            );
            console.log("Validate Attempt Response:", response.data);
            return response.data;
        } catch (error: any) {
            console.warn("validateStudentAttempt error:", error?.response?.status, error?.response?.data || error?.message);
            return { success: false, message: error?.response?.data?.message || error?.message || 'Validation failed' };
        }
    }
};
    
export default StudentAttemptService;