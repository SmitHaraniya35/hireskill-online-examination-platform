import axios from 'axios';
import { type GetSubmissionResponse, type SubmitResponse, type RunData, type RunResponse, type SubmitData } from '../types/submission.types';
import type { axiosResponse } from '../types/index.types';
import type { SubmissionByStudentAttemptId } from '../types/studentAttempts.types';

const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}/submission`;


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


const submissionService = {

    runCodeService: async (inputData: RunData) => {
        const response  = await axios.post<axiosResponse<RunResponse> >(`${API_URL}/run`, inputData, getAuthHeaders());
        return response.data;
    },

    submitCodeService: async (inputData:SubmitData ) => {
        const response = await axios.post<axiosResponse<SubmitResponse>>(`${API_URL}/submit`, inputData, getAuthHeaders());
        return response.data;
    },

    getSubmissionService: async (submissionId: string) => {
        const response = await axios.get<axiosResponse<GetSubmissionResponse>>(`${API_URL}/${submissionId}`, getAuthHeaders());
        return response.data;
    },
    getSubmissionByStudentAttemptId: async (studentAttemptId: string) => {
        const response = await axios.get<axiosResponse<SubmissionByStudentAttemptId>>(`${API_URL}/get-submission-by-student-attempt-id/${studentAttemptId}`,getAuthHeaders());
        return response.data;
    }
};

export default submissionService;