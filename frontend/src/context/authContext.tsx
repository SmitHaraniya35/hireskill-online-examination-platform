import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import authService from "../services/auth.services";
import type { AuthContextType, Admin } from "../types/auth.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // ✅ Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { success, payload } = await authService.getMe();

        if (success && payload) {
          setAdmin(payload.user);
        } else {
          setAdmin(null);
        }
      } catch (error) {
        // If 401 or error → just clear admin
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ Login
  const login = async (email: string, password: string) => {
    try {
      const { success, payload, message } =
        await authService.login({ email, password });

      if (!success || !payload) {
        throw new Error(message || "Login failed");
      }

      setAdmin(payload.admin);

      // Store token
      localStorage.setItem("admin_token", payload.accessToken);
    } catch (err: any) {
        console.log(err.response?.data?.message)
      throw new Error(
        err.response?.data?.errors || err.response?.data?.message || "Login failed"
      );
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Even if API fails, we clear locally
    } finally {
      localStorage.removeItem("admin_token");
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        login,
        logout,
        isLoading,
        isError,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AdminAuthProvider");
  }

  return context;
};