import { type GetSubmissionResponse } from '../types/submission.types';
import type { axiosResponse } from '../types/index.types';
import api from './api';

const API_URL = api.defaults.baseURL + '/submission';

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

    getSubmissionService: async (submissionId: string) => {
        const response = await api.get<axiosResponse<GetSubmissionResponse>>(`${API_URL}/get-submission/${submissionId}`, getAuthHeaders());
        return response.data;
    },
};

export default submissionService;