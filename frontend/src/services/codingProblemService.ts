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

    createCodingProblem: async (problemData : any) => {
        try{
            const response = await axios.post(`${API_URL}/create-coding-problem`,{
                ...problemData,
                problem_description_image:"http://www.example.com/randomUrl"
            }, getAuthHeaders());
            return {success: true, payload: response.data.payload};
        }catch(error: any){
            return {success: false, message: error.response?.data?. message || "Failed to create codiing problem"};
        }
    },

    getCodingProblem: async (id: string) => {
        try {
            console.log("Requesting URL:", `${API_URL}/get-coding-problem/${id}`);
            const response = await axios.get(`${API_URL}/get-coding-problem/${id}`,getAuthHeaders());
            return {success: true, payload: response.data.payload};
            return 
        } catch (error: any) {
            return   {success: false, message: error.response?.data?.message || "Falied to fetch coding problem"};          
        }
    },

    getAllCodingProblem: async () => {
        try {
            const response = await axios.get(`${API_URL}/get-all-coding-problems`,getAuthHeaders());
            return {success: true, payload: response.data.payload};
        } catch (error: any) {
            return {success: false,message: error.response?.data?.message || "Failed to fetch coding problems"}
        }
    },

    updateCodingProblem: async (id: string, updateData: any) => {
        try {
            const response = await axios.put(`${API_URL}/update-coding-problem/${id}`,updateData, getAuthHeaders());
            return {success: true, updateCodingProblem: response.data.payload};
        } catch (error:any) {
            return {success: false, message: error.response?.data?.message || "Failed to update coding problem"};
        }
    },


    
    deleteCodingProblem: async (id: string) => {
        try {
            const response = await axios.delete(`${API_URL}/delete-coding-problem/${id}`,getAuthHeaders());
            return {success: true, message: response.data.message};
        } catch (error: any) {
            return {success: false, message: error.response?.data?.message || "Failed to delete coding problem"};
        }
    }
};

export default codingProblemService;