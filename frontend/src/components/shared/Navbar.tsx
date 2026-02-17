import LOGO from '../../assets/logo.svg'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    // Reusable tailwind classes for the NavLink
    const navLinkClasses = ({ isActive }: { isActive: boolean }) => `
        relative pb-1 text-[18px] font-bold transition-colors duration-300 group
        ${isActive ? 'text-[#1DA077]' : 'text-gray-800 hover:text-[#1DA077]'}
    `;

    // The animated underline logic
    const underlineClasses = "absolute bottom-0 left-1/2 w-0 h-[2px] bg-[#1DA077] transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0";

    return (
        <nav className="flex flex-row items-center justify-between h-auto px-6 py-2 bg-white shadow-sm font-mono">
            {/* Nav Left - Logo */}
            <div className="flex flex-row items-center justify-center">
                <div 
                    className="cursor-pointer" 
                    onClick={() => navigate('/admin/dashboard')}
                >
                    <img 
                        className="h-[60px] w-[210px] object-cover" 
                        src={LOGO} 
                        alt="logo" 
                    />
                </div>
            </div>

            {/* Nav Right - Links */}
            <div className="flex flex-row items-center justify-center gap-[60px] p-[10px]">
                <div className="nav-links">
                    <NavLink to="/admin/dashboard" reloadDocument className={navLinkClasses}>
                        Dashboard
                        <span className={underlineClasses}></span>
                    </NavLink>
                </div>
                <div className="nav-links">
                    <NavLink to="/admin/create-exam" reloadDocument className={navLinkClasses}>
                        Tests
                        <span className={underlineClasses}></span>
                    </NavLink>
                </div>
                <div className="nav-links">
                    <NavLink to="/admin/coding-problem" reloadDocument className={navLinkClasses}>
                        Coding problems
                        <span className={underlineClasses}></span>
                    </NavLink>
                </div>
                <div className="nav-links">
                    <NavLink to="/about" reloadDocument className={navLinkClasses}>
                        About
                        <span className={underlineClasses}></span>
                    </NavLink>
                </div>
                <div className="nav-links">
                    <NavLink 
                        to="/admin/login" 
                        className="relative pb-1 text-[18px] font-bold text-red-500 hover:text-red-700 transition-colors duration-300 group"
                    >
                        Logout
                        <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-red-500 transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0"></span>
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;