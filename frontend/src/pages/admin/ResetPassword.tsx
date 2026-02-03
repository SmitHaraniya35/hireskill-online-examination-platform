import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 
import { Link } from 'react-router-dom';

const ResetPassword: React.FC = () => {
    const [passwords, setPasswords] = useState({ new: '', confirm: '' });
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Password reset successful");
        navigate('/admin/login');
    };

    const isMismatch = passwords.new !== passwords.confirm && passwords.confirm !== '';

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="brand-icon">H</div>
                    <h2>Set New Password</h2>
                    <p>Almost there! Create a strong password for your admin account.</p>
                </div>

                <form className="admin-login-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Old Password</label>
                    <input 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                        className="" 
                        // onChange={(e) => setPasswords({...passwords, old: e.target.value})}
                    />
                    </div>
                    
                    <div className="form-group">
                        <label>New Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            required 
                            className={isMismatch ? "input-error" : ""}
                            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            required 
                            className={isMismatch ? "input-error" : ""}
                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                        />
                    </div>

                    {isMismatch && (
                        <div className="error-message">
                            <span>⚠️</span> Passwords do not match
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="admin-login-btn"
                        disabled={passwords.new !== passwords.confirm || !passwords.new}
                    >
                        Update Password
                    </button>
                    <div className="form-options" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
                        <Link to="/admin/login" style={{ textDecoration: 'none', fontWeight: '600' }}>
                            ← Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;