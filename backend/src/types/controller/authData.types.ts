export interface Admin {
    id: string;
    email: string;
}

export interface LoginResponseData {
    admin: Admin;
    accessToken: string;
}

export interface LoginRequestData {
    email: string;
    password: string;
}

export interface VerifyOtpData {
    email: string;
    otp: string;
}

export interface ResetPasswordData {
    email: string;
    newPassword: string;
}