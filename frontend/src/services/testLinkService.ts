import axios from "axios";
import type { 
    CreateTestInput, 
    UpdateTestInput, 
    CreateResponse, 
    GetAllResponse, 
    GetDetailsResponse, 
    ActionSuccessResponse 
} from "../types/testLink";

const API_URL = 'https://marvella-uncontributed-stephania.ngrok-free.dev/api/test';

const testLinkService = {
    getHeaders: () => {
        const token = localStorage.getItem('admin_token');
        return {
            headers: {
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "69420"
            },
            withCredentials: true
        };
    },

    createTestLink: async (examData: CreateTestInput) => {
        try {
            // Detailed logging for debugging date formats
            console.group("🚀 API CALL: createTestLink");
            console.log("Endpoint:", `${API_URL}/create-test`);
            console.log("Data Payload:", examData);
            console.log("Expiration String Sent:", examData.expiration_at);
            console.groupEnd();

            const response = await axios.post(`${API_URL}/create-test`, examData, testLinkService.getHeaders());
            const data: CreateResponse = response.data;
            return { success: true, payload: data.payload };
        } catch (error: any) {
            console.error("❌ Error in createTestLink:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.message || "Failed to create link" };
        }
    },

    getAllTestLinks: async () => {
        try {
            const response = await axios.get(`${API_URL}/get-all-tests`, testLinkService.getHeaders());
            const data: GetAllResponse = response.data;
            return { success: true, payload: data.payload };
        } catch (error: any) {
            console.error("❌ Error in getAllTestLinks:", error);
            return { success: false, message: error.response?.data?.message || "Failed to fetch links" };
        }
    },

    getTestLinkDetails: async (id: string) => {
        try {
            const response = await axios.get(`${API_URL}/get-test-details/${id}`, testLinkService.getHeaders());
            const data: GetDetailsResponse = response.data;
            return { success: true, payload: data.payload };
        } catch (error: any) {
            console.error("❌ Error in getTestLinkDetails:", error);
            return { success: false, message: error.response?.data?.message || "Failed to fetch details" };
        }
    },

    updateTestLink: async (id: string, updateData: UpdateTestInput) => {
        try {
            console.group("🔄 API CALL: updateTestLink");
            console.log("Target ID:", id);
            console.log("Update Payload:", updateData);
            console.log("Expiration String Sent:", updateData.expiration_at);
            console.groupEnd();

            const response = await axios.put(`${API_URL}/update-test/${id}`, updateData, testLinkService.getHeaders());
            const data: ActionSuccessResponse = response.data;
            return { success: true, payload: data.payload };
        } catch (error: any) {
            console.error("❌ Error in updateTestLink:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.message || "Failed to update link" };
        }
    },

    deleteTestLink: async (id: string) => {
        try {
            const response = await axios.delete(`${API_URL}/delete-test/${id}`, testLinkService.getHeaders());
            const data: ActionSuccessResponse = response.data;
            return { success: true, message: data.message };
        } catch (error: any) {
            console.error("❌ Error in deleteTestLink:", error);
            return { success: false, message: error.response?.data?.message || "Failed to delete link" };
        }
    }
};

export default testLinkService;