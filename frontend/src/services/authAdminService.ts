import axios from "axios";

// node.js backend url
const API_URL = 'https://marvella-uncontributed-stephania.ngrok-free.dev/api/auth';

const authService = {

    // admin login
    login: async(email: string, password: string) => {
        const response = await axios.post(`${API_URL}/login`,{email,password},{withCredentials: true});
        if(response.data.payload){
            // save jwt token in local storage
            localStorage.setItem('admin_token',response.data.payload.accessToken);
            localStorage.setItem('admin_user',JSON.stringify(response.data.payload.user));
        }
        return response.data;
    },

    // logout
    logout: () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
    },

    // forgot password
    // forgotPassword: async(email: string) => {
    //     const response = await axios.post(`${API_URL}/forgot-password`,{email},{withCredentials: true});
    //     console.log(response.data.payload.otp)
    //     return response.data.payload.otp;
    // },
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

    // verify OTP
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

    // reset password
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

    // get current admin data
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