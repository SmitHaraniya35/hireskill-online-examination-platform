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
import api, { publicApi } from "./api";


const AUTH_URL = "/auth";


const authService = {
  // ─── Public routes (use publicApi — NO refresh token interceptor) ───────────


  login: async (data: LoginData) => {
    const response = await publicApi.post<axiosResponse<LoginResponse>>(
      `${AUTH_URL}/login`,
      data,
    );
    return response.data;
  },


  forgotPassword: async (data: ForgotPassword) => {
    const response = await publicApi.post<axiosResponse<ForgotPasswordResponse>>(
      `${AUTH_URL}/forgot-password`,
      data,
    );
    return response.data;
  },


  verifyOtp: async (data: VerifyOtp) => {
    const response = await publicApi.post<axiosResponse>(
      `${AUTH_URL}/verify-otp`,
      data,
    );
    return response.data;
  },


  resetPassword: async (data: ResetPassword) => {
    const response = await publicApi.post<axiosResponse>(
      `${AUTH_URL}/reset-password`,
      data,
    );
    return response.data;
  },


  // ─── Protected routes (use api — WITH refresh token interceptor) ────────────


  getMe: async () => {
    const response = await api.get<axiosResponse<GetMeResponse>>(
      `${AUTH_URL}/me`,
    );
    return response.data;
  },


  logout: async () => {
    const response = await api.post<axiosResponse>(
      `${AUTH_URL}/logout`,
      {},
      { withCredentials: true },
    );
    return response.data;
  },
};


export default authService;


