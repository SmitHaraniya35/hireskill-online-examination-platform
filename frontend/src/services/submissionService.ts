import axios from '../services/axiosInstance';

const API_URL = 'https://marvella-uncontributed-stephania.ngrok-free.dev/api/submission';

export interface SubmissionData {
  student_attempt_id: string;
  problem_id: string;
  language: string;
  source_code: string;
  total_test_cases: number;
  passed_test_cases: number;
  status: string;
  execution_time?: string;
  memory_used?: string;
} 

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
            const res = await axios.get(`${API_URL}/${submissionId}`, getAuthHeaders());
            console.log(res.data);
            return res.data;
        }catch(error : any){

        }
    }
};

export default apiService;