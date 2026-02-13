import axios from "axios";

// Base URL following your test-link naming convention
const API_URL = 'https://marvella-uncontributed-stephania.ngrok-free.dev/api/test';

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

const testLinkService = {
    // POST create-test-link
    createTestLink: async (examData: any) => {
        try {
            const response = await axios.post(`${API_URL}/create-test`, examData, getAuthHeaders());
            return { success: true, payload: response.data.payload };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to create link" };
        }
    },

    // GET get-all-test-links
    getAllTestLinks: async () => {
        try {
            const response = await axios.get(`${API_URL}/get-all-tests`, getAuthHeaders());
            return { success: true, payload: response.data.payload };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to fetch links" };
        }
    },

    // GET get-test-link-details
    getTestLinkDetails: async (id: string) => {
        try {
            const response = await axios.get(`${API_URL}/get-test-details/${id}`, getAuthHeaders());
            return { success: true, payload: response.data.payload };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to fetch details" };
        }
    },
    
    // PUT update-test-link
    updateTestLink: async (id: string, updateData: any) => {
        try {
            const response = await axios.put(`${API_URL}/update-test/${id}`, updateData, getAuthHeaders());
            return { success: true, updatedTestLink: response.data.payload };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to update link" };
        }
    },

    // DEL delete-test-link
    deleteTestLink: async (id: string) => {
        try {
            const response = await axios.delete(`${API_URL}/delete-test/${id}`, getAuthHeaders());
            return { success: true, message: response.data.message };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to delete link" };
        }
    },

    validateTestLink: async (slug: string ) => {
        try {
            const response = await axios.get(`${API_URL}/validate-test-link/${slug}`);
            return { success: true, payload: response.data.payload };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Failed to validate link" };
        }
    }
};

export default testLinkService;