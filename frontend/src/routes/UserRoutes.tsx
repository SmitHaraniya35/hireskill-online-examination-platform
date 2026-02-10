import { Navigate,Outlet } from "react-router-dom";
import { useAuth } from "../context/UserAuthContext";

const UserRoutes: React.FC = () => {
    const {user, loading} = useAuth();

    if(loading){
        return <div className="loading-screen">
            Loading...
        </div>
    }
    return user ? 
    <Outlet />
    : <Navigate to="/user/login" replace />;
}

export default UserRoutes;