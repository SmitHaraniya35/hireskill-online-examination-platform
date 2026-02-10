import axios from "axios";

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
    // Create problem with test cases
    createCodingProblemWithTestCases: async (problemData: any, testCases: any[]) => {
        try {
            const response = await axios.post(
                `${API_URL}/create-coding-problem-with-testcases`,
                {
                    ...problemData,
                    // Store HTML content as-is
                    problem_description: problemData.problem_description, // HTML format
                    constraint: problemData.constraint, // HTML format
                    input_format: problemData.input_format, // HTML format
                    output_format: problemData.output_format, // HTML format
                    testCases: testCases.map((tc) => ({
                        input: tc.input,
                        expected_output: tc.output,
                        is_hidden: !tc.visible
                    }))
                },
                getAuthHeaders()
            );

            return {
                success: true,
                payload: response.data.payload
            };
        } catch (error: any) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to create coding problem with test cases"
            };
        }
    },

    // Update problem
    updateCodingProblem: async (id: string, updateData: any) => {
        try {
            const payload = {
                ...updateData,
                difficulty: updateData.difficulty.charAt(0).toUpperCase() + updateData.difficulty.slice(1),
                // Ensure HTML content is sent as-is
                problem_description: updateData.problem_description, // HTML format
                constraint: updateData.constraint, // HTML format
                input_format: updateData.input_format, // HTML format
                output_format: updateData.output_format, // HTML format
            };
            const response = await axios.put(`${API_URL}/update-coding-problem/${id}`, payload, getAuthHeaders());
            return { success: true, payload: response.data.payload };
        } catch (error: any) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Failed to update coding problem" 
            };
        }
    },

    getCodingProblem: async (id: string) => {
        try {
            const response = await axios.get(`${API_URL}/get-coding-problem/${id}`, getAuthHeaders());
            // Response will contain HTML formatted content
            return { success: true, payload: response.data.payload };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to fetch problem" };
        }
    },

    getAllCodingProblem: async () => {
        try {
            const response = await axios.get(`${API_URL}/get-all-coding-problems`, getAuthHeaders());
            return { success: true, payload: response.data.payload };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to fetch problems" };
        }
    },

    deleteCodingProblem: async (id: string) => {
        try {
            const response = await axios.delete(`${API_URL}/delete-coding-problem/${id}`, getAuthHeaders());
            return { success: true, message: response.data.message };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to delete problem" };
        }
    }
};

export default codingProblemService;