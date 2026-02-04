import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth(); //  Access the login function
    const navigate = useNavigate();

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            //  Call the login logic from Context
            await login(email, password);
            //  Redirect on success
            navigate('/admin/dashboard');
        } catch (err: any) {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p>Enter your credentials to access the admin panel</p>
                </div>
                
                <form className="admin-login-form" onSubmit={handleFormSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="form-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="admin@hireskill.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                        <Link to="/admin/forgot-password">Forgot Password?</Link>
                    </div>

                    <button type="submit" className="admin-login-btn">
                        Login to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;