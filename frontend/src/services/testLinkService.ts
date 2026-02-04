import axios from "axios";

// Base URL following your test-link naming convention
const API_URL = 'https://marvella-uncontributed-stephania.ngrok-free.dev/api/test-link';

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true
    };
};

const testLinkService = {
    // POST create-test-link
    createTestLink: async (examData: any) => {
        try {
            const response = await axios.post(`${API_URL}/create-test-link`, examData, getAuthHeaders());
            return { success: true, payload: response.data.payload };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to create link" };
        }
    },

    // GET get-all-test-links
    getAllTestLinks: async () => {
        try {
            const response = await axios.get(`${API_URL}/get-all-test-links`, getAuthHeaders());
            return { success: true, payload: response.data.payload };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to fetch links" };
        }
    },

    // GET get-test-link-details
    getTestLinkDetails: async (id: string) => {
        try {
            const response = await axios.get(`${API_URL}/get-test-link-details/${id}`, getAuthHeaders());
            return { success: true, payload: response.data.payload };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to fetch details" };
        }
    },

    // DEL delete-test-link
    deleteTestLink: async (id: string) => {
        try {
            const response = await axios.delete(`${API_URL}/delete-test-link/${id}`, getAuthHeaders());
            return { success: true, message: response.data.message };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to delete link" };
        }
    }
};

export default testLinkService;