import LOGO from '../assets/site-logo.png'
import './Navbar.css'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar:React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="nav-container">
                <div className="nav-left">
                    <div className="site-logo" onClick={() => navigate('/admin/dashboard')} style={{ cursor: 'pointer' }}>
                        <img className='logo' src={LOGO} alt="logo" />
                    </div>
                </div>
                <div className="nav-right">
                    <div className="nav-links">
                        <NavLink to="/admin/dashboard" className="nav-link">Dashboard</NavLink>
                    </div>
                    <div className="nav-links">
                        <NavLink to="/admin/create-exam" className="nav-link">Tests</NavLink>
                    </div>
                    <div className="nav-links">
                        <NavLink to="/admin/coding-problem" className="nav-link">Coding Problem</NavLink>
                    </div>
                    <div className="nav-links">
                        <NavLink to="/about" className="nav-link">About</NavLink>
                    </div>
                    <div className="nav-links">
                        <NavLink to="/admin/login" className="nav-link">Log Out</NavLink>
                    </div>
                </div>
            </div>
        </>
        
    )
}

export default Navbar;