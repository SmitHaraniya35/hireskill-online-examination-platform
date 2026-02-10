import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import authService from "../services/authUserService";

interface AuthContextType {
    user: any | null;
    login: (name: string, email: string, phone:string) => Promise<void>
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const UserAuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = authService.getCurrentUser();
        if(storedUser){
            setUser(storedUser);
        }
        setLoading(false);
    },[]);

    const login = async(name: string, email: string, phone:string) => {
        const data = await authService.login(name,email,phone);
        setUser(data.payload.user);
    }

    const logout = () => {
        authService.logout();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user,login,logout,loading}}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

