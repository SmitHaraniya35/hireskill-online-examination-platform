import { Navigate,Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"


const AdminRoutes: React.FC = () => {
    const {admin, loading} = useAuth();

    if(loading){
        return <div className="loading-screen">
            Loading...
        </div>
    }

    return admin ? 
    <Outlet />
    : <Navigate to="/admin/login" replace />;
}

export default AdminRoutes;