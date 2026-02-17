import axios from "axios";

import type { GetStudentAttemptsResponse } from "../types/StudentAttempts";

// Base URL following your test-link naming convention
const API_URL = 'https://marvella-uncontributed-stephania.ngrok-free.dev/api/student-attempt';

// Helper function to get auth headers
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
    getStudentAttempts: async (
        problemId: string
    ): Promise<GetStudentAttemptsResponse> => {
        const response = await axios.get<GetStudentAttemptsResponse>(
            `${API_URL}/get-student-attempts-details/${problemId}`,
            getAuthHeaders()
        );

        return response.data;
    }
}
    
export default StudentAttemptService;