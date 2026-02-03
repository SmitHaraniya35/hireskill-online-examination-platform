import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './Login.css';

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p>Enter your credentials to access the admin panel</p>
                </div>
                
                <form className="admin-login-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="admin@hireskill.com" required />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                required 
                            />
                            <button 
                                type="button" 
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" /> 
                            <span>Remember me</span>
                        </label>
                        <Link to="/admin/forget-password">Forgot Password?</Link>
                    </div>

                    <button type="submit" className="admin-login-btn">
                        Login to Dashboard
                    </button>
                    <div className="reset-password">
                        <Link to="/admin/reset-password">Reset Password</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;