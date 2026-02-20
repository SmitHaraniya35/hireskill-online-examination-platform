import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import authService from "../services/authAdminService";
import type { AuthContextType,Admin } from "../types/auth.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// provider component
export const AdminAuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [loading, setLoading] = useState(true);

    // check if admin is already logged in when app loads
    useEffect(() => {
        const storedAdmin = authService.getCurrentAdmin();
        if(storedAdmin){
            setAdmin(storedAdmin);
        }else{
            setAdmin(null);
        }
        setLoading(false);
    },[]);

    const login = async(email: string,password: string) => {
        const data = await authService.login(email,password);
        // authService.login returns response.data which contains payload.user
        if(data.payload){
            localStorage.setItem('admin_token',data.payload.accessToken);
            localStorage.setItem('admin_user',JSON.stringify(data.payload.user));
        }
        const user = data?.payload?.user || data?.user || authService.getCurrentAdmin();
        if (!user) throw new Error('Login failed');
        setAdmin(user);
        return data;
    }

    const logout = async () => {
        await authService.logout();
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_token');
        setAdmin(null);
    }

    return (
        <AuthContext.Provider value={{admin,login,logout,loading}}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};