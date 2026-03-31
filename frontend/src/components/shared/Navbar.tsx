// import LOGO from '../../assets/logo.svg'
// import { NavLink, useNavigate } from 'react-router-dom'
// import authAdminService from '../../services/auth.services'
// import { useAuth } from '../../context/authContext';

// const Navbar: React.FC = () => {
//     const navigate = useNavigate();
//     const {logout} = useAuth();

//     const handleLogout = async(e: React.MouseEvent) => {
//         e.preventDefault();
//         try {
//             const res = await authAdminService.logout();
//             if(res.success){
//                 logout();
//                 navigate('/admin/login');
//             }
//         }catch(err) {
//             console.log("Logout failed:",err);
//         }
//     }

//     // Reusable tailwind classes for the NavLink
//     const navLinkClasses = ({ isActive }: { isActive: boolean }) => `
//         relative pb-1 text-[18px] font-semibold transition-colors duration-300 group
//         ${isActive ? 'text-[#1DA077]' : 'text-gray-800 hover:text-[#1DA077]'}
//     `;

//     // The animated underline logic
//     const underlineClasses = "absolute bottom-0 left-1/2 w-0 h-[2px] bg-[#1DA077] transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0";

//     return (
//         <nav className="flex flex-row items-center justify-between h-auto px-6 py-2 bg-white shadow-sm ">
//             <div className="flex flex-row items-center justify-center">
//                 <div 
//                     className="cursor-pointer" 
//                     onClick={() => navigate('/admin/dashboard')}
//                 >
//                     <img 
//                         className="h-[50px] w-[210px] object-cover" 
//                         src={LOGO} 
//                         alt="logo" 
//                     />
//                 </div>
//             </div>

//             <div className="flex flex-row items-center justify-center gap-[60px] p-[10px]">
//                 <div className="nav-links">
//                     <NavLink to="/admin/dashboard"  className={navLinkClasses}>
//                         Dashboard
//                         <span className={underlineClasses}></span>
//                     </NavLink>
//                 </div>
//                 <div className="nav-links">
//                     <NavLink to="/admin/create-exam"  className={navLinkClasses}>
//                         Tests
//                         <span className={underlineClasses}></span>
//                     </NavLink>
//                 </div>
//                 <div className="nav-links">
//                     <NavLink to="/admin/coding-problem" className={navLinkClasses}>
//                         Coding problems
//                         <span className={underlineClasses}></span>
//                     </NavLink>
//                 </div>
//                 <div className="nav-links">
//                     <NavLink to="/admin/student-management"  className={navLinkClasses}>
//                         Student management
//                         <span className={underlineClasses}></span>
//                     </NavLink>
//                 </div>
//                 <div className="nav-links">
//                     <NavLink 
//                         to="/admin/login" 
//                         onClick={handleLogout}
//                         className="relative pb-1 text-[18px] font-bold text-red-500 hover:text-red-700 transition-colors duration-300 group"
//                     >
//                         Logout
//                         <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-red-500 transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0"></span>
//                     </NavLink>
//                 </div>
//             </div>
//         </nav>
//     );
// }
// export default Navbar;

import LOGO from "../../assets/logo.svg";
import { NavLink, useNavigate } from "react-router-dom";
import authAdminService from "../../services/auth.services";
import { useAuth } from "../../context/authContext";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // or any icon you prefer

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await authAdminService.logout();
      if (res.success) {
        logout();
        navigate("/admin/login");
      }
    } catch (err) {
      console.log("Logout failed:", err);
    }
  };

  // NavLink styles (same logic, removed extra space)
  const navLinkClasses = ({ isActive }: { isActive: boolean }) => `
    relative pb-1 text-[18px] font-semibold transition-colors duration-300 group
    ${isActive ? "text-[#1DA077]" : "text-gray-800 hover:text-[#1DA077]"}
  `;

  const underlineClasses =
    "absolute bottom-0 left-1/2 w-0 h-[2px] bg-[#1DA077] transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0";

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/create-exam", label: "Tests" },
    { to: "/admin/coding-problem", label: "Coding problems" },
    { to: "/admin/student-management", label: "Student management" },
  ];

  return (
    <nav className="flex flex-col bg-white shadow-sm">
      {/* Desktop / Large screens */}
      <div className="hidden md:flex flex-row items-center justify-between h-18 px-6 py-2">
        <div
          className="cursor-pointer"
          onClick={() => navigate("/admin/dashboard")}
        >
          <img
            className="h-[50px] w-[150px] object-cover"
            src={LOGO}
            alt="logo"
          />
        </div>

        <div className="flex flex-row items-center gap-15">
          {navItems.map((item) => (
            <div key={item.to} className="nav-links">
              <NavLink to={item.to} className={navLinkClasses}>
                {item.label}
                <span className={underlineClasses}></span>
              </NavLink>
            </div>
          ))}
          <div className="nav-links">
            <NavLink
              to="/admin/login"
              onClick={handleLogout}
              className="relative pb-1 text-[18px] font-bold text-red-500 hover:text-red-700 transition-colors duration-300 group"
            >
              Logout
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-red-500 transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0"></span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet: header + hamburger */}
      <div className="md:hidden flex flex-row items-center justify-between px-4 py-3">
        <div
          className="cursor-pointer"
          onClick={() => navigate("/admin/dashboard")}
        >
          <img
            className="h-10 w-42.5 object-cover"
            src={LOGO}
            alt="logo"
          />
        </div>

        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="text-gray-800 hover:text-[#1DA077] focus:outline-none"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile menu (visible only when opened) */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col bg-white border-t border-gray-200 px-4 py-4 space-y-4">
          {navItems.map((item) => (
            <div key={item.to} className="nav-links">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `block text-lg font-semibold ${
                    isActive ? "text-[#1DA077]" : "text-gray-800 hover:text-[#1DA077]"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            </div>
          ))}
          <div className="nav-links">
            <button
              onClick={handleLogout}
              className="block text-lg font-bold text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;