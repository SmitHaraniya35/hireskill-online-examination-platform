import { Navigate,Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext"


const AdminRoutes: React.FC = () => {
    const {admin, isLoading} = useAuth();

    if(isLoading){
        return <div className="loading-screen">
            Loading...
        </div>
    }

    return admin ? 
    <Outlet />
    : <Navigate to="/admin/login" replace />;
}

export default AdminRoutes;