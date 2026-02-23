import axios from 'axios';
import type{ axiosResponse } from '../types/index.types';
import type { StudentAttemptResponse, StudentAttemptsDetailsResponse } from '../types/studentAttempts.types';


const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}/student-attempt`;

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
    getStudentAttempt: async (problemId: string) => {
        const response = await axios.get<axiosResponse<StudentAttemptResponse>>(`${API_URL}/get-student-attempts-details/${problemId}`,getAuthHeaders());
        return response.data;
    },

    getStudentAttemptsDetails: async (testId: string) => {
        const response = await axios.get<axiosResponse<StudentAttemptsDetailsResponse>>(`${API_URL}/get-student-attempts-details/${testId}`,getAuthHeaders());
        return response.data;
    }
};
    
export default StudentAttemptService;