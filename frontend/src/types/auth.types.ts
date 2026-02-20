export interface Admin {
    email: string;
    id: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    admin: Admin;
    accessToken: string;
}

export interface GetMeResponse {
    user: Admin;
}

export interface ForgotPassword {
    email: string
}

export interface ForgotPasswordResponse {
    otp : string;
}

export interface VerifyOtp {
    email: string;
    otp: string;
}

export interface ResetPassword {
    email: string;
    newPassword: string;
}

export interface AuthContextType {
    admin: Admin | null;
    login: (email: string, password: string) => Promise<void>
    logout: () => void;
    isLoading: boolean;
    isError: boolean;
}