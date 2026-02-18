import axios from '../services/axiosInstance';
import type { LogoutResponse } from "../types/authAdmin";

const API_URL = 'https://marvella-uncontributed-stephania.ngrok-free.dev/api/auth';

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

const authService = {

    login: async(email: string, password: string) => {
        const response = await axios.post(`${API_URL}/login`,{email,password},{withCredentials: true});
        return response.data;
    },

    // logout: () => {
    //     localStorage.removeItem('admin_token');
    //     localStorage.removeItem('admin_user');
    // },
    logout: async():Promise<LogoutResponse> => {
        const response = await axios.post(`${API_URL}/logout`,{},getAuthHeaders());
        return response.data;
    },

    forgotPassword: async (email: string) => {
        try {
            const response = await axios.post(
            `${API_URL}/forgot-password`,
            { email },
            { withCredentials: true }
            );

            return {
            success: true,
            otp: response.data.payload.otp,
            message: response.data.message
            };

        } catch (error: any) {
            return {
            success: false,
            message: error.response?.data?.message || "User does not exist"
            };
        }
    },

    verifyOtp: async (email: string, otp: string) => {
        try {
            const response = await axios.post(`${API_URL}/verify-otp`, {
                email,
                otp
            });
            return {
                success: true,
                message: response.data.message,
                payload: response.data.payload
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to verify OTP"
            };
        }
    },

    resetPassword: async (email: string, newPassword: string) => {
        try {
            const payload = { email, newPassword };
            console.log("Sending reset password request with:", payload);
            const response = await axios.post(`${API_URL}/reset-password`, payload);
            console.log("Reset password response:", response.data);
            return {
                success: true,
                message: response.data.message,
                payload: response.data.payload
            };
        } catch (error: any) {
            console.error("Reset password error:", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Failed to reset password"
            };
        }
    },

    getCurrentAdmin: () => {
        const user = localStorage.getItem('admin_user');
        if (!user || user === 'undefined') return null;
        try {
            return JSON.parse(user);
        } catch (e) {
            return null;
        }
    }
};

export default authService;
