import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 
import { Link } from 'react-router-dom';
import authService from '../../services/authAdminService';

const ResetPassword: React.FC = () => {
    const [passwords, setPasswords] = useState({ new: '', confirm: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const email = localStorage.getItem('forgot_email');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            setError('Session expired. Please try forgot password again.');
            navigate('/admin/forgot-password');
            return;
        }

        setLoading(true);
        setError('');

        const result = await authService.resetPassword(email, passwords.new);
        setLoading(false);

        if (result.success) {
            localStorage.removeItem('forgot_email');
            localStorage.removeItem('forgot_otp');
            navigate('/admin/login');
        } else {
            setError(result.message);
        }
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

                    {error && (
                        <div className="error-message">
                            <span>❌</span> {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="admin-login-btn"
                        disabled={passwords.new !== passwords.confirm || !passwords.new || loading}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
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