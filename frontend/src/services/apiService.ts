import axios from "axios";

// Base URL following your test-link naming convention
const API_URL = 'https://marvella-uncontributed-stephania.ngrok-free.dev/api/submission';

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

const apiService = {
    runCodeService: async (inputData: any) => {
        try {
            const response = await axios.post(`${API_URL}/run`, inputData, getAuthHeaders());
            return { success: true, payload: response.data.payload };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to create link" };
        }
    },

    submitCodeService: async (inputData: any) => {
        try{
            const response = await axios.post(`${API_URL}/submit`, inputData, getAuthHeaders());
            return { success: true, payload: response.data.payload };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to submit code" };
        }
    },
    fetchTestCaseOutput: async (submissionId: string) => {
        try{
            const {data} = await axios.get(`${API_URL}/${submissionId}`, getAuthHeaders());
            return data;
        }catch(error : any){

        }
    }
};

export default apiService;