export interface Admin {
    id: string;
    email: string;
}

export interface LoginResponse {
    admin: Admin;
    accessToken: string;
}