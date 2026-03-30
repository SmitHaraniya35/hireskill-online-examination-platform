// import axios from "axios";
import type {
  ForgotPassword,
  ForgotPasswordResponse,
  GetMeResponse,
  LoginData,
  LoginResponse,
  ResetPassword,
  VerifyOtp,
} from "../types/auth.types";
import type { axiosResponse } from "../types/index.types";
import api from "./api";

// const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}/auth`;
const API_URL = api.defaults.baseURL + "/auth";

// ✅ Only attach token if exists
const getAuthHeaders = () => {
  const token = localStorage.getItem("admin_token");

  if (!token) return {
    withCredentials: true
  };

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "69420",
    },
    withCredentials: true,
  };
};

const authService = {
  login: async (data: LoginData) => {
    const response = await api.post<axiosResponse<LoginResponse>>(
      `${API_URL}/login`,
      data,
      { withCredentials: true },
    );

    return response.data;
  },

  logout: async () => {
    const response = await api.post<axiosResponse>(
      `${API_URL}/logout`,
      {},
      getAuthHeaders(),
    );

    return response.data;
  },

  forgotPassword: async (data: ForgotPassword) => {
    const response = await api.post<axiosResponse<ForgotPasswordResponse>>(
      `${API_URL}/forgot-password`,
      data,
      { withCredentials: true },
    );

    return response.data;
  },

  verifyOtp: async (data: VerifyOtp) => {
    const response = await api.post<axiosResponse>(
      `${API_URL}/verify-otp`,
      data,
    );

    return response.data;
  },

  resetPassword: async (data: ResetPassword) => {
    const response = await api.post<axiosResponse>(
      `${API_URL}/reset-password`,
      data,
    );
    return response.data;
  },

  getMe: async () => {
    const response = await api.get<axiosResponse<GetMeResponse>>(
      `${API_URL}/me`,
      getAuthHeaders(),
    );

    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post<axiosResponse<any>>(
      `${API_URL}/refresh-token`,
      getAuthHeaders(),
    );

    return response.data;
  }
};

export default authService;


