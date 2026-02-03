import LOGO from '../assets/site-logo.png'
import './Navbar.css'
import { NavLink } from 'react-router-dom'

const Navbar:React.FC = () => {
    return (
        <>
            <div className="nav-container">
                <div className="nav-left">
                    <div className="site-logo">
                        <img className='logo' src={LOGO} alt="logo" />
                    </div>
                </div>
                <div className="nav-right">
                    <div className="nav-links">
                        <NavLink to="/create-exam" className="nav-link">Create Exam</NavLink>
                    </div>
                    <div className="nav-links">
                        <NavLink to="/see-result" className="nav-link">Result</NavLink>
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