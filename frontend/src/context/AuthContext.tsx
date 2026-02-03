import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import authService from "../services/authService";

// shape of Auth State
interface AuthContextType {
    admin: any | null;
    login: (email: string, password: string) => Promise<void>
    logout: () => void;
    loading: boolean;
}

// create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// provider component
export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [admin, setAdmin] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    // check if admin is already logged in when app loads
    useEffect(() => {
        const storedAdmin = authService.getCurrentAdmin();
        if(storedAdmin){
            setAdmin(storedAdmin);
        }
        setLoading(false);
    },[]);

    const login = async(email: string,password: string) => {
        const data = await authService.login(email,password);
        setAdmin(data.user);
    }

    const logout = () => {
        authService.logout();
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