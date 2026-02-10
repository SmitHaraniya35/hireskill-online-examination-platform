import axios from 'axios';

const API_URL = 'https://marvella-uncontributed-stephania.ngrok-free.dev/api/auth';

const authService = {

    login: async(name: string, email: string, phone:string) => {
        const response = await axios.post(`${API_URL}/student/create-student`,{name,email,phone},{withCredentials: true});
        if(response.data.payload){
            // save jwt token in local storage
            localStorage.setItem('user_token',response.data.payload.accessToken);
            localStorage.setItem('user_info',JSON.stringify(response.data.payload.user));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_info');
    },

    getCurrentUser: () => {
        const userInfo = localStorage.getItem('user_info');
        return userInfo ? JSON.parse(userInfo) : null;
    }
};

export default authService;