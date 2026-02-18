import axios from '../services/axiosInstance';

const API_URL = 'https://marvella-uncontributed-stephania.ngrok-free.dev/api/coding-problem';

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

const codingProblemService = {
    createCodingProblemWithTestCases: async (problemData: any, testCases: any[]) => {
        try {
            const response = await axios.post(
                `${API_URL}/create-coding-problem-with-testcases`,
                {
                    ...problemData,
                    problem_description: problemData.problem_description,
                    constraint: problemData.constraint,
                    input_format: problemData.input_format,
                    output_format: problemData.output_format,
                    testCases: testCases.map((tc) => ({
                        input: tc.input,
                        expected_output: tc.output,
                        is_hidden: !tc.visible
                    }))
                },
                getAuthHeaders()
            );
            console.log("API response from createCodingProblemWithTestCases:", response.data.message, response.data.payload);

            return {
                success: true,
                payload: response.data.payload
            };
        } catch (error: any) {
            console.error('[codingProblemService] createCodingProblemWithTestCases error', error?.response?.data || error.message || error);
            return {
                success: false,
                message: error.response?.data?.message || "Failed to create coding problem with test cases",
                errors: error.response?.data?.errors || null
            };
        }
    },

    updateCodingProblemWithTestCases: async (id: string, updateData: any) => {
        try {
            const payload = {
                ...updateData,
                difficulty: updateData.difficulty.charAt(0).toUpperCase() + updateData.difficulty.slice(1),
                problem_description: updateData.problem_description,
                constraint: updateData.constraint,
                input_format: updateData.input_format,
                output_format: updateData.output_format,
            };
            
            const response = await axios.patch(
                `${API_URL}/update-coding-problem-with-testcases/${id}`, 
                payload, 
                getAuthHeaders()
            );
            
            return { 
                success: true, 
                payload: response.data.payload 
            };
        } catch (error: any) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Failed to update coding problem" 
            };
        }
    },

    getCodingProblem: async (id: string) => {
        try {
            const response = await axios.get(
                `${API_URL}/get-coding-problem/${id}`, 
                getAuthHeaders()
            );
            return { success: true, payload: response.data.payload };
        } catch (error: any) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Failed to fetch problem" 
            };
        }
    },
    
    getCodingProblemWithTestCases: async (id: string) => {
        try {
            const response = await axios.get(
                `${API_URL}/get-coding-problem-with-testcases/${id}`,
                getAuthHeaders()
            );

            return {
                success: true,
                payload: response.data.payload.codingProblemWithTestCases, 
            };
        } catch (error: any) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to fetch problem with test cases",
            };
        }
    },

    getAllCodingProblem: async () => {
        try {
            const response = await axios.get(
                `${API_URL}/get-all-coding-problems`, 
                getAuthHeaders()
            );
            return { success: true, payload: response.data.payload };
        } catch (error: any) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Failed to fetch problems" 
            };
        }
    },

    deleteCodingProblem: async (id: string) => {
        try {
            const response = await axios.delete(
                `${API_URL}/delete-coding-problem/${id}`, 
                getAuthHeaders()
            );
            return { success: true, message: response.data.message };
        } catch (error: any) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Failed to delete problem" 
            };
        }
    }
};

export default codingProblemService;