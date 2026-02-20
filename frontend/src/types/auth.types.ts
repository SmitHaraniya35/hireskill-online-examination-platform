export interface Admin {
    email: string;
    password: string;
    access_token: string;
}

export interface AuthContextType {
    admin: Admin | null;
    login: (email: string, password: string) => Promise<void>
    logout: () => void;
    loading: boolean;
}