import axios from 'axios';
import {
    type TestList,
    type TestDetails,
    type Test
} from "../types/test.types";
import type{ axiosResponse } from '../types/index.types';

const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}/test`;

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

    createTest: async (examData: Test) => {
        const response = await axios.post<axiosResponse<TestDetails>>(`${API_URL}/create-test`, examData, testLinkService.getHeaders());
        return response.data;
    },

    getAllTest: async () => {
        const response = await axios.get<axiosResponse<TestList>>(`${API_URL}/get-all-tests`, testLinkService.getHeaders());
        return response.data;
    },

    getTestDetails: async (id: string) => {
        const response = await axios.get<axiosResponse<TestDetails>>(`${API_URL}/get-test-details/${id}`, testLinkService.getHeaders());
        return response.data;      
    },

    updateTest: async (id: string, updateData: Test) => {
        const response = await axios.put<axiosResponse>(`${API_URL}/update-test/${id}`, updateData, testLinkService.getHeaders());
        return response.data;    
    },

    deleteTest: async (id: string) => {
        const response = await axios.delete<axiosResponse>(`${API_URL}/delete-test/${id}`, testLinkService.getHeaders());
        return response.data;
    },
};

export default testLinkService;