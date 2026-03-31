import { AdminAuthProvider } from "@/context/authContext"
import { Outlet } from "react-router-dom"


const AdminAuthProviderWrapper: React.FC = () => {
    return (
        <AdminAuthProvider>
            <Outlet />
        </AdminAuthProvider>
    )
}

export default AdminAuthProviderWrapper;
