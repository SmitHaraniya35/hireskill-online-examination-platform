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

// import axios from "axios";
// import type { AdminObject, ForgotPassword, ForgotPasswordResponse, Login, LoginResponse, ResetPassword, ResetPasswordResponse, VerifyOtp, VerifyOtpResponse } from "./types/authAdmin";

// const API_URL = 'https://marvella-uncontributed-stephania.ngrok-free.dev/api/auth';

// const authService = {

//     login: async(data: Login): Promise<LoginResponse> => {
//         const response = await axios.post(`${API_URL}/login`,data,{withCredentials: true});
//         if(response.data.payload?.user){
//             // save jwt token in local storage
//             localStorage.setItem('admin_token',response.data.payload.user.accessToken);
//             localStorage.setItem('admin_user',JSON.stringify(response.data.payload.user.admin));
//         }
//         return response.data;
//     },

//     logout: () => {
//         localStorage.removeItem('admin_token');
//         localStorage.removeItem('admin_user');
//     },

//     forgotPassword: async (data: ForgotPassword): Promise<ForgotPasswordResponse> => {
//         try {
//             const response = await axios.post(
//             `${API_URL}/forgot-password`,
//             data,
//             { withCredentials: true }
//             );

//            return response.data;

//         } catch (error: unknown) {
//             if (axios.isAxiosError(error)) {
//             // safely access axios error response
//             throw new Error(error.response?.data?.message || "User does not exist");
//             }

//             // non-axios unexpected error
//             throw new Error("Something went wrong");
//         }
//     },

//     verifyOtp: async (data: VerifyOtp): Promise<VerifyOtpResponse> => {
//         try {
//             const response = await axios.post(`${API_URL}/verify-otp`, data, { withCredentials: true });
//             return response.data;

//         } catch (error: unknown) {
//             if (axios.isAxiosError(error)) {
//                 throw new Error(error.response?.data?.message || "Invalid OTP");
//             }
//             throw new Error("Something went wrong");
//         }
//     },

//     resetPassword: async (data: ResetPassword): Promise<ResetPasswordResponse> => {
//         try {
//             const payload = data;
//             console.log("Sending reset password request with:", payload);
//             const response = await axios.post(`${API_URL}/reset-password`, payload);
//             console.log("Reset password response:", response.data);
//             return response.data;
//         } catch (error: unknown) {
//             if (axios.isAxiosError(error)) {
//                 console.error("Axios error response:", error.response);
//                 throw new Error(error.response?.data?.message || "Failed to reset password");
//             }
//             console.error("Unexpected error:", error);
//             throw new Error("Something went wrong");
//         }
//     },

//     getCurrentAdmin: (): AdminObject | null => {
//         const user = localStorage.getItem('admin_user');
//         if (!user || user === 'undefined') return null;
//         try {
//             return JSON.parse(user) as AdminObject;
//         } catch (e) {
//             return null;
//         }
//     }
// };

// export default authService;