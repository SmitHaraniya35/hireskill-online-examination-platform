export interface CreateAdmin {
    email: string;
    password: string;
}

export interface Login {
    email: string;
    password: string;
}

export interface ForgotPassword {
    email:string;
}

export interface VerifyOtp {
    email:string;
    otp: string;
}

export interface ResetPassword {
    email: string;
    newPassword: string;
}

export interface Logout {
    userId: string;
}

export interface CreateClient {
    clientId: string;
}

export interface AdminObject {
    id: string;
    _id: string;
    email: string;
    password: string;
    refreshTokenId: string | null;
    passwordResetOtp: string | null;
    passwordResetOtpExpires: string | null;
    isOtpVerified: boolean;
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAdminResponse {
    success: boolean;
    message: string;
    payload: {
        data: {
            admin: AdminObject;
        }
    }
}   

export interface LoginResponse {
    success: boolean;
    message: string;
    payload: {
        user: {
            admin: AdminObject;
            accessToken: string;
            refreshToken: string;
        }
    }
}

export interface MeResponse {
    success: boolean;
    message: string;
    payload: {
        user: {
            email: string;
            id: string;
        }
    }
}

export interface ForgotPasswordResponse {
    success: boolean;
    message: string;
    payload: {
        otp: string;
    }
}

export interface VerifyOtpResponse {
    success: boolean;
    message: string;
    payload: string;
}

export interface ResetPasswordResponse {
    success: boolean;
    message: string;
    payload: string;
}

export interface RefreshTokenResponse {
    success: boolean;
    message: string;
    payload: {
        accessToken: string;
    }
}

export interface LogoutResponse {
    success: boolean;
    message: string;
    payload: string;
}

export interface CreateClientResponse {
    success: boolean;
    message: string;
    payload: {
        newClient: {
            clientId: string;
            apiKey: string;
            isActive: boolean;
            isDeleted: boolean;
            deletedAt: string | null;
            _id: string;
            id: string;
            createdAt: string;
            updatedAt: string;
        }
    }
}