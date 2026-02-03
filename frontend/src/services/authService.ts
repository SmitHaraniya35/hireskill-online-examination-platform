import axios from "axios";

// node.js backend url
const API_URL = 'http://localhost:5000/api/auth';

const authService = {

    // admin login
    login: async(email: string, password: string) => {
        const response = await axios.post(`${API_URL}/login`,{email,password});
        if(response.data.token){
            // save jwt token in local storage
            localStorage.setItem('admin_token',response.data.token);
            localStorage.setItem('admin_user',JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // logout
    logout: () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
    },

    // forgot password
    forgotPassword: async(email: string) => {
        const response = await axios.post(`${API_URL}/forgot-password`,{email});
        return response.data;
    },

    // reset password
    resetPassword: async (token: string, newPassword: string) => {
        const response = await axios.post(`${API_URL}/reset-password/${token}`,{
            password: newPassword,
        });
        return response.data;
    },

    // get current admin data
    getCurrentAdmin: () => {
        const user = localStorage.getItem('admin_user');
        return user ? JSON.parse(user) : null;
    }
};

export default authService;