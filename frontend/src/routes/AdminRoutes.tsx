import {Navigate, Outlet } from "react-router-dom";
import { AdminAuthProvider, useAuth } from "../context/authContext"


const AdminRoutes: React.FC = () => {
    const {admin, isLoading} = useAuth();
    console.log(admin, isLoading);
    
    if(isLoading){
        return <div className="loading-screen">
            Loading...
        </div>
    }

    if(!admin){
        return <Navigate to="/admin/login" replace />
    }
    return (
        <Outlet />
    )
}

export default AdminRoutes;