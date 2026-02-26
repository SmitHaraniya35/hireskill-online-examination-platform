import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";

const AdminLayout: React.FC = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default AdminLayout;